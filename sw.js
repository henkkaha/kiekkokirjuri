/* Kiekkokirjuri: an immutable, complete offline shell for each release. */
const RELEASE = '0.8.0';
const SCOPE = new URL(self.registration.scope);
const CACHE_PREFIX = `kiekkokirjuri:${SCOPE.pathname}:`;
const CACHE_NAME = `${CACHE_PREFIX}${RELEASE}`;
const INDEX_URL = new URL('./index.html', SCOPE).href;
const NAVIGATION_TIMEOUT_MS = 4000;
const ASSET_TIMEOUT_MS = 15000;
const ASSETS = [
  './index.html',
  `./styles.css?v=${RELEASE}`,
  `./help.css?v=${RELEASE}`,
  `./app.js?v=${RELEASE}`,
  `./model.js?v=${RELEASE}`,
  `./reports.js?v=${RELEASE}`,
  `./pwa.js?v=${RELEASE}`,
  `./help.js?v=${RELEASE}`,
  `./feedback.js?v=${RELEASE}`,
  `./i18n.js?v=${RELEASE}`,
  `./ui-messages.js?v=${RELEASE}`,
  `./domain-messages.js?v=${RELEASE}`,
  `./model-messages.js?v=${RELEASE}`,
  `./pwa-messages.js?v=${RELEASE}`,
  `./help-messages.js?v=${RELEASE}`,
  `./report-messages.js?v=${RELEASE}`,
  './manifest.json',
  './assets/club-logo.svg',
  './assets/club-logo.png',
  './assets/icon-kk-192.png',
  './assets/icon-kk-512.png',
  './assets/apple-touch-icon-kk.png',
].map(path => new URL(path, SCOPE).href);
const ASSET_URLS = new Set(ASSETS);
const MODULE_PATHS = new Set(['app.js', 'model.js', 'reports.js', 'pwa.js', 'help.js', 'feedback.js', 'i18n.js', 'ui-messages.js', 'domain-messages.js', 'model-messages.js', 'pwa-messages.js', 'help-messages.js', 'report-messages.js', 'styles.css', 'help.css']
  .map(path => new URL(path, SCOPE).pathname));

function belongsToScope(url) {
  const parsed = new URL(url);
  return parsed.origin === SCOPE.origin && parsed.pathname.startsWith(SCOPE.pathname);
}

async function fetchFresh(request, timeout) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(request, { cache: 'no-store', signal: controller.signal });
    // Include the body in the deadline: receiving just the headers is not enough
    // to make a partial mobile download usable offline.
    if (response.ok) await response.clone().arrayBuffer();
    return response;
  } finally {
    clearTimeout(timer);
  }
}

async function offlineReady() {
  if (!(await caches.keys()).includes(CACHE_NAME)) return false;
  const cache = await caches.open(CACHE_NAME);
  const entries = await Promise.all(ASSETS.map(url => cache.match(url)));
  return entries.every(Boolean);
}

async function status() {
  return {
    type: 'PWA_STATUS',
    version: RELEASE,
    scope: SCOPE.href,
    offlineReady: await offlineReady(),
  };
}

async function notifyClients(message) {
  const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
  for (const client of windows) {
    if (belongsToScope(client.url)) client.postMessage(message);
  }
}

function releaseNumber(name) {
  return name.slice(CACHE_PREFIX.length).split('.').map(Number);
}

function newestFirst(a, b) {
  const left = releaseNumber(a);
  const right = releaseNumber(b);
  for (let index = 0; index < Math.max(left.length, right.length); index += 1) {
    const difference = (right[index] || 0) - (left[index] || 0);
    if (difference) return difference;
  }
  return 0;
}

