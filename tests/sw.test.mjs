import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import test from 'node:test';
import assert from 'node:assert/strict';

const source = await readFile(new URL('../sw.js', import.meta.url), 'utf8');
const scope = 'https://example.test/kiekkokirjuri/';
const currentCache = 'kiekkokirjuri:/kiekkokirjuri/:0.6.1';
const html = '<!doctype html><meta name="app-version" content="0.6.1"><h1>Kiekkokirjuri</h1>';

function createHarness() {
  const listeners = new Map();
  const cacheStore = new Map();
  const requests = [];
  const messages = [];
  let online = true;
  let serverHTML = html;
  let unavailable = null;
  let stalled = false;
  let skipped = false;
  let claimed = false;
  const key = request => typeof request === 'string' ? request : request.url;
  const caches = {
    async keys() { return [...cacheStore.keys()]; },
    async delete(name) { return cacheStore.delete(name); },
    async open(name) {
      if (!cacheStore.has(name)) cacheStore.set(name, new Map());
      const entries = cacheStore.get(name);
      return {
        async match(request) { return entries.get(key(request))?.clone(); },
        async put(request, response) { entries.set(key(request), response.clone()); },
        async keys() { return [...entries.keys()].map(url => new Request(url)); },
      };
    },
  };
  const context = {
    URL, Request, Response, AbortController, console,
    setTimeout: (callback, duration) => setTimeout(callback, Math.min(duration, 20)),
    clearTimeout,
    caches,
    async fetch(request, options) {
      const url = key(request);
      requests.push({ url, options });
      if (!online) throw new TypeError('Network offline');
      if (stalled) {
        return new Promise((resolve, reject) => {
          options.signal.addEventListener('abort', () => reject(new Error('Aborted')), { once: true });
        });
      }
      if (url === unavailable) return new Response('missing', { status: 404 });
      const isHTML = new URL(url).pathname.endsWith('/') || new URL(url).pathname.endsWith('index.html');
      return new Response(isHTML ? serverHTML : `asset:${url}`, {
        headers: { 'content-type': isHTML ? 'text/html' : 'application/octet-stream' },
      });
    },
    self: {
      registration: { scope },
      addEventListener(name, callback) { listeners.set(name, callback); },
      async skipWaiting() { skipped = true; },
      clients: {
        async claim() { claimed = true; },
        async matchAll() {
          return [
            { url: scope, postMessage(message) { messages.push(message); } },
            { url: 'https://example.test/another-app/', postMessage() { throw new Error('Wrong scope'); } },
          ];
        },
      },
    },
  };
  vm.runInNewContext(source, context, { filename: 'sw.js' });
  return {
    caches, requests, messages,
    get skipped() { return skipped; },
    get claimed() { return claimed; },
    set online(value) { online = value; },
    set html(value) { serverHTML = value; },
    set unavailable(value) { unavailable = value; },
    set stalled(value) { stalled = value; },
    async dispatch(name, data = {}) {
      let completion;
      listeners.get(name)({ ...data, waitUntil(promise) { completion = promise; } });
      return await completion;
    },
    async request(path, { navigate = false } = {}) {
      let response;
      const request = new Request(new URL(path, scope));
      // Node's Request does not allow constructing a navigation request.
      if (navigate) Object.defineProperty(request, 'mode', { value: 'navigate' });
      listeners.get('fetch')({ request, respondWith(promise) { response = promise; } });
      return await response;
    },
    async status() {
      let result;
      await this.dispatch('message', {
        data: { type: 'GET_STATUS' },
        ports: [{ postMessage(value) { result = value; } }],
      });
      return result;
    },
  };
}

