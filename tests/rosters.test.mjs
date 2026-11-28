import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  createGame, normalizeState, archiveAndNew, openArchive, setActiveGoalie, recordSave,
} from '../model.js';

const rosters = JSON.parse(readFileSync(new URL('../rosters.json', import.meta.url), 'utf8'));
const expectedTeams = [
  {
    id: 'blue', name: 'Blue', goalkeeper: { name: 'Kopiloff', number: null },
    players: [[58, 'Honkimaa'], [15, 'Haho'], [26, 'Jantunen'], [77, 'Koskela'], [19, 'Pekkarinen'], [64, 'Laurila']],
  },
  {
    id: 'white', name: 'White', goalkeeper: { name: 'Koponen', number: null },
    players: [[11, 'Schlosser'], [14, 'Niemelä'], [24, 'Kniazev'], [18, 'Suokko'], [98, 'Alho'], [88, 'Pyykkö']],
  },
  {
    id: 'yellow', name: 'Yellow', goalkeeper: { name: 'Hannonen', number: null },
    players: [[28, 'Lehto'], [12, 'Nylund'], [36, 'Rämä'], [18, 'Tapioharju'], [91, 'Luukkanen'], [66, 'Heikel']],
  },
];

function matchWithPreset(preset, side = 'away') {
  const game = createGame();
  game[side] = `EKS ${preset.name}`;
  game[side === 'home' ? 'away' : 'home'] = rosters.opponent;
  game.roster = preset.players.map(([number, name]) => ({ n: String(number), name, team: side }));
  game.rosterPreset = {
    event: rosters.event, updated: rosters.updated, id: preset.id, side,
    goalkeeper: structuredClone(preset.goalkeeper),
  };
  return game;
}

test('GrIFK–EKS presets contain exactly the supplied 28 November rosters', () => {
  assert.deepEqual(rosters, {
    schema: 1, event: 'GrIFK – EKS', updated: '2026-11-28', opponent: 'GrIFK', side: 'away',
    teams: expectedTeams,
  });
});

test('each public preset has six numbered skaters and one surname-only goalkeeper without an invented jersey', () => {
  for (const team of rosters.teams) {
    assert.equal(team.players.length, 6, team.id);
    assert.deepEqual(Object.keys(team.goalkeeper).sort(), ['name', 'number']);
    assert.equal(team.goalkeeper.number, null, `${team.id}: MV supplies a role, not a jersey number`);
    assert.equal(new Set(team.players.map(([number]) => number)).size, 6, team.id);
    for (const [number, surname] of team.players) {
      assert.ok(Number.isInteger(number) && number >= 0 && number <= 99, team.id);
      assert.notEqual(surname, team.goalkeeper.name, `${team.id}: goalkeeper must not also be a skater`);
    }
    for (const surname of [...team.players.map(([, name]) => name), team.goalkeeper.name]) {
      assert.ok(typeof surname === 'string' && surname.length > 0 && !/\s/.test(surname), `${team.id}: ${surname}`);
    }
  }
});

test('bundled offline presets match the downloadable roster file exactly', () => {
  const app = readFileSync(new URL('../app.js', import.meta.url), 'utf8');
  const match = app.match(/let\s+rosterPresets\s*=\s*validateRoster\((\{[\s\S]*?\})\);/);
  assert.ok(match, 'app.js must include a JSON roster fallback');
  assert.deepEqual(JSON.parse(match[1]), rosters);
});

test('unnumbered goalkeeper metadata survives backup normalization independently of numbered rosters and active choices', () => {
  for (const preset of rosters.teams) {
    for (const side of ['home', 'away']) {
      const original = matchWithPreset(preset, side);
      const before = structuredClone(original);
      const normalized = normalizeState(original);
      const restored = normalizeState(JSON.parse(JSON.stringify(normalized)));
      assert.deepEqual(restored.rosterPreset, before.rosterPreset);
      assert.deepEqual(restored.roster, before.roster);
      assert.deepEqual(restored.activeGoalies, { home: null, away: null });
      assert.equal(restored.roster.length, 6);
      assert.equal(restored.roster.some(player => player.name === preset.goalkeeper.name), false);
      restored.rosterPreset.goalkeeper.name = 'Muutos';
      assert.deepEqual(normalized.rosterPreset, before.rosterPreset);
      assert.deepEqual(original, before);
      assert.deepEqual(preset, expectedTeams.find(team => team.id === preset.id));
    }
  }
});

test('preset metadata does not change explicit save choices and is archived while the next match resets', () => {
  let game = matchWithPreset(rosters.teams[0]);
  game = setActiveGoalie(setActiveGoalie(game, 'home', '30'), 'away', '');
  const presetSnapshot = structuredClone(game.rosterPreset);
  game = recordSave(game, { team: 'away', period: 1, time: 12 });
  game = recordSave(game, { team: 'home', period: 1, time: 15 });
  const restored = normalizeState(JSON.parse(JSON.stringify(game)));
  assert.deepEqual(restored.rosterPreset, presetSnapshot);
  assert.deepEqual(restored.activeGoalies, { home: '30', away: '' });
  assert.deepEqual(restored.events.map(event => [event.team, event.n]), [['away', ''], ['home', '30']]);

  const next = archiveAndNew(restored);
  assert.deepEqual(next.activeGoalies, { home: null, away: null });
  assert.deepEqual(next.roster, []);
  assert.deepEqual(next.events, []);
  assert.equal(Object.hasOwn(next, 'rosterPreset'), false);
  assert.deepEqual(next.archive[0].rosterPreset, presetSnapshot);
  assert.deepEqual(next.archive[0].activeGoalies, { home: '30', away: '' });

  const reopened = openArchive(normalizeState(JSON.parse(JSON.stringify(next))), game.id);
  assert.deepEqual(reopened.rosterPreset, presetSnapshot);
  assert.deepEqual(reopened.activeGoalies, { home: '30', away: '' });
  assert.deepEqual(reopened.events, restored.events);
  next.archive[0].rosterPreset.goalkeeper.name = 'Muutos';
  assert.deepEqual(restored.rosterPreset, presetSnapshot);
  assert.deepEqual(reopened.rosterPreset, presetSnapshot);
});
