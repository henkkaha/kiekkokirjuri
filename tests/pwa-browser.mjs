/**
 * Real-browser PWA upgrade test. This starts its own server under the same subpath
 * as GitHub Pages, installs the actual v0.5 worker, then changes server releases.
 * No app files or real user storage are changed. Run: node tests/pwa-browser.mjs
 */
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
assert.match(await readFile(path.join(repo, 'app.js'), 'utf8'), /\/\/ Application ready\.\s*$/,
  'Wait until the complete application is ready before running browser integration tests.');
const nodeModules = process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES;
assert.ok(nodeModules, 'CODEX_PRIMARY_RUNTIME_NODE_MODULES must identify the Playwright runtime.');
const { chromium, devices } = await import(pathToFileURL(path.join(nodeModules, 'playwright/index.js')).href);
const legacyRef = process.env.PWA_LEGACY_REF || '703a51c65d7cb99401082a4c34230606c6ed0a7f';
const oldFiles = new Map(['index.html', 'sw.js', 'manifest.json', 'icon.svg'].map(file => [file,
  execFileSync('git', ['show', `${legacyRef}:${file}`], { cwd: repo })]));
const port = Number(process.env.PWA_TEST_PORT || 4174);
const appURL = `http://127.0.0.1:${port}/kiekkokirjuri/`;
const artifacts = process.env.PWA_TEST_ARTIFACTS || path.resolve(repo, '../qa-pwa');
await mkdir(artifacts, { recursive: true });
let serverRelease = 'legacy';
const served = [];
const mime = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json',
  '.svg': 'image/svg+xml', '.png': 'image/png',
};
const server = http.createServer(async (request, response) => {
  const url = new URL(request.url, appURL);
  if (!url.pathname.startsWith('/kiekkokirjuri/')) {
    response.writeHead(404).end('Outside app scope');
    return;
  }
  const file = decodeURIComponent(url.pathname.slice('/kiekkokirjuri/'.length)) || 'index.html';
  const absolute = path.resolve(repo, file);
  if (!absolute.startsWith(`${repo}${path.sep}`)) {
    response.writeHead(403).end('Invalid path');
    return;
  }
  try {
    let body = serverRelease === 'legacy' && oldFiles.has(file)
      ? oldFiles.get(file) : await readFile(absolute);
    // A synthetic next release tests activation while the current page is busy.
    // It is generated only by this isolated server; source files stay untouched.
    if (serverRelease === 'next' && /\.(html|js|css|json)$/.test(file)) {
      body = Buffer.from(body.toString('utf8').replaceAll('0.7.1', '0.7.2'));
    }
    served.push({ release: serverRelease, pathname: url.pathname, search: url.search });
    response.writeHead(200, {
      'Content-Type': mime[path.extname(file)] || 'application/octet-stream',
      'Cache-Control': 'no-store',
      'Service-Worker-Allowed': '/kiekkokirjuri/',
    }).end(body);
  } catch {
    response.writeHead(404).end('Not found');
  }
});
await new Promise((resolve, reject) => {
  server.once('error', reject);
  server.listen(port, '127.0.0.1', resolve);
});

const fixture = {
  home: 'Kiekko-Espoo', away: 'Testi-Vieras', period: 2, periodLength: 900,
  seconds: 125, start: null,
  roster: [
    { n: 0, name: 'Nolla', team: 'home' },
    { n: '7', name: 'Syöttäjä', team: 'home' },
    { n: '30', name: 'Torjuja', team: 'home' },
    { n: '11', name: 'Vieras', team: 'away' },
    { n: '35', name: 'Vierastorjuja', team: 'away' },
  ],
  events: [
    { type: 'Maali', team: 'home', n: 0, assists: ['7'], period: 1, time: 55 },
    { type: 'Maali', team: 'home', n: '7', assists: [0], period: 2, time: 90 },
    { type: 'Maali', team: 'away', n: '11', assists: [], period: 1, time: 100 },
    ...[20, 30, 40].map(time => ({ type: 'Torjunta', team: 'home', n: '30', assists: [], period: 2, time })),
    ...[45, 50, 60, 70].map(time => ({ type: 'Torjunta', team: 'away', n: '35', assists: [], period: 2, time })),
    ...[85, 95].map(time => ({ type: 'Laukaus', team: 'home', n: '7', assists: [], period: 2, time })),
    { type: 'Jäähy', team: 'away', n: '11', assists: [], period: 2, time: 105,
      reason: '57 – Kampitus', minutes: 2.01, penaltyLabel: '2 min – joukkuerangaistus' },
  ],
  archive: [{
    home: 'Edellinen koti', away: 'Edellinen vieras', period: 3, periodLength: 1200,
    seconds: 1200, start: null, roster: [{ n: '0', name: 'Nolla vanhassa', team: 'home' }],
    events: [{ type: 'Maali', team: 'home', n: '0', assists: [], period: 1, time: 10 }],
  }],
};