test('an installation caches a complete exact-version shell before activation', async () => {
  const worker = createHarness();
  await worker.dispatch('install');
  assert.equal(worker.skipped, true);
  const installed = await worker.status();
  assert.equal(installed.offlineReady, true);
  assert.equal(installed.version, '0.6.1');
  const entries = await (await worker.caches.open(currentCache)).keys();
  assert.equal(entries.length, 13);
  assert.ok(entries.some(entry => entry.url.endsWith('app.js?v=0.6.1')));
  assert.ok(entries.some(entry => entry.url.endsWith('model.js?v=0.6.1')));
  assert.ok(worker.requests.every(request => request.options.cache === 'no-store'));
  await worker.dispatch('activate');
  assert.equal(worker.claimed, true);
  assert.equal(worker.messages.length, 1);
  assert.equal(worker.messages[0].offlineReady, true);
});

test('a missing asset or mismatched HTML cannot replace the previous offline shell', async () => {
  for (const reason of ['missing', 'version']) {
    const worker = createHarness();
    const previous = await worker.caches.open('kiekkokirjuri-v7');
    await previous.put(`${scope}index.html`, new Response('previous shell'));
    if (reason === 'missing') worker.unavailable = `${scope}assets/icon-512.png`;
    else worker.html = html.replace('0.6.1', '0.5.0');
    await assert.rejects(worker.dispatch('install'));
    assert.equal(worker.skipped, false);
    assert.equal(await (await previous.match(`${scope}index.html`)).text(), 'previous shell');
    assert.equal((await worker.caches.keys()).includes(currentCache), false);
  }
});

test('navigation is network-first but a newer online page cannot corrupt offline fallback', async () => {
  const worker = createHarness();
  await worker.dispatch('install');
  const newerHTML = html.replace('0.6.1', '0.7.0');
  worker.html = newerHTML;
  assert.equal(await (await worker.request('./', { navigate: true })).text(), newerHTML);
  worker.online = false;
  assert.equal(await (await worker.request('./?opened=iphone', { navigate: true })).text(), html);
});

test('a stalled navigation reaches its offline fallback instead of hanging', async () => {
  const worker = createHarness();
  await worker.dispatch('install');
  worker.stalled = true;
  assert.equal(await (await worker.request('./', { navigate: true })).text(), html);
});

test('module cache lookup uses the exact release, including for previous open tabs', async () => {
  const worker = createHarness();
  await worker.dispatch('install');
  const previous = await worker.caches.open('kiekkokirjuri:/kiekkokirjuri/:0.5.0');
  await previous.put(`${scope}app.js?v=0.5.0`, new Response('previous app'));
  worker.online = false;
  assert.equal(await (await worker.request('app.js?v=0.6.1')).text(), `asset:${scope}app.js?v=0.6.1`);
  assert.equal(await (await worker.request('model.js')).text(), `asset:${scope}model.js?v=0.6.1`);
  assert.equal(await (await worker.request('app.js?v=0.5.0')).text(), 'previous app');
  assert.equal((await worker.request('app.js?v=0.4.0')).type, 'error');
  assert.equal(await worker.request('/another-app/app.js?v=0.6.1'), undefined);
  assert.equal(await worker.request('https://another.test/app.js?v=0.6.1'), undefined);
});

test('cache cleanup is scoped and keeps one previous release', async () => {
  const worker = createHarness();
  await worker.dispatch('install');
  const fixtures = {
    'kiekkokirjuri:/kiekkokirjuri/:0.4.0': `${scope}app.js?v=0.4.0`,
    'kiekkokirjuri:/kiekkokirjuri/:0.5.0': `${scope}app.js?v=0.5.0`,
    'kiekkokirjuri:/another-app/:0.5.0': 'https://example.test/another-app/index.html',
    'kiekkokirjuri-v7': `${scope}index.html`,
    'kiekkokirjuri-v6': 'https://example.test/another-app/index.html',
    'some-other-app': `${scope}unrelated.html`,
  };
  for (const [name, url] of Object.entries(fixtures)) {
    await (await worker.caches.open(name)).put(url, new Response(name));
  }
  await worker.dispatch('activate');
  const names = await worker.caches.keys();
  assert.ok(!names.includes('kiekkokirjuri:/kiekkokirjuri/:0.4.0'));
  assert.ok(!names.includes('kiekkokirjuri-v7'));
  for (const name of [currentCache, 'kiekkokirjuri:/kiekkokirjuri/:0.5.0',
    'kiekkokirjuri:/another-app/:0.5.0', 'kiekkokirjuri-v6', 'some-other-app']) {
    assert.ok(names.includes(name), `Expected preserved cache: ${name}`);
  }
});

