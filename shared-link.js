import { elapsedPrecise, normalizeNumber, TEAM_COLORS, getTeamColor } from './model.js?v=0.8.3';

/** A public, immutable match snapshot. No account, remote store, or localStorage is used. */
export const SHARE_LIMITS = Object.freeze({
  url: 8000, decodedBytes: 256 * 1024, events: 2000, roster: 200,
  name: 120, detail: 500, label: 200, assists: 100,
});

const EVENT_TYPES = Object.freeze(['Maali', 'Torjunta', 'Jäähy', 'Laukaus']);
const SIDES = Object.freeze(['home', 'away']);
const MESSAGES = {
  SHARE_INVALID: 'Ottelulinkki tai ottelun tiedot eivät ole kelvolliset.',
  SHARE_TOO_LARGE: 'Ottelun tiedot ovat liian suuret jaettavaksi linkkinä.',
  SHARE_UNSUPPORTED: 'Ottelulinkin versiota tai pakkausta ei tueta tällä selaimella.',
};
const own = (value, key) => Object.prototype.hasOwnProperty.call(value, key);
const field = (value, key, fallback) => own(value, key) ? value[key] : fallback;
const record = value => value !== null && typeof value === 'object' && !Array.isArray(value);

function failure(code = 'SHARE_INVALID') {
  return Object.assign(new Error(MESSAGES[code]), { code });
}
function requireRecord(value) { if (!record(value)) throw failure(); return value; }
function list(value, max) {
  if (!Array.isArray(value)) throw failure();
  if (value.length > max) throw failure('SHARE_TOO_LARGE');
  return value;
}
function text(value, max) {
  if (typeof value !== 'string') throw failure();
  if (value.length > max) throw failure('SHARE_TOO_LARGE');
  return value;
}
function number(value, min, max, integer = false) {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < min || value > max
      || (integer && !Number.isInteger(value))) throw failure();
  return value;
}
function side(value) { if (!SIDES.includes(value)) throw failure(); return value; }
function jersey(value, required = false) {
  let result;
  try { result = normalizeNumber(value); } catch { throw failure(); }
  if (required && result === '') throw failure();
  return result;
}
function optionalText(value, key, max) {
  const candidate = field(value, key, '');
  return candidate === undefined || candidate === null ? '' : text(candidate, max);
}

/** Copy only report fields, and freeze the clock once. Never share archives or private notes. */
export function prepareSharedGame(game, now = Date.now()) {
  requireRecord(game);
  number(now, 0, Number.MAX_SAFE_INTEGER);
  const periodLength = number(field(game, 'periodLength', 1200), 1, 86400, true);
  const period = number(field(game, 'period', 1), 1, 1000, true);
  const seconds = number(field(game, 'seconds', 0), 0, periodLength);
  const start = field(game, 'start', null);
  if (start !== null) number(start, 0, Number.MAX_SAFE_INTEGER);
  const finished = field(game, 'finished', false);
  if (typeof finished !== 'boolean') throw failure();
  const rawDate = field(game, 'date', null);
  const date = rawDate === undefined || rawDate === null || rawDate === '' ? null : text(rawDate, 64);
  if (date !== null && !Number.isFinite(new Date(date).valueOf())) throw failure();
  const colorSource = { teamColors: field(game, 'teamColors', undefined) };
  const result = {
    home: text(field(game, 'home', 'Kiekko-Espoo'), SHARE_LIMITS.name) || 'Kiekko-Espoo',
    away: text(field(game, 'away', 'Vastustaja'), SHARE_LIMITS.name) || 'Vastustaja',
    ...(date === null ? {} : { date }),
    periodLength, period,
    seconds: elapsedPrecise({ periodLength, seconds, start }, now),
    start: null, finished,
    teamColors: Object.fromEntries(SIDES.map(team => [team, getTeamColor(colorSource, team).id])),
    roster: list(field(game, 'roster'), SHARE_LIMITS.roster).map(source => {
      requireRecord(source);
      return {
        team: side(field(source, 'team', 'home')),
        n: jersey(field(source, 'n'), true),
        name: optionalText(source, 'name', SHARE_LIMITS.name),
      };
    }),
    events: list(field(game, 'events'), SHARE_LIMITS.events).map(source => {
      requireRecord(source);
      const type = field(source, 'type');
      if (!EVENT_TYPES.includes(type)) throw failure();
      const event = {
        type, team: side(field(source, 'team', 'home')),
        period: number(field(source, 'period', period), 1, 1000, true),
        time: number(field(source, 'time', 0), 0, 86400),
        n: jersey(field(source, 'n', '')),
        assists: list(field(source, 'assists', []), SHARE_LIMITS.assists).map(n => jersey(n)),
      };
      if (type === 'Jäähy' || field(source, 'minutes') !== undefined) {
        event.minutes = number(field(source, 'minutes', 2), 0, 1000, true);
      }
      for (const key of ['penaltyLabel', 'reason', 'detail']) {
        const value = optionalText(source, key, key === 'penaltyLabel' ? SHARE_LIMITS.label : SHARE_LIMITS.detail);
        if (value) event[key] = value;
      }
      return event;
    }),
  };
  return result;
}

