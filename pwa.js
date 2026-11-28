import { pwaText } from './pwa-messages.js?v=0.8.2';

/** Offline shell and explicit, non-disruptive update handling. No match data lives here. */
export const APP_VERSION = '0.8.2';

const BASE_URL = new URL('./', import.meta.url);
const STATUS_TIMEOUT_MS = 2000;
const BACKGROUND_CHECK_INTERVAL_MS = 60000;
let registration = null;
let setupPromise = null;
let checkingPromise = null;
let lastCheck = 0;
let offeredVersion = null;
let applyingUpdate = false;
let listenersAttached = false;
let callbacks = {};
let update = null;
let statusInfo = {
  state: 'checking',
  version: APP_VERSION,
  workerVersion: null,
  online: typeof navigator === 'undefined' ? true : navigator.onLine,
  offlineReady: false,
  updateAvailable: false,
  message: 'Valmistellaan offline-käyttöä…',
};
const watchedWorkers = new WeakSet();

function deliver(callback, value) {
  try { callback?.(value); }
  catch (error) { console.error('Kiekkokirjuri PWA callback failed:', error); }
}

function localizedStatus() {
  return { ...statusInfo, message: pwaText(statusInfo.message) };
}

/** Repaint the existing state after a language change; no fetch or reload. */
export function refreshPWALanguage() {
  const status = localizedStatus();
  deliver(callbacks.onStatus, status);
  return status;
}

function emitStatus(changes = {}) {
  statusInfo = { ...statusInfo, online: navigator.onLine, ...changes };
  deliver(callbacks.onStatus, localizedStatus());
  return localizedStatus();
}

function compareVersions(left, right) {
  if (!/^\d+\.\d+\.\d+$/.test(left || '') || !/^\d+\.\d+\.\d+$/.test(right || '')) return 0;
  const remote = left.split('.').map(Number);
  const local = right.split('.').map(Number);
  for (let index = 0; index < local.length; index += 1) {
    if (remote[index] !== local[index]) return remote[index] - local[index];
  }
  return 0;
}

function askWorker(worker) {
  if (!worker) return Promise.resolve(null);
  return new Promise(resolve => {
    const channel = new MessageChannel();
    const finish = value => {
      clearTimeout(timer);
      channel.port1.close();
      resolve(value);
    };
    const timer = setTimeout(() => finish(null), STATUS_TIMEOUT_MS);
    channel.port1.onmessage = event => finish(event.data);
    try { worker.postMessage({ type: 'GET_STATUS' }, [channel.port2]); }
    catch { finish(null); }
  });
}

async function applyUpdate() {
  if (applyingUpdate) return false;
  applyingUpdate = true;
  try {
    // The host app can refuse a reload while its clock is running or a form has
    // uncommitted changes. This is called only by the user's update button.
    if (callbacks.canReload && !(await callbacks.canReload())) return false;
    if (registration?.waiting) {
      const worker = registration.waiting;
      worker.postMessage({ type: 'SKIP_WAITING' });
      await new Promise(resolve => {
        const finish = () => {
          clearTimeout(timer);
          worker.removeEventListener('statechange', changed);
          resolve();
        };
        const changed = () => {
          if (worker.state === 'activated' || worker.state === 'redundant') finish();
        };
        const timer = setTimeout(finish, 4000);
        worker.addEventListener('statechange', changed);
        changed();
      });
    }
    window.location.reload();
    return true;
  } finally {
    applyingUpdate = false;
  }
}

function consumeWorkerStatus(info) {
  if (!info || info.type !== 'PWA_STATUS' || info.scope !== BASE_URL.href
    || !/^\d+\.\d+\.\d+$/.test(info.version || '')) return;
  // A slower reply from a previous worker must not erase a newer ready update.
  if (compareVersions(statusInfo.workerVersion, info.version) > 0) return;
  const ready = Boolean(info.offlineReady && compareVersions(info.version, APP_VERSION) >= 0);
  const updateAvailable = ready && compareVersions(info.version, APP_VERSION) > 0;
  const changes = {
    workerVersion: info.version,
    offlineReady: ready,
    updateAvailable,
  };
  if (updateAvailable) {
    emitStatus({ ...changes, state: 'update-ready', message: 'Uusi versio on valmis' });
    if (offeredVersion !== info.version) {
      offeredVersion = info.version;
      update = { version: info.version, apply: applyUpdate };
      deliver(callbacks.onUpdate, update);
    }
  } else if (ready) {
    emitStatus({ ...changes, state: navigator.onLine ? 'ready' : 'offline',
      message: navigator.onLine ? 'Valmis myös ilman yhteyttä' : 'Offline-käyttö valmis' });
  } else {
    emitStatus({ ...changes, state: 'installing', message: 'Valmistellaan offline-käyttöä…' });
  }
}

async function refreshStatus(worker) {
  const selected = worker || registration?.waiting || registration?.active
    || navigator.serviceWorker.controller;
  consumeWorkerStatus(await askWorker(selected));
  return localizedStatus();
}