async function waitForRelease(page, version) {
  await page.waitForFunction(async expected => {
    const registration = await navigator.serviceWorker.getRegistration();
    if (!registration?.active) return false;
    const info = await new Promise(resolve => {
      const channel = new MessageChannel();
      const timer = setTimeout(() => { channel.port1.close(); resolve(null); }, 1500);
      channel.port1.onmessage = event => {
        clearTimeout(timer); channel.port1.close(); resolve(event.data);
      };
      registration.active.postMessage({ type: 'GET_STATUS' }, [channel.port2]);
    });
    return info?.version === expected && info.offlineReady;
  }, version, { timeout: 30000, polling: 250 });
}

async function readEvidence(page, version = '0.7.1') {
  return page.evaluate(async expected => {
    const model = await import(`./model.js?v=${expected}`);
    const raw = JSON.parse(localStorage.getItem('ke-match-v1'));
    const game = model.normalizeState(raw);
    const stats = model.teamStats(game);
    const zero = model.playerStats(game, 'home').find(player => player.n === '0');
    return {
      version: document.querySelector('meta[name="app-version"]').content,
      score: { home: document.querySelector('[data-score="home"]').textContent,
        away: document.querySelector('[data-score="away"]').textContent },
      shots: document.querySelector('[data-stat="shots"]').textContent,
      saves: document.querySelector('[data-stat="saves"]').textContent,
      connection: document.querySelector('#connection-label').textContent,
      online: navigator.onLine,
      clock: document.querySelector('#clock').textContent,
      eventCount: game.events.length,
      legacyAttempts: game.events.filter(event => event.type === 'Laukaus').length,
      archiveCount: game.archive.length,
      archiveGoals: model.score(game.archive[0]),
      playerZero: zero,
      penaltyMinutes: stats.away.penaltyMinutes,
      calculatedStats: stats,
      caches: await caches.keys(),
      unrelatedStorage: localStorage.getItem('unrelated-app-key'),
    };
  }, version);
}

function assertMatchPreserved(evidence) {
  assert.deepEqual(evidence.score, { home: '2', away: '1' });
  assert.equal(evidence.shots, '6 – 4');
  assert.equal(evidence.saves, '3 – 4');
  assert.equal(evidence.eventCount, 13);
  assert.equal(evidence.legacyAttempts, 2);
  assert.equal(evidence.archiveCount, 1);
  assert.deepEqual(evidence.archiveGoals, { home: 1, away: 0 });
  assert.equal(evidence.playerZero.n, '0');
  assert.equal(evidence.playerZero.name, 'Nolla');
  assert.equal(evidence.playerZero.goals, 1);
  assert.equal(evidence.playerZero.assists, 1);
  assert.equal(evidence.playerZero.points, 2);
  assert.equal(evidence.penaltyMinutes, 2);
  assert.equal(evidence.unrelatedStorage, 'untouched');
  assert.ok(evidence.caches.includes('other-app-offline-test'));
}

