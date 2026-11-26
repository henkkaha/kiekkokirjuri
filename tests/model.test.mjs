import { setLanguage } from '../i18n.js?v=0.7.0';
import { domainText } from '../domain-messages.js?v=0.7.0';
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  VERSION, createGame, normalizeState, normalizeNumber, elapsedPrecise, elapsed, formatTime,
  score, teamStats, playerStats, periodStats, snapshot, archiveAndNew,
  openArchive, nextPeriod, validateEvent
} from '../model.js';

const event = (type, team, fields = {}) => ({ type, team, period: 1, time: 30, n: '', assists: [], ...fields });
const legacy = fields => ({ home: 'Kiekko-Espoo', away: 'Vastustaja', period: 1, seconds: 0, start: null, roster: [], events: [], archive: [], ...fields });

test('team shots on goal are own goals plus opposing saves, never old shot attempts', () => {
  const game = createGame();
  game.events = [
    event('Maali', 'home', { n: '7' }), event('Maali', 'away', { n: '8' }),
    event('Maali', 'home', { period: 2 }),
    event('Torjunta', 'away', { n: '30' }), event('Torjunta', 'away', { n: '30' }),
    event('Torjunta', 'home', { n: '0', period: 2 }),
    event('Laukaus', 'home'), event('Laukaus', 'away'),
    event('Jäähy', 'home', { minutes: 4 }), event('Jäähy', 'away', { minutes: 2 })
  ];
  assert.deepEqual(score(game), { home: 2, away: 1 });
  assert.deepEqual(teamStats(game), {
    home: { goals: 2, shots: 4, saves: 1, penaltyMinutes: 4 },
    away: { goals: 1, shots: 2, saves: 2, penaltyMinutes: 2 }
  });
  assert.deepEqual(teamStats(game, 2), {
    home: { goals: 1, shots: 1, saves: 1, penaltyMinutes: 0 },
    away: { goals: 0, shots: 1, saves: 0, penaltyMinutes: 0 }
  });
  assert.deepEqual(periodStats(game), [{ period: 1, home: 1, away: 1 }, { period: 2, home: 1, away: 0 }]);
});

test('player stats support zero, unknown rosters and assists without inventing a shooter for saves', () => {
  const game = createGame();
  game.roster = [{ n: '0', name: 'Nolla', team: 'home' }, { n: '7', name: 'Seitsemän', team: 'home' }, { n: '7', name: 'Vieras', team: 'away' }];
  game.events = [
    event('Maali', 'home', { n: '0', assists: ['7', '9'] }),
    event('Torjunta', 'home', { n: '0' }), event('Torjunta', 'away', { n: '30' }),
    event('Jäähy', 'home', { n: '7', minutes: 2 }), event('Maali', 'away', { n: '7' })
  ];
  assert.deepEqual(playerStats(game, 'home'), [
    { n: '0', name: 'Nolla', goals: 1, assists: 0, points: 1, saves: 1, penaltyMinutes: 0 },
    { n: '7', name: 'Seitsemän', goals: 0, assists: 1, points: 1, saves: 0, penaltyMinutes: 2 },
    { n: '9', name: '', goals: 0, assists: 1, points: 1, saves: 0, penaltyMinutes: 0 }
  ]);
  assert.equal(playerStats(game, 'away').find(p => p.n === '30').saves, 1);
  assert.equal(playerStats(game, 'home').some(p => Object.hasOwn(p, 'shots')), false);
});

test('number normalization keeps zero and rejects invalid jersey numbers', () => {
  for (const [input, expected] of [[0, '0'], ['0', '0'], ['007', '7'], [' 99 ', '99'], ['', ''], [null, '']]) {
    assert.equal(normalizeNumber(input), expected);
  }
  for (const input of [-1, 100, 1.5, '1e1', 'abc', false, {}, []]) {
    assert.throws(() => normalizeNumber(input), /0–99/);
  }
});

