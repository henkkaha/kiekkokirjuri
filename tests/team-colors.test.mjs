import test from 'node:test';
import assert from 'node:assert/strict';
import {
  TEAM_COLORS, createGame, normalizeState, getTeamColor, setTeamColor,
  recordSave, snapshot, archiveAndNew, openArchive, nextPeriod,
} from '../model.js';

const defaults = { home: 'blue', away: 'white' };
const event = { id: 'saved-event', type: 'Maali', team: 'home', n: '15', assists: [], time: 12, period: 1 };

function luminance(hex) {
  const channels = hex.slice(1).match(/../g).map(pair => parseInt(pair, 16) / 255)
    .map(value => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}

test('the safe team palette has readable foregrounds for normal button text', () => {
  assert.ok(TEAM_COLORS.some(color => color.id === 'blue'));
  assert.ok(TEAM_COLORS.some(color => color.id === 'white'));
  assert.ok(TEAM_COLORS.some(color => color.id === 'yellow'));
  assert.equal(new Set(TEAM_COLORS.map(color => color.id)).size, TEAM_COLORS.length);
  for (const color of TEAM_COLORS) {
    assert.match(color.id, /^[a-z]+$/);
    assert.match(color.hex, /^#[0-9A-F]{6}$/);
    assert.match(color.foreground, /^#[0-9A-F]{6}$/);
    const values = [luminance(color.hex), luminance(color.foreground)].sort((a, b) => a - b);
    assert.ok((values[1] + 0.05) / (values[0] + 0.05) >= 4.5, `${color.id}: insufficient foreground contrast`);
    assert.ok(Object.isFrozen(color));
  }
  assert.ok(Object.isFrozen(TEAM_COLORS));
});

test('new and legacy matches receive independent home and away color defaults', () => {
  const first = createGame();
  const second = createGame();
  assert.deepEqual(first.teamColors, defaults);
  first.teamColors.home = 'yellow';
  assert.deepEqual(second.teamColors, defaults);
  const legacy = createGame();
  delete legacy.teamColors;
  const archived = createGame();
  delete archived.teamColors;
  legacy.archive = [archived];
  const before = structuredClone(legacy);
  const restored = normalizeState(legacy);
  assert.deepEqual(restored.teamColors, defaults);
  assert.deepEqual(restored.archive[0].teamColors, defaults);
  assert.equal(getTeamColor(legacy, 'home').id, 'blue');
  assert.equal(getTeamColor(legacy, 'away').id, 'white');
  assert.deepEqual(legacy, before);
  restored.teamColors.home = 'red';
  assert.deepEqual(restored.archive[0].teamColors, defaults);
});

test('color choices change only the selected match and side without changing team identity or events', () => {
  const original = createGame({ home: 'GrIFK', away: 'EKS Yellow', teamColors: { home: 'green', away: 'yellow' } });
  original.events.push(structuredClone(event));
  const before = structuredClone(original);
  const chosen = setTeamColor(original, 'home', 'white');
  assert.deepEqual(chosen.teamColors, { home: 'white', away: 'yellow' });
  assert.deepEqual([chosen.home, chosen.away, chosen.events], [original.home, original.away, original.events]);
  assert.equal(getTeamColor(chosen, 'home').hex, '#FFFFFF');
  assert.equal(getTeamColor(chosen, 'home').foreground, '#10142B');
  assert.deepEqual(original, before);
  chosen.events[0].n = '58';
  assert.deepEqual(original, before);
  const same = setTeamColor(chosen, 'away', 'white');
  assert.deepEqual(same.teamColors, { home: 'white', away: 'white' }, 'team identity stays explicit even when jersey colors match');
});

test('invalid cosmetic colors fall back safely without discarding a valid match or archived events', () => {
  const values = [null, false, [], 'red', { home: 'url(https://example.invalid)' }, { home: '__proto__', away: 'red' }, { home: 'green', away: {} }, { home: 0, away: 'WHITE' }];
  for (const value of values) {
    const original = createGame();
    original.teamColors = value;
    original.events.push(structuredClone(event));
    original.archive = [{ ...createGame(), teamColors: value, events: [{ ...event, id: 'archived-event' }] }];
    const before = structuredClone(original);
    const restored = normalizeState(original);
    const expected = { home: value?.home === 'green' ? 'green' : 'blue', away: value?.away === 'red' ? 'red' : 'white' };
    assert.deepEqual(restored.teamColors, expected);
    assert.deepEqual(restored.archive[0].teamColors, expected);
    assert.deepEqual(restored.events, original.events);
    assert.deepEqual(restored.archive[0].events, original.archive[0].events);
    assert.deepEqual(original, before);
  }
  const game = createGame();
  const before = structuredClone(game);
  for (const value of [null, undefined, '', {}, [], 'WHITE', '__proto__', 'constructor', '#003DA5']) {
    assert.throws(() => setTeamColor(game, 'home', value), /joukkueen väri/);
  }
  for (const side of ['', null, undefined, 'HOME', 'visitor', '__proto__']) {
    assert.throws(() => setTeamColor(game, side, 'green'), /koti- tai vierasjoukkue/);
    assert.throws(() => getTeamColor(game, side), /koti- tai vierasjoukkue/);
  }
  assert.deepEqual(game, before);
});

test('team colors survive saves, period changes, backup restore and archive reopening while new matches reset', () => {
  let original = createGame({ teamColors: { home: 'yellow', away: 'green' } });
  original = recordSave(original, { team: 'away', time: 9 });
  const stored = normalizeState(JSON.parse(JSON.stringify(original)));
  assert.deepEqual(stored.teamColors, original.teamColors);
  assert.deepEqual(nextPeriod(stored).teamColors, original.teamColors);
  const archived = snapshot(stored);
  archived.teamColors.home = 'red';
  assert.deepEqual(stored.teamColors, original.teamColors);
  const next = archiveAndNew(stored);
  assert.deepEqual(next.teamColors, defaults);
  assert.deepEqual(next.archive[0].teamColors, original.teamColors);
  const reopened = openArchive(normalizeState(JSON.parse(JSON.stringify(next))), original.id);
  assert.deepEqual(reopened.teamColors, original.teamColors);
  assert.deepEqual(reopened.events, original.events);
  assert.equal(reopened.archive.length, 0, 'default colors must not create a spurious empty archived match');
});

test('deliberately chosen colors are retained when switching from an otherwise blank match to an archive', () => {
  const current = setTeamColor(createGame(), 'away', 'red');
  const older = createGame({ away: 'Arkisto' });
  current.archive = [snapshot(older)];
  const reopened = openArchive(current, older.id);
  assert.equal(reopened.archive.length, 1);
  assert.equal(reopened.archive[0].id, current.id);
  assert.deepEqual(reopened.archive[0].teamColors, { home: 'blue', away: 'red' });
});
