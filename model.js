import { modelText } from './model-messages.js?v=0.7.3';

/** The storage shape deliberately stays compatible with ke-match-v1 backups. */
export const VERSION = '0.7.3';

const DEFAULT_LENGTH = 20 * 60;
const NEW_EVENT_TYPES = new Set(['Maali', 'Torjunta', 'Jäähy']);
const TEAMS = new Set(['home', 'away']);
const own = (object, key) => Object.prototype.hasOwnProperty.call(object, key);
const record = value => value !== null && typeof value === 'object' && !Array.isArray(value);

function copy(value) {
  try {
    return typeof structuredClone === 'function'
      ? structuredClone(value)
      : JSON.parse(JSON.stringify(value));
  } catch {
    throw new Error(modelText('Ottelun tietoja ei voi lukea. Tarkista varmuuskopion muoto.'));
  }
}

function newId(prefix = 'game') {
  const random = globalThis.crypto?.randomUUID?.()
    ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`;
  return `${prefix}-${random}`;
}

function claimId(item, used, prefix) {
  const existing = typeof item.id === 'string' || typeof item.id === 'number'
    ? String(item.id).trim() : '';
  if (existing && !used.has(existing)) {
    used.add(existing);
    return existing;
  }
  if (existing && !own(item, 'originalId')) item.originalId = item.id;
  let id;
  do { id = newId(prefix); } while (used.has(id));
  used.add(id);
  return id;
}

function numeric(value, fallback, label) {
  if (value === undefined || value === null || value === '') return fallback;
  if ((typeof value !== 'number' && typeof value !== 'string') || !Number.isFinite(Number(value))) {
    throw new Error(modelText('{label} ei ole kelvollinen luku.', { label: modelText(label) }));
  }
  return Number(value);
}

function periodNumber(value, fallback = 1) {
  const result = numeric(value, fallback, 'Erä');
  if (!Number.isInteger(result) || result < 1 || result > 1000) {
    throw new Error(modelText('Erän pitää olla kokonaisluku väliltä 1–1000.'));
  }
  return result;
}

function periodLength(value) {
  const result = numeric(value, DEFAULT_LENGTH, 'Erän pituus');
  if (!Number.isInteger(result) || result < 1 || result > 86400) {
    throw new Error(modelText('Erän pituuden pitää olla 1–86400 sekuntia.'));
  }
  return result;
}

function text(value, fallback = '') {
  if (value === undefined || value === null) return fallback;
  if (typeof value !== 'string' && typeof value !== 'number') {
    throw new Error(modelText('Ottelussa on virheellinen tekstikenttä.'));
  }
  return String(value).trim();
}

function team(value, fallback) {
  const result = value === undefined || value === null || value === '' ? fallback : value;
  if (!TEAMS.has(result)) throw new Error(modelText('Valitse koti- tai vierasjoukkue.'));
  return result;
}

/** Empty input means an unknown player; the number zero is a real jersey number. */
export function normalizeNumber(input) {
  if (input === undefined || input === null || input === '') return '';
  const value = typeof input === 'string' ? input.trim() : input;
  if (value === '') return '';
  if ((typeof value !== 'number' && typeof value !== 'string')
      || !/^\d+$/.test(String(value)) || !Number.isInteger(Number(value))
      || Number(value) < 0 || Number(value) > 99) {
    throw new Error(modelText('Pelaajan numeron pitää olla kokonaisluku väliltä 0–99.'));
  }
  return String(Number(value));
}

/** null asks once, an empty string deliberately records saves without a number. */
function normalizeActiveGoalies(value) {
  if (value === undefined) return { home: null, away: null };
  if (!record(value) || Object.keys(value).some(key => !TEAMS.has(key))) {
    throw new Error(modelText('Ottelun maalivahtivalinnat eivät ole kelvolliset.'));
  }
  return Object.fromEntries([...TEAMS].map(side => {
    const number = own(value, side) ? value[side] : null;
    return [side, number === null || number === undefined ? null : normalizeNumber(number)];
  }));
}

/** The active goalkeeper is independent for each team and never inferred from old events. */
export function getActiveGoalie(game, side) {
  return normalizeActiveGoalies(game?.activeGoalies)[team(side)];
}

/** Only future saves use this choice; existing events retain their original goalkeeper. */
export function setActiveGoalie(game, side, number) {
  const selectedTeam = team(side);
  if (number === undefined) throw new Error(modelText('Valitse maalivahti tai kirjaa ilman numeroa.'));
  const selectedNumber = number === null ? null : normalizeNumber(number);
  const next = copy(game);
  next.activeGoalies = { ...normalizeActiveGoalies(game.activeGoalies), [selectedTeam]: selectedNumber };
  if (selectedNumber !== null && selectedNumber !== ''
      && !next.roster.some(player => player.team === selectedTeam && player.n === selectedNumber)) {
    next.roster.push({ n: selectedNumber, name: '', team: selectedTeam });
  }
  return next;
}

/** Capture time/period at the initial tap and pass them through unchanged here. */
export function recordSave(game, { team: side, time, period } = {}) {
  const selectedTeam = team(side);
  const number = getActiveGoalie(game, selectedTeam);
  if (number === null) throw new Error(modelText('Valitse maalivahti ennen torjunnan kirjaamista.'));
  const next = setActiveGoalie(game, selectedTeam, number);
  const event = validateEvent({ type: 'Torjunta', team: selectedTeam, n: number, assists: [], time, period }, game);
  claimId(event, new Set([game.id, ...game.events.map(item => item.id)]), 'event');
  next.events.push(event);
  return next;
}

function penaltyMinutes(value, fallback = 2) {
  let result = numeric(value, fallback, 'Rangaistusminuutit');
  // v0.5 used 2.01 as the selection value for a two-minute bench minor.
  if (result === 2.01) result = 2;
  if (!Number.isInteger(result) || result < 0 || result > 1000) {
    throw new Error(modelText('Rangaistusminuuttien pitää olla kokonaisluku väliltä 0–1000.'));
  }
  return result;
}

export function createGame({ home = 'Kiekko-Espoo', away = 'Vastustaja', periodLength: length = DEFAULT_LENGTH } = {}) {
  return {
    id: newId(), date: new Date().toISOString(), version: VERSION,
    home: text(home) || 'Kiekko-Espoo', away: text(away) || 'Vastustaja',
    period: 1, periodLength: periodLength(length), seconds: 0, start: null,
    roster: [], events: [], archive: [], activeGoalies: { home: null, away: null }
  };
}

/** Migrate a complete backup atomically: bad data throws, rather than losing events. */
export function normalizeState(raw) {
  if (!record(raw)) throw new Error(modelText('Varmuuskopion pitää sisältää ottelun tiedot.'));
  const data = copy(raw);
  const usedIds = new Set();
  const ancestors = new WeakSet();

  function migrate(source) {
    if (!record(source) || !Array.isArray(source.roster) || !Array.isArray(source.events)) {
      throw new Error(modelText('Varmuuskopiosta puuttuu kelvollinen pelaaja- tai tapahtumalista.'));
    }
    if (ancestors.has(source)) throw new Error(modelText('Varmuuskopio sisältää kehämäisen otteluarkiston.'));
    if (source.archive !== undefined && !Array.isArray(source.archive)) {
      throw new Error(modelText('Varmuuskopion otteluarkisto ei ole kelvollinen lista.'));
    }
    ancestors.add(source);
    const game = { ...source };
    delete game.archive;
    game.id = claimId(game, usedIds, 'game');
    game.home = text(game.home, 'Kiekko-Espoo') || 'Kiekko-Espoo';
    game.away = text(game.away, 'Vastustaja') || 'Vastustaja';
    game.period = periodNumber(game.period);
    game.periodLength = periodLength(game.periodLength === 0 ? DEFAULT_LENGTH : game.periodLength);
    game.seconds = Math.min(game.periodLength, Math.max(0, numeric(game.seconds, 0, 'Kulunut aika')));
    game.start = game.start === undefined || game.start === null || game.start === '' || game.start === false
      ? null : numeric(game.start, null, 'Kellon aloitusaika');
    if (game.start !== null && game.start < 0) throw new Error(modelText('Kellon aloitusaika ei ole kelvollinen.'));
    game.activeGoalies = normalizeActiveGoalies(source.activeGoalies);

    game.roster = source.roster.map(player => {
      if (!record(player)) throw new Error(modelText('Varmuuskopiossa on virheellinen pelaaja.'));
      const n = normalizeNumber(player.n);
      if (n === '') throw new Error(modelText('Kokoonpanon pelaajalta puuttuu numero.'));
      return { ...player, n, name: text(player.name), team: team(player.team, 'home') };
    });

    game.events = source.events.map(sourceEvent => {
      if (!record(sourceEvent) || typeof sourceEvent.type !== 'string' || !sourceEvent.type.trim()) {
        throw new Error(modelText('Varmuuskopiossa on tapahtuma, jolta puuttuu tyyppi.'));
      }
      const event = { ...sourceEvent };
      event.id = claimId(event, usedIds, 'event');
      event.type = event.type.trim();
      event.team = team(event.team, 'home');
      event.period = periodNumber(event.period, game.period);
      event.time = numeric(event.time, 0, 'Tapahtuman aika');
      if (event.time < 0) throw new Error(modelText('Tapahtuman aika ei voi olla negatiivinen.'));
      event.n = normalizeNumber(event.n);
      if (event.assists !== undefined && !Array.isArray(event.assists)) {
        throw new Error(modelText('Tapahtuman syöttäjien pitää olla lista.'));
      }
      event.assists = (event.assists ?? []).map(normalizeNumber);
      if (event.type === 'Jäähy' || event.minutes !== undefined) {
        event.minutes = penaltyMinutes(event.minutes);
      }
      return event;
    });

    // Old accidental nested archives are flattened, so every saved match stays accessible.
    const archive = [];
    for (const child of source.archive ?? []) {
      const migrated = migrate(child);
      archive.push(migrated.game, ...migrated.archive);
    }
    ancestors.delete(source);
    return { game, archive };
  }

  const normalized = migrate(data);
  // In-memory v0.5 snapshots could share nested references. Break those too.
  return { ...copy(normalized.game), archive: normalized.archive.map(game => copy(game)) };
}

/** Keep millisecond precision across pauses; only presentation rounds to seconds. */
export function elapsedPrecise(game, now = Date.now()) {
  const length = Number.isFinite(Number(game?.periodLength)) && Number(game.periodLength) > 0
    ? Number(game.periodLength) : DEFAULT_LENGTH;
  const base = Number.isFinite(Number(game?.seconds)) ? Math.max(0, Number(game.seconds)) : 0;
  const started = game?.start !== null && game?.start !== undefined && game?.start !== '' && game?.start !== false;
  const running = started && Number.isFinite(Number(game.start)) && Number.isFinite(Number(now))
    ? Math.max(0, Number(now) - Number(game.start)) : 0;
  // Adding in milliseconds prevents e.g. twenty 1.9 s segments becoming 37.999… s.
  const milliseconds = Math.round(base * 1000) + running;
  return Math.max(0, Math.min(length, milliseconds / 1000));
}

/** The persisted clock stores elapsed seconds, even though the UI counts down. */
export function elapsed(game, now = Date.now()) {
  return Math.floor(elapsedPrecise(game, now));
}

export function formatTime(seconds) {
  const value = Number.isFinite(Number(seconds)) ? Math.max(0, Math.floor(Number(seconds))) : 0;
  return `${String(Math.floor(value / 60)).padStart(2, '0')}:${String(value % 60).padStart(2, '0')}`;
}

function inPeriod(event, period) {
  return period === undefined || period === null || Number(event.period) === Number(period);
}

export function score(game) {
  const result = { home: 0, away: 0 };
  for (const event of game.events ?? []) {
    if (event.type === 'Maali' && TEAMS.has(event.team)) result[event.team] += 1;
  }
  return result;
}

export function teamStats(game, period) {
  const empty = () => ({ goals: 0, shots: 0, saves: 0, penaltyMinutes: 0 });
  const result = { home: empty(), away: empty() };
  for (const event of game.events ?? []) {
    if (!TEAMS.has(event.team) || !inPeriod(event, period)) continue;
    const ownTeam = result[event.team];
    const opponent = result[event.team === 'home' ? 'away' : 'home'];
    if (event.type === 'Maali') {
      ownTeam.goals += 1;
      ownTeam.shots += 1;
    } else if (event.type === 'Torjunta') {
      ownTeam.saves += 1;
      opponent.shots += 1;
    } else if (event.type === 'Jäähy') {
      ownTeam.penaltyMinutes += penaltyMinutes(event.minutes);
    }
    // A legacy Laukaus was an additional shot attempt, not a shot on goal.
  }
  return result;
}

export function playerStats(game, selectedTeam) {
  team(selectedTeam);
  const players = new Map();
  function player(number, name = '') {
    const n = normalizeNumber(number);
    if (n === '') return null;
    if (!players.has(n)) {
      players.set(n, { n, name, goals: 0, assists: 0, points: 0, saves: 0, penaltyMinutes: 0 });
    } else if (name) players.get(n).name = name;
    return players.get(n);
  }
  for (const entry of game.roster ?? []) {
    if ((entry.team || 'home') === selectedTeam) player(entry.n, entry.name || '');
  }
  for (const event of game.events ?? []) {
    if (event.team !== selectedTeam) continue;
    const participant = player(event.n);
    if (event.type === 'Maali') {
      if (participant) participant.goals += 1;
      const scorer = normalizeNumber(event.n);
      for (const n of new Set((event.assists ?? []).map(normalizeNumber))) {
        // Retain legacy data, but never credit duplicate or self assists in statistics.
        if (n !== '' && n !== scorer) player(n).assists += 1;
      }
    } else if (event.type === 'Torjunta' && participant) {
      participant.saves += 1;
    } else if (event.type === 'Jäähy' && participant) {
      participant.penaltyMinutes += penaltyMinutes(event.minutes);
    }
  }
  return [...players.values()].map(entry => ({ ...entry, points: entry.goals + entry.assists }))
    .sort((a, b) => b.points - a.points || Number(a.n) - Number(b.n));
}

export function periodStats(game) {
  const last = Math.max(periodNumber(game.period), ...(game.events ?? []).map(event => periodNumber(event.period, 1)));
  const periods = Array.from({ length: last }, (_, index) => ({ period: index + 1, home: 0, away: 0 }));
  for (const event of game.events ?? []) {
    if (event.type === 'Maali' && TEAMS.has(event.team)) periods[Number(event.period || 1) - 1][event.team] += 1;
  }
  return periods;
}

export function snapshot(game, now = Date.now()) {
  const result = copy(game);
  delete result.archive;
  result.seconds = elapsedPrecise(game, now);
  result.start = null;
  return result;
}

export function archiveAndNew(state, now = Date.now()) {
  const current = normalizeState(state);
  return {
    ...createGame({ home: current.home, periodLength: current.periodLength }),
    archive: [...current.archive, snapshot(current, now)]
  };
}

function meaningful(game, now) {
  if (game.events.length > 0 || game.roster.length > 0 || elapsedPrecise(game, now) > 0
    || game.start !== null || game.period > 1 || game.away !== 'Vastustaja'
    || game.finished === true || game.status === 'finished'
    || Boolean(game.notes || game.title || game.detail)
    || [...TEAMS].some(side => getActiveGoalie(game, side) !== null)) return true;
  const standard = new Set(['id', 'date', 'version', 'home', 'away', 'period', 'periodLength',
    'seconds', 'start', 'roster', 'events', 'archive', 'finished', 'status', 'activeGoalies']);
  // Unknown backup metadata can also contain the only work entered into a match.
  return Object.entries(game).some(([key, value]) => !standard.has(key)
    && (Array.isArray(value) ? value.length > 0 : record(value)
      ? Object.keys(value).length > 0 : Boolean(value)));
}

export function openArchive(state, id, now = Date.now()) {
  const current = normalizeState(state);
  const index = current.archive.findIndex(game => game.id === String(id));
  if (index === -1) throw new Error(modelText('Arkistoitua ottelua ei löytynyt.'));
  const [selected] = current.archive.splice(index, 1);
  if (meaningful(current, now)) current.archive.push(snapshot(current, now));
  return { ...snapshot(selected, now), archive: current.archive };
}

export function nextPeriod(game, now = Date.now()) {
  const result = copy(game);
  result.period = periodNumber(game.period) + 1;
  if (result.period > 1000) throw new Error(modelText('Ottelussa on jo enimmäismäärä eriä.'));
  result.seconds = 0;
  result.start = null;
  return result;
}

export function validateEvent(input, game) {
  if (!record(input) || !NEW_EVENT_TYPES.has(input.type)) {
    throw new Error(modelText('Valitse tapahtumaksi maali, torjunta tai jäähy.'));
  }
  const result = { ...copy(input) };
  result.type = input.type;
  result.team = team(input.team);
  result.period = periodNumber(input.period, game.period);
  result.time = numeric(input.time, elapsed(game), 'Tapahtuman aika');
  if (!Number.isInteger(result.time) || result.time < 0 || result.time > periodLength(game.periodLength)) {
    throw new Error(modelText('Tapahtuman ajan pitää olla erän alun ja lopun välissä.'));
  }
  result.n = normalizeNumber(input.n);
  if (input.assists !== undefined && !Array.isArray(input.assists)) throw new Error(modelText('Syöttäjien pitää olla lista.'));
  result.assists = (input.assists ?? []).map(normalizeNumber).filter(n => n !== '');
  if (result.assists.length > 2) throw new Error(modelText('Maalille voi merkitä enintään kaksi syöttäjää.'));
  if (new Set(result.assists).size !== result.assists.length) throw new Error(modelText('Samaa syöttäjää ei voi merkitä kahdesti.'));
  if (result.n !== '' && result.assists.includes(result.n)) throw new Error(modelText('Maalintekijä ei voi olla myös syöttäjä.'));
  if (result.type !== 'Maali' && result.assists.length) throw new Error(modelText('Syöttäjiä voi merkitä vain maaliin.'));
  result.detail = text(input.detail);
  result.id = (typeof input.id === 'string' || typeof input.id === 'number') && String(input.id).trim()
    ? String(input.id).trim() : newId('event');
  if (result.type === 'Jäähy') {
    result.minutes = penaltyMinutes(input.minutes);
    result.reason = text(input.reason);
    result.penaltyLabel = text(input.penaltyLabel);
    if (input.penaltyType !== undefined) result.penaltyType = text(input.penaltyType);
  } else {
    delete result.minutes;
    delete result.reason;
    delete result.penaltyLabel;
    delete result.penaltyType;
  }
  return result;
}
