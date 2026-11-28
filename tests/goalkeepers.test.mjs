import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createGame, normalizeState, getActiveGoalie, setActiveGoalie, recordSave,
  teamStats, playerStats, snapshot, archiveAndNew, openArchive, nextPeriod,
} from '../model.js';

test('legacy matches leave each goalkeeper unselected without guessing from historical saves', () => {
  const legacy = createGame();
  delete legacy.activeGoalies;
  legacy.events.push({ id: 'older-save', type: 'Torjunta', team: 'home', n: '31', period: 1, time: 15, assists: [] });
  legacy.archive = [{ ...createGame(), activeGoalies: undefined }];
  const before = structuredClone(legacy);
  const restored = normalizeState(legacy);
  assert.deepEqual(restored.activeGoalies, { home: null, away: null });
  assert.deepEqual(restored.archive[0].activeGoalies, { home: null, away: null });
  assert.deepEqual(restored.events, before.events);
  assert.equal(getActiveGoalie(legacy, 'home'), null);
  assert.deepEqual(legacy, before);
});

test('a goalkeeper number is remembered per team, including zero, without changing existing names', () => {
  const original = createGame();
  original.roster.push({ n: '0', name: 'Nolla', team: 'home' }, { n: '0', name: 'Vieras', team: 'away' });
  const before = structuredClone(original);
  let selected = setActiveGoalie(original, 'home', 0);
  selected = setActiveGoalie(selected, 'away', '031');
  assert.equal(getActiveGoalie(selected, 'home'), '0');
  assert.equal(getActiveGoalie(selected, 'away'), '31');
  assert.deepEqual(selected.roster, [
    { n: '0', name: 'Nolla', team: 'home' },
    { n: '0', name: 'Vieras', team: 'away' },
    { n: '31', name: '', team: 'away' },
  ]);
  assert.deepEqual(setActiveGoalie(selected, 'away', 31).roster, selected.roster);
  assert.deepEqual(original, before);
});

test('first selection and save can be persisted atomically with the original tap timestamp', () => {
  const original = { ...createGame({ periodLength: 900 }), period: 3, seconds: 42, start: 123456 };
  const before = structuredClone(original);
  const recorded = recordSave(setActiveGoalie(original, 'home', '0'), { team: 'home', period: 2, time: 17 });
  assert.equal(recorded.events.length, 1);
  assert.equal(recorded.events[0].type, 'Torjunta');
  assert.equal(recorded.events[0].n, '0');
  assert.equal(recorded.events[0].time, 17);
  assert.equal(recorded.events[0].period, 2);
  assert.deepEqual([recorded.period, recorded.seconds, recorded.start], [3, 42, 123456]);
  assert.deepEqual(original, before);
  assert.deepEqual(teamStats(recorded), {
    home: { goals: 0, shots: 0, saves: 1, penaltyMinutes: 0 },
    away: { goals: 0, shots: 1, saves: 0, penaltyMinutes: 0 },
  });
});

test('changing goalkeeper affects only future saves and keeps the opposing team independent', () => {
  let game = setActiveGoalie(setActiveGoalie(createGame(), 'home', '0'), 'away', '98');
  game = recordSave(game, { team: 'home', time: 10 });
  const firstSave = structuredClone(game.events[0]);
  game = setActiveGoalie(game, 'home', '33');
  game = recordSave(game, { team: 'home', time: 20 });
  game = recordSave(game, { team: 'away', time: 25 });
  assert.deepEqual(game.events[0], firstSave);
  assert.deepEqual(game.events.map(event => [event.team, event.n]), [['home', '0'], ['home', '33'], ['away', '98']]);
  assert.deepEqual(game.activeGoalies, { home: '33', away: '98' });
  assert.deepEqual(teamStats(game), {
    home: { goals: 0, shots: 1, saves: 2, penaltyMinutes: 0 },
    away: { goals: 0, shots: 2, saves: 1, penaltyMinutes: 0 },
  });
  assert.deepEqual(playerStats(game, 'home').map(player => [player.n, player.saves]), [['0', 1], ['33', 1]]);
  assert.equal(playerStats(game, 'away').find(player => player.n === '98').saves, 1);
});

test('direct saves record immediately without a selected goalkeeper and preserve the original time', () => {
  const original = { ...createGame({ periodLength: 900 }), period: 3, seconds: 50, start: 123456 };
  const before = structuredClone(original);
  let game = recordSave(original, { team: 'away', time: 17, period: 2 });
  game = recordSave(game, { team: 'home', time: 18, period: 2 });
  assert.deepEqual(game.events.map(event => [event.team, event.n, event.time, event.period]), [
    ['away', '', 17, 2], ['home', '', 18, 2],
  ]);
  assert.notEqual(game.events[0].id, game.events[1].id);
  assert.deepEqual(game.activeGoalies, { home: null, away: null });
  assert.deepEqual(game.roster, []);
  assert.deepEqual([game.period, game.seconds, game.start], [3, 50, 123456]);
  assert.deepEqual(teamStats(game), {
    home: { goals: 0, shots: 1, saves: 1, penaltyMinutes: 0 },
    away: { goals: 0, shots: 1, saves: 1, penaltyMinutes: 0 },
  });
  assert.deepEqual(playerStats(game, 'home'), []);
  assert.deepEqual(playerStats(game, 'away'), []);
  const earlierEvents = structuredClone(game.events);
  game = recordSave(setActiveGoalie(game, 'away', '0'), { team: 'away', time: 20, period: 2 });
  assert.deepEqual(game.events.slice(0, 2), earlierEvents, 'later setup must not guess the goalkeeper of earlier saves');
  assert.equal(game.events[2].n, '0');
  assert.deepEqual(original, before);
});

