import test from 'node:test';
import assert from 'node:assert/strict';
import { createGame } from '../model.js';
import { textReport } from '../reports.js';

test('text report includes complete chronological events, zero jersey and cross-team save statistics', () => {
  const game = createGame({ home: 'Kiekko-Espoo', away: 'HIFK' });
  game.date = '2026-11-01T10:00:00Z';
  game.roster = [{ n: '0', name: 'Nolla', team: 'home' }, { n: '8', name: 'Syöttäjä', team: 'home' }];
  game.events = [
    { id: 'save', type: 'Torjunta', team: 'away', period: 2, time: 12, n: '30', assists: [] },
    { id: 'goal', type: 'Maali', team: 'home', period: 1, time: 70, n: '0', assists: ['8'] },
    { id: 'old-shot', type: 'Laukaus', team: 'home', period: 1, time: 40, n: '0', assists: [], detail: 'Ohi maalin' },
    { id: 'penalty', type: 'Jäähy', team: 'away', period: 2, time: 60, n: '', assists: [], minutes: 2, penaltyLabel: 'Joukkuerangaistus', reason: 'Liikaa pelaajia jäällä' }
  ];
  const original = structuredClone(game);
  const report = textReport(game);
  assert.match(report, /Tilanne: 1–0/);
  assert.match(report, /Päivämäärä: 1\.11\.2026/);
  assert.match(report, /Kiekko-Espoo \(koti\)\nMaalit: 1\nLaukaukset maalia kohti: 2\nTorjunnat: 0/);
  assert.match(report, /HIFK \(vieras\)\nMaalit: 0\nLaukaukset maalia kohti: 0\nTorjunnat: 1\nJäähyminuutit: 2/);
  assert.match(report, /#0 Nolla · M 1 · S 0 · P 1/);
  assert.match(report, /#8 Syöttäjä · M 0 · S 1 · P 1/);
  assert.match(report, /TAPAHTUMAT \(4\)/);
  assert.match(report, /Joukkuerangaistus · Liikaa pelaajia jäällä/);
  assert.match(report, /Ohi maalin/);
  const eventSection = report.slice(report.indexOf('TAPAHTUMAT'));
  assert.ok(eventSection.indexOf('Laukaus') < eventSection.indexOf('Maali'));
  assert.ok(eventSection.indexOf('Maali') < eventSection.indexOf('Torjunta'));
  assert.deepEqual(game, original);
});

test('large text reports retain every goal and do not invent a missing match date', () => {
  const game = createGame();
  delete game.date;
  game.events = Array.from({ length: 27 }, (_, index) => ({
    id: String(index), type: 'Maali', team: index % 2 ? 'away' : 'home', period: 1 + Math.floor(index / 10),
    time: index % 10 * 10, n: '', assists: [], detail: `Merkintä ${index + 1}`
  }));
  const report = textReport(game);
  assert.doesNotMatch(report, /Päivämäärä/);
  assert.match(report, /TAPAHTUMAT \(27\)/);
  for (let index = 1; index <= 27; index++) assert.match(report, new RegExp(`Merkintä ${index}(?:\\n|$)`));
  assert.match(report, /Tilanne: 14–13/);
});