const clientSource = await readFile(new URL('../pwa.js', import.meta.url), 'utf8');

function createClientHarness({ workerVersion = '0.6.1', offline = false } = {}) {
  let reloads = 0;
  let updateChecks = 0;
  const worker = Object.assign(new EventTarget(), {
    state: 'activated',
    postMessage(message, ports) {
      if (message.type === 'GET_STATUS') {
        ports[0].postMessage({ type: 'PWA_STATUS', version: workerVersion, scope, offlineReady: true });
        ports[0].close();
      }
    },
  });
  const registration = Object.assign(new EventTarget(), {
    scope, active: worker, installing: null, waiting: null,
    async update() { updateChecks += 1; },
  });
  const serviceWorker = Object.assign(new EventTarget(), {
    controller: worker,
    async register() {
      if (offline) throw new Error('Offline register refused');
      return registration;
    },
    async getRegistration() { return registration; },
  });
  const window = Object.assign(new EventTarget(), {
    isSecureContext: true,
    location: { reload() { reloads += 1; } },
  });
  const context = {
    URL, MessageChannel, console, setTimeout, clearTimeout,
    navigator: { serviceWorker, onLine: !offline },
    document: Object.assign(new EventTarget(), { visibilityState: 'visible' }),
    window,
  };
  // Replace only the module wrapper and module URL to run the browser-facing API
  // in a fresh Node VM with mocked browser events. No implementation is changed.
  const executable = clientSource.replace(/^export /gm, '')
    .replace('import.meta.url', JSON.stringify(`${scope}pwa.js?v=0.6.1`));
  vm.runInNewContext(`${executable}\nglobalThis.api = { setupPWA, checkForUpdate };`, context);
  return {
    api: context.api, serviceWorker,
    get reloads() { return reloads; },
    get updateChecks() { return updateChecks; },
  };
}

test('client update notification never reloads automatically and respects unsaved-work guard', async () => {
  const client = createClientHarness({ workerVersion: '0.7.0' });
  let allowed = false;
  let offered;
  const states = [];
  await client.api.setupPWA({
    onStatus: status => states.push(status),
    onUpdate: update => { offered = update; },
    canReload: () => allowed,
  });
  assert.equal(offered.version, '0.7.0');
  assert.equal(client.reloads, 0);
  client.serviceWorker.dispatchEvent(new Event('controllerchange'));
  await client.api.checkForUpdate();
  assert.equal(client.updateChecks, 1);
  assert.equal(client.reloads, 0);
  assert.equal(await offered.apply(), false);
  assert.equal(client.reloads, 0);

  // An old worker can answer after a new one; it must not hide the newer update.
  client.serviceWorker.dispatchEvent(new MessageEvent('message', { data: {
    type: 'PWA_STATUS', version: '0.6.1', scope, offlineReady: true,
  } }));
  assert.equal(states.at(-1).workerVersion, '0.7.0');
  assert.equal(states.at(-1).updateAvailable, true);
  allowed = true;
  assert.equal(await offered.apply(), true);
  assert.equal(client.reloads, 1);
});

test('an existing installed worker reports ready offline even if register rejects', async () => {
  const client = createClientHarness({ offline: true });
  let latest;
  await client.api.setupPWA({ onStatus: status => { latest = status; } });
  assert.equal(latest.offlineReady, true);
  assert.equal(latest.state, 'offline');
  assert.equal(latest.online, false);
  await client.api.checkForUpdate();
  assert.equal(client.updateChecks, 0);
  assert.equal(client.reloads, 0);
});