test('unknown goalkeeper is an explicit persistent choice and never becomes jersey zero', () => {
  const unselected = createGame();
  let unknown = setActiveGoalie(unselected, 'away', '');
  unknown = normalizeState(JSON.parse(JSON.stringify(unknown)));
  assert.equal(getActiveGoalie(unknown, 'away'), '');
  assert.equal(getActiveGoalie(unknown, 'home'), null);
  unknown = recordSave(unknown, { team: 'away', time: 0 });
  unknown = recordSave(unknown, { team: 'away', time: 1 });
  assert.deepEqual(unknown.events.map(event => event.n), ['', '']);
  assert.deepEqual(unknown.roster, []);
  assert.deepEqual(playerStats(unknown, 'away'), []);
  assert.equal(teamStats(unknown).away.saves, 2);
  assert.equal(teamStats(unknown).home.shots, 2);
  assert.equal(getActiveGoalie(setActiveGoalie(unknown, 'away', null), 'away'), null);
});

test('backup restore and archive reopening retain goalkeeper choices while a new match resets both', () => {
  let original = setActiveGoalie(setActiveGoalie(createGame(), 'home', '30'), 'away', '');
  original = recordSave(original, { team: 'home', time: 10 });
  const stored = normalizeState(JSON.parse(JSON.stringify(original)));
  assert.deepEqual(stored.activeGoalies, { home: '30', away: '' });
  const next = archiveAndNew(stored);
  assert.deepEqual(next.activeGoalies, { home: null, away: null });
  assert.deepEqual(next.roster, []);
  assert.deepEqual(next.archive[0].activeGoalies, { home: '30', away: '' });
  const reopened = openArchive(normalizeState(JSON.parse(JSON.stringify(next))), original.id);
  assert.deepEqual(reopened.activeGoalies, { home: '30', away: '' });
  assert.equal(reopened.events.length, 1);
  assert.equal(reopened.archive.length, 0, 'default unselected goalkeepers must not turn a blank match into meaningful work');
});

test('a deliberate unknown goalkeeper selection counts as work when opening an archive', () => {
  const current = setActiveGoalie(createGame(), 'away', '');
  const older = createGame({ away: 'Vanha ottelu' });
  current.archive = [snapshot(older)];
  const reopened = openArchive(current, older.id);
  assert.equal(reopened.archive.length, 1);
  assert.equal(reopened.archive[0].id, current.id);
  assert.deepEqual(reopened.archive[0].activeGoalies, { home: null, away: '' });
});

test('period changes and detached snapshots retain the active goalkeepers', () => {
  const game = setActiveGoalie(createGame(), 'home', '30');
  const secondPeriod = nextPeriod(game);
  assert.equal(getActiveGoalie(secondPeriod, 'home'), '30');
  assert.equal(secondPeriod.period, 2);
  const archived = snapshot(game);
  archived.activeGoalies.home = '35';
  assert.equal(getActiveGoalie(game, 'home'), '30');
});

test('each save has a separate undoable event without resetting the remembered goalkeeper', () => {
  let game = setActiveGoalie(createGame(), 'home', '31');
  game = recordSave(game, { team: 'home', time: 1 });
  game = recordSave(game, { team: 'home', time: 2 });
  assert.notEqual(game.events[0].id, game.events[1].id);
  const undoId = game.events[1].id;
  game.events = game.events.filter(event => event.id !== undoId);
  assert.equal(getActiveGoalie(game, 'home'), '31');
  assert.equal(teamStats(game).home.saves, 1);
  assert.equal(teamStats(game).away.shots, 1);
  assert.equal(game.events[0].time, 1);
});

test('invalid goalkeeper backup fields, teams and captured event times reject without mutation', () => {
  for (const value of [null, [], true, '30', { visitor: '30' }, { home: false }, { home: 100 }, { away: -1 }, { home: '1e1' }]) {
    const raw = { ...createGame(), activeGoalies: value };
    const before = structuredClone(raw);
    assert.throws(() => normalizeState(raw));
    assert.deepEqual(raw, before);
  }
  const game = setActiveGoalie(createGame(), 'home', '31');
  const before = structuredClone(game);
  assert.throws(() => setActiveGoalie(game, 'home', undefined), /Valitse maalivahti/);
  for (const side of ['', 'HOME', 'visitor', '__proto__']) {
    assert.throws(() => getActiveGoalie(game, side), /koti- tai vierasjoukkue/);
    assert.throws(() => setActiveGoalie(game, side, '30'), /koti- tai vierasjoukkue/);
    assert.throws(() => recordSave(game, { team: side, time: 1 }), /koti- tai vierasjoukkue/);
  }
  for (const time of [-1, 1.5, 1201]) assert.throws(() => recordSave(game, { team: 'home', time }), /erän alun ja lopun/);
  assert.deepEqual(game, before);
});