test('old backup migration defaults roster to home and keeps legacy/unknown event data', () => {
  const original = legacy({
    extra: { note: 'Säilytä tämä' },
    roster: [{ n: 0, name: 'Nolla', custom: ['x'] }, { n: '07', name: 'Vieras', team: 'away' }],
    events: [event('Laukaus', 'home', { n: 0, detail: 'Ohi', custom: { x: 1 } }), event('Muu vanha tapahtuma', 'away')],
    archive: [legacy({ away: 'Arkisto', events: [event('Maali', 'home')] })]
  });
  const before = structuredClone(original);
  const state = normalizeState(original);
  assert.equal(state.periodLength, 1200);
  assert.deepEqual(state.roster[0], { n: '0', name: 'Nolla', custom: ['x'], team: 'home' });
  assert.equal(state.roster[1].n, '7');
  assert.equal(state.events[0].type, 'Laukaus');
  assert.equal(state.events[1].type, 'Muu vanha tapahtuma');
  assert.equal(state.events[0].detail, 'Ohi');
  assert.deepEqual(state.extra, original.extra);
  assert.equal(state.archive[0].events.length, 1);
  assert.equal(state.archive[0].periodLength, 1200);
  assert.equal(Object.hasOwn(state, 'date'), false);
  state.events[0].custom.x = 2;
  state.roster[0].custom.push('y');
  assert.deepEqual(original, before);
});

test('duplicate IDs become unique without discarding matches or events', () => {
  const state = normalizeState(legacy({
    id: 'duplicate', events: [event('Maali', 'home', { id: 'duplicate' }), event('Torjunta', 'home', { id: 'duplicate' })],
    archive: [legacy({ id: 'duplicate', events: [event('Laukaus', 'away', { id: 'duplicate' })] })]
  }));
  const ids = [state.id, ...state.events.map(e => e.id), state.archive[0].id, state.archive[0].events[0].id];
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(state.events.length, 2);
  assert.equal(state.archive[0].events.length, 1);
  assert.equal(state.events[0].originalId, 'duplicate');
  assert.deepEqual(normalizeState(state), state);
});

test('nested legacy archives stay accessible after migration', () => {
  const state = normalizeState(legacy({ archive: [legacy({ away: 'A', archive: [legacy({ away: 'B' })] })] }));
  assert.deepEqual(state.archive.map(game => game.away), ['A', 'B']);
  assert.equal(Object.hasOwn(state.archive[0], 'archive'), false);
});

test('migration separates references in old shallow archive snapshots', () => {
  const shared = event('Maali', 'home', { custom: { note: 'Alkuperäinen' } });
  const state = normalizeState(legacy({ events: [shared], archive: [legacy({ events: [shared] })] }));
  state.events[0].custom.note = 'Muutos';
  assert.equal(state.archive[0].events[0].custom.note, 'Alkuperäinen');
});

test('countdown elapsed handles suspension, clock skew, paused zero and period expiry', () => {
  const game = { ...createGame({ periodLength: 900 }), seconds: 30, start: 10_000 };
  assert.equal(elapsed(game, 10_999), 30);
  assert.equal(elapsed(game, 25_000), 45);
  assert.equal(elapsed(game, 5_000), 30);
  assert.equal(elapsed(game, 1_000_000), 900);
  assert.equal(elapsed({ ...game, start: null }, 1_000_000), 30);
  assert.equal(elapsed({ ...game, seconds: -20, start: null }), 0);
  assert.equal(elapsed({ ...game, seconds: 1000, start: null }), 900);
  assert.equal(elapsed({ ...game, seconds: 0, start: 0 }, 5_000), 5);
  assert.equal(formatTime(900 - elapsed(game, 25_000)), '14:15');
  assert.equal(formatTime(-1), '00:00');
  assert.equal(formatTime(3600), '60:00');
});

test('twenty repeated 1.9-second running segments preserve exactly 38 seconds', () => {
  let game = createGame();
  for (let index = 0; index < 20; index++) {
    game.start = index * 5000;
    game = snapshot(game, game.start + 1900);
    game = normalizeState(game);
    assert.equal(game.start, null);
    assert.equal(game.seconds, (index + 1) * 19 / 10);
  }
  assert.equal(game.seconds, 38);
  assert.equal(elapsedPrecise(game), 38);
  assert.equal(elapsed(game), 38);
});