function watchWorker(worker) {
  if (!worker || watchedWorkers.has(worker)) return;
  watchedWorkers.add(worker);
  const changed = () => {
    if (worker.state === 'installing') {
      emitStatus({ state: 'installing', message: statusInfo.offlineReady
        ? 'Ladataan päivitystä taustalla…' : 'Valmistellaan offline-käyttöä…' });
    } else if (worker.state === 'installed' || worker.state === 'activated') {
      void refreshStatus(worker);
    } else if (worker.state === 'redundant') {
      // An interrupted download must not make a working older offline shell look
      // broken. The browser will try installation again on the next update check.
      void refreshStatus();
      if (!statusInfo.offlineReady) emitStatus({ state: 'error',
        message: 'Offline-versio ei vielä valmistunut. Yritä uudelleen yhteydessä.' });
    }
  };
  worker.addEventListener('statechange', changed);
  changed();
}

/**
 * Start once after rendering the app. It is safe to call without awaiting it.
 * onStatus({ state, version, workerVersion, online, offlineReady, updateAvailable, message })
 * onUpdate({ version, apply }) exposes an explicit user-triggered reload.
 * Optional canReload() may return boolean or Promise<boolean>; false cancels it.
 */
export function setupPWA(options = {}) {
  callbacks = { ...callbacks, ...options };
  deliver(callbacks.onStatus, localizedStatus());
  if (update) deliver(callbacks.onUpdate, update);
  if (setupPromise) return setupPromise;
  setupPromise = (async () => {
    if (!('serviceWorker' in navigator) || !window.isSecureContext) {
      emitStatus({ state: 'unsupported', message: 'Offline-käyttö tarvitsee HTTPS-yhteyden ja tuetun selaimen.' });
      return null;
    }
    if (!listenersAttached) {
      listenersAttached = true;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        // Never reload here. A game can be in progress when a new worker takes over.
        void refreshStatus();
      });
      navigator.serviceWorker.addEventListener('message', event => {
        consumeWorkerStatus(event.data);
      });
      window.addEventListener('online', () => {
        emitStatus({ message: statusInfo.offlineReady ? 'Valmis myös ilman yhteyttä' : 'Yhteys palautui' });
        void checkForUpdate();
      });
      window.addEventListener('offline', () => {
        emitStatus({ state: statusInfo.updateAvailable ? 'update-ready' : 'offline',
          message: statusInfo.offlineReady ? 'Offline-käyttö valmis' : 'Avaa sovellus ensin verkkoyhteydessä' });
      });
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible' && navigator.onLine
          && Date.now() - lastCheck > BACKGROUND_CHECK_INTERVAL_MS) void checkForUpdate();
      });
    }
    try {
      try {
        registration = await navigator.serviceWorker.register(new URL('sw.js', BASE_URL).href, {
          scope: BASE_URL.href,
          updateViaCache: 'none',
        });
      } catch (error) {
        // Some browsers reject register() offline even though this scope already
        // has a usable installed worker. Read that registration before giving up.
        const existing = await navigator.serviceWorker.getRegistration(BASE_URL.href);
        if (!existing || existing.scope !== BASE_URL.href || !existing.active) throw error;
        registration = existing;
      }
      registration.addEventListener('updatefound', () => watchWorker(registration.installing));
      watchWorker(registration.installing);
      watchWorker(registration.waiting);
      watchWorker(registration.active);
      lastCheck = Date.now();
      await refreshStatus();
      return registration;
    } catch (error) {
      emitStatus({ state: 'error', message: navigator.onLine
        ? 'Offline-käyttöä ei saatu valmiiksi. Päivityksen voi tarkistaa uudelleen.'
        : 'Offline-versiota ei ole vielä ladattu tälle laitteelle.' });
      console.warn('Kiekkokirjuri offline setup:', error);
      // Allow a later explicit check to retry a failed initial registration.
      setupPromise = null;
      return null;
    }
  })();
  return setupPromise;
}

/** Check the browser's service-worker update endpoint; never reload the page. */
export async function checkForUpdate() {
  if (checkingPromise) return checkingPromise;
  checkingPromise = (async () => {
    if (!registration) await setupPWA();
    if (!registration) return localizedStatus();
    if (!navigator.onLine) {
      return emitStatus({ state: statusInfo.updateAvailable ? 'update-ready' : 'offline',
        message: statusInfo.offlineReady ? 'Offline-käyttö valmis' : 'Päivitys tarvitsee verkkoyhteyden' });
    }
    lastCheck = Date.now();
    try {
      await registration.update();
      watchWorker(registration.installing);
      watchWorker(registration.waiting);
      await refreshStatus();
    } catch (error) {
      emitStatus({ message: statusInfo.offlineReady
        ? 'Offline-versio valmis. Päivityksen tarkistus ei onnistunut.'
        : 'Päivityksen tarkistus ei onnistunut. Yritä uudelleen yhteydessä.' });
      console.warn('Kiekkokirjuri update check:', error);
    }
    return localizedStatus();
  })();
  try { return await checkingPromise; }
  finally { checkingPromise = null; }
}

/** Optional: call from a deliberate user action, e.g. enabling offline storage. */
export async function requestPersistentStorage() {
  if (!navigator.storage?.persist) return false;
  try {
    if (await navigator.storage.persisted?.()) return true;
    return await navigator.storage.persist();
  } catch { return false; }
}