// Tuple format v1: names/date/clock/finished/colors/roster/events. Unknown jerseys are null.
function pack(game) {
  const n = value => value === '' ? null : Number(value);
  return [
    game.home, game.away, game.date ?? null, game.periodLength, game.period, game.seconds,
    game.finished ? 1 : 0, SIDES.map(team => TEAM_COLORS.findIndex(color => color.id === game.teamColors[team])),
    game.roster.map(player => [SIDES.indexOf(player.team), Number(player.n), player.name]),
    game.events.map(event => {
      const tuple = [EVENT_TYPES.indexOf(event.type), SIDES.indexOf(event.team), event.period,
        event.time, n(event.n), event.assists.map(n), event.minutes ?? null,
        event.penaltyLabel ?? '', event.reason ?? '', event.detail ?? ''];
      while (tuple.length > 5 && (tuple.at(-1) === null || tuple.at(-1) === ''
        || (Array.isArray(tuple.at(-1)) && tuple.at(-1).length === 0))) tuple.pop();
      return tuple;
    }),
  ];
}

function tuple(value, min, max = min) {
  if (!Array.isArray(value) || value.length < min || value.length > max) throw failure();
  return value;
}
function packedJersey(value, required = false) {
  if (value === null && !required) return '';
  return String(number(value, 0, 99, true));
}
function unpack(value) {
  const data = tuple(value, 10);
  const colors = tuple(data[7], 2).map(index => TEAM_COLORS[number(index, 0, TEAM_COLORS.length - 1, true)].id);
  if (data[6] !== 0 && data[6] !== 1) throw failure();
  const game = {
    home: data[0], away: data[1], date: data[2], periodLength: data[3], period: data[4],
    seconds: data[5], start: null, finished: data[6] === 1,
    teamColors: { home: colors[0], away: colors[1] },
    roster: list(data[8], SHARE_LIMITS.roster).map(value => {
      const entry = tuple(value, 3);
      return { team: SIDES[number(entry[0], 0, 1, true)], n: packedJersey(entry[1], true), name: entry[2] };
    }),
    events: list(data[9], SHARE_LIMITS.events).map(value => {
      const entry = tuple(value, 5, 10);
      const event = {
        type: EVENT_TYPES[number(entry[0], 0, EVENT_TYPES.length - 1, true)],
        team: SIDES[number(entry[1], 0, 1, true)], period: entry[2], time: entry[3],
        n: packedJersey(entry[4]),
        assists: entry.length > 5 ? list(entry[5], SHARE_LIMITS.assists).map(value => packedJersey(value)) : [],
      };
      if (entry.length > 6 && entry[6] !== null) event.minutes = entry[6];
      for (const [index, key] of [[7, 'penaltyLabel'], [8, 'reason'], [9, 'detail']]) {
        if (entry.length > index) event[key] = text(entry[index], key === 'penaltyLabel' ? SHARE_LIMITS.label : SHARE_LIMITS.detail);
      }
      return event;
    }),
  };
  return prepareSharedGame(game, 0);
}