let browser;
let page;
let stage = 'launch';
const result = { success: false, appURL, legacyRef, stages: [], jsErrors: [] };
try {
  const executablePath = process.env.PWA_BROWSER_EXECUTABLE
    || (!existsSync(chromium.executablePath()) && existsSync('/usr/lib/chromium/chromium')
      ? '/usr/lib/chromium/chromium' : undefined);
  browser = await chromium.launch({ executablePath, headless: true, args: ['--no-sandbox'] });
  result.browser = browser.version();
  result.viewport = { width: 390, height: 844 };
  result.engine = 'Chromium with iPhone 13 viewport and mobile emulation';
  const context = await browser.newContext({ ...devices['iPhone 13'], locale: 'fi-FI', serviceWorkers: 'allow' });
  page = await context.newPage();
  page.on('pageerror', error => result.jsErrors.push({ stage, message: error.message }));

  stage = 'legacy-installation';
  await page.goto(appURL, { waitUntil: 'networkidle' });
  await page.waitForFunction(async () => navigator.serviceWorker.controller
    && (await caches.keys()).includes('kiekkokirjuri-v7'), null, { timeout: 20000 });
  await page.evaluate(async data => {
    localStorage.setItem('ke-match-v1', JSON.stringify(data));
    localStorage.setItem('unrelated-app-key', 'untouched');
    const cache = await caches.open('other-app-offline-test');
    await cache.put('/other-app/sentinel', new Response('keep me'));
  }, fixture);
  await page.reload({ waitUntil: 'networkidle' });
  assert.equal(await page.locator('.score').textContent(), '2 – 1');
  assert.match(await page.locator('.scoreboard').textContent(), /Laukaukset: 8 – 4/);
  result.stages.push({ stage, oldScore: '2 – 1', oldShots: '8 – 4', oldCache: 'kiekkokirjuri-v7' });

  stage = 'upgrade-to-0.7.1';
  serverRelease = 'current';
  await page.reload({ waitUntil: 'networkidle' });
  await page.locator('[data-score="home"]').waitFor();
  await waitForRelease(page, '0.7.1');
  const upgraded = await readEvidence(page);
  assertMatchPreserved(upgraded);
  assert.equal(upgraded.version, '0.7.1');
  assert.equal(upgraded.clock, '12:55');
  assert.ok(!upgraded.caches.includes('kiekkokirjuri-v7'));
  assert.deepEqual(await page.evaluate(() => JSON.parse(localStorage.getItem('ke-match-v1'))), fixture,
    'Merely opening the upgraded app must not rewrite or erase legacy match storage.');
  await page.screenshot({ path: path.join(artifacts, 'pwa-upgraded-mobile.png'), fullPage: true });
  result.stages.push({ stage, ...upgraded });

  stage = 'offline-reload';
  await context.setOffline(true);
  await page.reload({ waitUntil: 'load' });
  await page.locator('[data-score="home"]').waitFor();
  await waitForRelease(page, '0.7.1');
  const offline = await readEvidence(page);
  assertMatchPreserved(offline);
  assert.equal(offline.online, false);
  assert.equal(offline.version, '0.7.1');
  assert.deepEqual(await page.evaluate(() => JSON.parse(localStorage.getItem('ke-match-v1'))), fixture);
  await page.locator('a[href="#pelaajat"]').click();
  assert.match(await page.locator('[data-action="edit-player"][data-number="0"]').textContent(), /Nolla/);
  await page.locator('a[href="#ottelut"]').click();
  assert.equal(await page.locator('[data-action="archive-detail"]').count(), 1);
  assert.match(await page.locator('[data-action="archive-detail"]').textContent(), /Edellinen koti/);
  await page.locator('#navigation a[href="#ottelu"]').click();
  await page.screenshot({ path: path.join(artifacts, 'pwa-offline-mobile.png'), fullPage: true });
  result.stages.push({ stage, ...offline, rosterAndArchiveUsable: true });

  stage = 'new-worker-with-running-clock-and-unsaved-form';
  await context.setOffline(false);
  await page.locator('#clock-toggle').click();
  const clockStart = await page.evaluate(() => JSON.parse(localStorage.getItem('ke-match-v1')).start);
  assert.equal(typeof clockStart, 'number');
  await page.locator('[data-action="event"][data-type="Maali"]').click();
  await page.locator('[data-action="event-team"][data-team="home"]').click();
  await page.locator('#manual-number').fill('44');
  const sentinel = 'this-page-must-not-reload';
  await page.evaluate(token => { window.__pwaTestPageToken = token; }, sentinel);
  serverRelease = 'next';
  await page.evaluate(async () => (await navigator.serviceWorker.getRegistration()).update());
  await waitForRelease(page, '0.7.2');
  await page.locator('#update-banner:not([hidden])').waitFor();
  assert.equal(await page.evaluate(() => window.__pwaTestPageToken), sentinel);
  assert.equal(await page.locator('meta[name="app-version"]').getAttribute('content'), '0.7.1');
  assert.equal(await page.locator('#manual-number').inputValue(), '44');
  assert.equal(await page.evaluate(() => document.querySelector('#sheet').open), true);
  assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem('ke-match-v1')).start), clockStart);
  assert.match(await page.locator('#update-banner').textContent(), /0\.7\.2/);
  await page.screenshot({ path: path.join(artifacts, 'pwa-update-preserves-form.png'), fullPage: true });
  result.stages.push({ stage, installedWorker: '0.7.2', visiblePage: '0.7.1',
    noAutomaticReload: true, unsavedNumber: '44', clockRunning: true });

  stage = 'explicit-update-guard-and-apply';
  await page.locator('#sheet [data-action="close-sheet"]').first().click();
  await page.locator('[data-action="apply-update"]').click();
  assert.equal(await page.evaluate(() => window.__pwaTestPageToken), sentinel);
  assert.match(await page.locator('#toast').textContent(), /Pysäytä kello/);
  await page.locator('#clock-toggle').click();
  assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem('ke-match-v1')).start), null);
  await page.locator('[data-action="apply-update"]').click();
  await page.waitForFunction(() => document.querySelector('meta[name="app-version"]')?.content === '0.7.2');
  await page.locator('[data-score="home"]').waitFor();
  const applied = await readEvidence(page, '0.7.2');
  assertMatchPreserved(applied);
  result.stages.push({ stage, blockedWhileClockRunning: true, appliedVersion: applied.version,
    matchAndArchivePreserved: true });
  assert.deepEqual(result.jsErrors, []);
  result.success = true;
  console.log(JSON.stringify(result, null, 2));
} catch (error) {
  result.error = { stage, message: error.message, stack: error.stack };
  if (page) await page.screenshot({ path: path.join(artifacts, 'pwa-failure.png'), fullPage: true }).catch(() => {});
  console.error(JSON.stringify(result, null, 2));
  process.exitCode = 1;
} finally {
  result.servedReleases = Object.fromEntries(['legacy', 'current', 'next'].map(release => [release,
    served.filter(request => request.release === release).length]));
  await writeFile(path.join(artifacts, 'pwa-browser-results.json'), JSON.stringify(result, null, 2));
  if (browser) await browser.close();
  await new Promise(resolve => server.close(resolve));
}