test('precise elapsed preserves fractional pauses and handles clock skew and period boundaries', () => {
  const game = { ...createGame({ periodLength: 60 }), seconds: 12.345, start: 10_000 };
  assert.equal(elapsedPrecise(game, 11_900), 14.245);
  assert.equal(elapsed(game, 11_900), 14);
  assert.equal(elapsedPrecise(game, 9_000), 12.345);
  assert.equal(elapsedPrecise(game, 100_000), 60);
  assert.equal(elapsedPrecise({ ...game, start: null }), 12.345);
  assert.equal(elapsedPrecise({ ...game, seconds: -0.5, start: null }), 0);
  assert.equal(elapsedPrecise({ ...game, seconds: 61.5, start: null }), 60);
  assert.equal(normalizeState({ ...game, start: null }).seconds, 12.345);
  assert.equal(snapshot(game, 11_900).seconds, 14.245);
  const paused = { ...createGame(), seconds: 0.5, archive: [snapshot(createGame())] };
  assert.equal(openArchive(paused, paused.archive[0].id).archive[0].seconds, 0.5);
});

test('new match archives a deep paused copy and starts with both rosters empty', () => {
  const current = normalizeState(legacy({
    home: 'Kiekko-Espoo U10', away: 'HIFK', periodLength: 900, seconds: 20, start: 1000,
    roster: [{ n: '7', name: 'A', team: 'home' }, { n: '9', name: 'B', team: 'away' }],
    events: [event('Maali', 'home', { n: '7', assists: ['0'], custom: { ok: true } })],
    archive: [legacy({ away: 'Vanha', events: [event('Maali', 'away')] })]
  }));
  const original = structuredClone(current);
  const next = archiveAndNew(current, 11_000);
  assert.equal(next.home, 'Kiekko-Espoo U10');
  assert.equal(next.away, 'Vastustaja');
  assert.equal(next.periodLength, 900);
  assert.deepEqual(next.roster, []);
  assert.deepEqual(next.events, []);
  assert.equal(next.archive.length, 2);
  assert.equal(next.archive[1].seconds, 30);
  assert.equal(next.archive[1].start, null);
  assert.equal(Object.hasOwn(next.archive[1], 'archive'), false);
  next.archive[0].away = 'Muutos';
  next.archive[1].events[0].assists.push('8');
  next.archive[1].events[0].custom.ok = false;
  assert.deepEqual(current, original);
});

test('opening an archive preserves meaningful current play and shares no mutable data', () => {
  const current = normalizeState(legacy({
    away: 'Nykyinen', seconds: 10, start: 1_000, events: [event('Maali', 'home', { n: '7' })],
    archive: [legacy({ id: 'old-game', away: 'Vanha', roster: [{ n: '0', name: 'M', team: 'home' }], events: [event('Torjunta', 'home', { n: '0' })] })]
  }));
  const original = structuredClone(current);
  const opened = openArchive(current, 'old-game', 6_000);
  assert.equal(opened.id, 'old-game');
  assert.equal(opened.away, 'Vanha');
  assert.equal(opened.archive.length, 1);
  assert.equal(opened.archive[0].away, 'Nykyinen');
  assert.equal(opened.archive[0].seconds, 15);
  opened.roster[0].name = 'Muutos';
  opened.archive[0].events[0].n = '8';
  assert.deepEqual(current, original);
  assert.throws(() => openArchive(current, 'missing'), /ei löytynyt/);
  const blank = createGame();
  blank.archive = [original.archive[0]];
  assert.equal(openArchive(blank, 'old-game').archive.length, 0);
  blank.customNote = { text: 'Säilytettävä muistiinpano' };
  assert.equal(openArchive(blank, 'old-game').archive[0].customNote.text, 'Säilytettävä muistiinpano');
});

test('snapshot and next period are pure and preserve events and archive', () => {
  const current = { ...createGame(), period: 2, seconds: 50, start: 1_000,
    events: [event('Maali', 'home')], archive: [legacy()] };
  const original = structuredClone(current);
  const saved = snapshot(current, 6_000);
  assert.equal(saved.seconds, 55);
  assert.equal(saved.start, null);
  assert.equal(Object.hasOwn(saved, 'archive'), false);
  const next = nextPeriod(current, 6_000);
  assert.equal(next.period, 3);
  assert.equal(next.seconds, 0);
  assert.equal(next.start, null);
  next.events[0].n = '9';
  next.archive[0].home = 'Muutos';
  assert.deepEqual(current, original);
  assert.equal(VERSION, '0.7.0');
});