function encodeBase64(bytes) {
  let binary = '';
  for (let offset = 0; offset < bytes.length; offset += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + 0x8000));
  }
  return btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '');
}
function decodeBase64(value) {
  if (!/^[A-Za-z0-9_-]+$/.test(value) || value.length % 4 === 1) throw failure();
  let bytes;
  try {
    const binary = atob(value.replaceAll('-', '+').replaceAll('_', '/') + '='.repeat((4 - value.length % 4) % 4));
    bytes = Uint8Array.from(binary, character => character.charCodeAt(0));
  } catch { throw failure(); }
  if (encodeBase64(bytes) !== value) throw failure();
  return bytes;
}

/** Stop decompression before an untrusted fragment can allocate an unbounded result. */
async function readBounded(stream) {
  const reader = stream.getReader();
  const chunks = [];
  let length = 0;
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > SHARE_LIMITS.decodedBytes) {
        try { await reader.cancel(); } catch { /* The size error remains the useful error. */ }
        throw failure('SHARE_TOO_LARGE');
      }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  const bytes = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  return bytes;
}

async function compress(bytes) {
  if (typeof globalThis.CompressionStream !== 'function') return null;
  try {
    return await readBounded(new Blob([bytes]).stream().pipeThrough(new CompressionStream('gzip')));
  } catch { return null; } // Plain JSON remains a portable fallback when compression is unavailable.
}

/** options.compression=false forces the portable JSON mode; options.now freezes a known instant. */
export async function createMatchLink(game, baseURL, options = {}) {
  const prepared = prepareSharedGame(game, options.now ?? Date.now());
  const raw = new TextEncoder().encode(JSON.stringify(pack(prepared)));
  if (raw.byteLength > SHARE_LIMITS.decodedBytes) throw failure('SHARE_TOO_LARGE');
  const compressed = options.compression === false ? null : await compress(raw);
  const useCompressed = compressed !== null && compressed.byteLength < raw.byteLength;
  let url;
  try {
    url = new URL('./kooste.html', baseURL);
    if (!['https:', 'http:'].includes(url.protocol)) throw failure();
    url.username = ''; url.password = '';
  } catch { throw failure(); }
  url.hash = `v1.${useCompressed ? 'g' : 'j'}.${encodeBase64(useCompressed ? compressed : raw)}`;
  if (url.href.length > SHARE_LIMITS.url) throw failure('SHARE_TOO_LARGE');
  return url.href;
}

/** Decode only a supported, bounded, canonical fragment into fresh report-compatible objects. */
export async function readMatchLink(fragment) {
  if (typeof fragment !== 'string') throw failure();
  if (fragment.length > SHARE_LIMITS.url) throw failure('SHARE_TOO_LARGE');
  const source = fragment.startsWith('#') ? fragment.slice(1) : fragment;
  const match = /^v([0-9]+)\.([A-Za-z0-9]+)\.([A-Za-z0-9_-]+)$/.exec(source);
  if (!match) throw failure();
  if (match[1] !== '1' || !['g', 'j'].includes(match[2])) throw failure('SHARE_UNSUPPORTED');
  let bytes = decodeBase64(match[3]);
  if (match[2] === 'g') {
    if (typeof globalThis.DecompressionStream !== 'function') throw failure('SHARE_UNSUPPORTED');
    let decompressor;
    try { decompressor = new DecompressionStream('gzip'); } catch { throw failure('SHARE_UNSUPPORTED'); }
    try { bytes = await readBounded(new Blob([bytes]).stream().pipeThrough(decompressor)); }
    catch (error) { throw error?.code === 'SHARE_TOO_LARGE' ? error : failure(); }
  }
  if (bytes.byteLength > SHARE_LIMITS.decodedBytes) throw failure('SHARE_TOO_LARGE');
  let payload;
  try { payload = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes)); }
  catch { throw failure(); }
  return unpack(payload);
}