async function cleanOldShells() {
  const names = await caches.keys();
  const previous = names.filter(name => name.startsWith(CACHE_PREFIX)
    && name !== CACHE_NAME
    && /^\d+\.\d+\.\d+$/.test(name.slice(CACHE_PREFIX.length))).sort(newestFirst);
  // Keep the preceding shell for a tab which is still running the previous release.
  for (const name of previous.slice(1)) await caches.delete(name);

  // v0.5 used a shared-looking name. Only remove it when every entry proves that
  // it belongs to this scope; never clear another app's caches on this origin.
  for (const name of names.filter(name => /^kiekkokirjuri-v\d+$/.test(name))) {
    const cache = await caches.open(name);
    const requests = await cache.keys();
    if (requests.length && requests.every(request => belongsToScope(request.url))) {
      await caches.delete(name);
    }
  }
}

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    // Fetch everything before writing anything. A failed or partial deployment
    // leaves the previously installed worker and its offline shell intact.
    const responses = await Promise.all(ASSETS.map(async url => {
      const response = await fetchFresh(new Request(url, { cache: 'no-store' }), ASSET_TIMEOUT_MS);
      if (!response.ok) throw new Error(`Offline asset unavailable: ${url}`);
      const contentType = response.headers.get('content-type') || '';
      if ((/\.(?:js|css)$/.test(new URL(url).pathname)) && /text\/html/i.test(contentType)) {
        throw new Error(`An HTML page was returned for an offline asset: ${url}`);
      }
      return response;
    }));

    const html = await responses[0].clone().text();
    const marker = html.match(/<meta\s+name=["']app-version["']\s+content=["']([^"']+)["'][^>]*>/i);
    if (!marker || marker[1] !== RELEASE) {
      throw new Error('The page and service worker belong to different releases.');
    }

    const existed = (await caches.keys()).includes(CACHE_NAME);
    try {
      const cache = await caches.open(CACHE_NAME);
      await Promise.all(ASSETS.map((url, index) => cache.put(url, responses[index])));
    } catch (error) {
      if (!existed) await caches.delete(CACHE_NAME);
      throw error;
    }
    // Claiming a new worker does not reload any page. The app offers an explicit
    // update action, so an active clock or an unfinished form is never disrupted.
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    await cleanOldShells();
    await self.clients.claim();
    await notifyClients(await status());
  })());
});

async function navigate(request) {
  const cache = await caches.open(CACHE_NAME);
  const installed = await cache.match(INDEX_URL);
  if (installed) return installed;
  try { return await fetchFresh(request, NAVIGATION_TIMEOUT_MS); }
  catch { return Response.error(); }
}

async function asset(request, canonicalURL) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(canonicalURL || request.url);
  if (cached) return cached;

  // Exact version matching also lets an already-open previous-release tab finish
  // loading its own modules. Deliberately never use ignoreSearch here.
  if (!canonicalURL) {
    const names = (await caches.keys()).filter(name => name.startsWith(CACHE_PREFIX)
      && name !== CACHE_NAME).sort(newestFirst);
    for (const name of names) {
      const previous = await (await caches.open(name)).match(request);
      if (previous) return previous;
    }
  }
  try {
    return await fetchFresh(request, ASSET_TIMEOUT_MS);
  } catch {
    return Response.error();
  }
}

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET' || !belongsToScope(request.url)) return;
  if (request.mode === 'navigate') {
    event.respondWith(navigate(request));
    return;
  }
  const url = new URL(request.url);
  if (ASSET_URLS.has(url.href)) {
    event.respondWith(asset(request, url.href));
  } else if (MODULE_PATHS.has(url.pathname)) {
    // Compatibility for an unversioned import. New app imports are versioned.
    if (!url.search) {
      url.searchParams.set('v', RELEASE);
      event.respondWith(asset(request, url.href));
    } else {
      event.respondWith(asset(request));
    }
  }
});

self.addEventListener('message', event => {
  if (event.data?.type === 'GET_STATUS') {
    event.waitUntil((async () => {
      const message = await status();
      if (event.ports?.[0]) event.ports[0].postMessage(message);
      else event.source?.postMessage(message);
    })());
  } else if (event.data?.type === 'SKIP_WAITING') {
    event.waitUntil(self.skipWaiting());
  }
});