test('new event validation enforces the three-event model and valid unique assistants', () => {
  const game = createGame({ periodLength: 900 });
  const goal = validateEvent(event('Maali', 'home', { n: 0, assists: ['07', '9'], minutes: 2 }), game);
  assert.equal(goal.n, '0');
  assert.deepEqual(goal.assists, ['7', '9']);
  assert.ok(goal.id);
  assert.equal(Object.hasOwn(goal, 'minutes'), false);
  const save = validateEvent(event('Torjunta', 'away', { n: '0' }), game);
  assert.equal(save.n, '0');
  const penalty = validateEvent(event('Jäähy', 'home', { n: '', minutes: '2.01', penaltyLabel: 'Joukkuerangaistus' }), game);
  assert.equal(penalty.minutes, 2);
  assert.equal(penalty.n, '');
  for (const [fields, message] of [
    [{ type: 'Laukaus' }, /maali, torjunta tai jäähy/],
    [{ assists: ['7', '07'] }, /kahdesti/],
    [{ n: '0', assists: [0] }, /Maalintekijä/],
    [{ assists: ['1', '2', '3'] }, /enintään kaksi/],
    [{ time: 901 }, /erän alun ja lopun/],
    [{ time: -1 }, /erän alun ja lopun/],
    [{ period: 0 }, /Erän pitää/],
    [{ team: 'invalid' }, /joukkue/],
    [{ type: 'Torjunta', assists: ['1'] }, /vain maaliin/]
  ]) assert.throws(() => validateEvent({ ...event('Maali', 'home'), ...fields }, game), message);
});

test('malformed backups fail atomically rather than silently dropping records', () => {
  const broken = [
    null, [], {}, { roster: [], events: 'bad' }, legacy({ archive: {} }),
    legacy({ events: [null] }), legacy({ roster: [{ n: 100 }] }),
    legacy({ events: [event('Maali', 'unknown')] }),
    legacy({ events: [event('Maali', 'home', { assists: '7,8' })] }),
    legacy({ events: [event('Jäähy', 'home', { minutes: 'bad' })] }),
    legacy({ seconds: 'broken' }), legacy({ periodLength: -1 }),
    legacy({ archive: [{ roster: [], events: null }] })
  ];
  for (const raw of broken) {
    const before = structuredClone(raw);
    assert.throws(() => normalizeState(raw), Error);
    assert.deepEqual(raw, before);
  }
});

test('validation errors follow the selected language without changing match or backup data', () => {
  const original = createGame();
  original.roster = [{ n: '0', name: 'Mål & Goal', team: 'home' }];
  original.events = [event('Jäähy', 'home', {
    id: 'penalty', n: '0', minutes: 2, reason: 'Kampitus', penaltyType: 'minor',
    penaltyLabel: '2 min · pieni rangaistus', detail: 'Säilytä tämä teksti.'
  })];
  const before = structuredClone(original);
  try {
    for (const [language, numberError, periodError] of [
      ['en', /player number/, /Period is not a valid number/],
      ['sv', /Spelarnumret/, /Period är inte ett giltigt tal/],
      ['fi', /Pelaajan numeron/, /Erä ei ole kelvollinen luku/]
    ]) {
      setLanguage(language);
      assert.throws(() => normalizeNumber(100), numberError);
      assert.throws(() => normalizeState({ ...original, period: 'invalid' }), periodError);
      assert.deepEqual(normalizeState(original), before);
      assert.deepEqual(score(original), { home: 0, away: 0 });
      assert.equal(teamStats(original).home.penaltyMinutes, 2);
      assert.equal(validateEvent(original.events[0], original).type, 'Jäähy');
    }
    assert.deepEqual(original, before);
  } finally { setLanguage('fi'); }
});

test('known hockey labels translate while custom penalty descriptions are preserved', () => {
  assert.equal(domainText('Jäähy', {}, 'en'), 'Penalty');
  assert.equal(domainText('Torjunta', {}, 'sv'), 'Räddning');
  assert.equal(domainText('2 min · joukkuerangaistus', {}, 'sv'), '2 min · lagstraff');
  assert.equal(domainText('Kampitus', {}, 'en'), 'Tripping');
  const custom = 'Oma rangaistus <erikoisnimi> & lisätieto';
  for (const language of ['fi', 'en', 'sv']) assert.equal(domainText(custom, {}, language), custom);
});
