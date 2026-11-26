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

test('English and Swedish reports translate labels while retaining scores, canonical events and user text', () => {
  const game = createGame({ home: 'Kiekko-Espoo', away: 'GrIFK' });
  game.date = '2026-11-27T10:00:00Z';
  game.notes = 'Muistiinpanot säilyvät juuri näin.';
  game.roster = [
    { n: '0', name: 'Mäkinen', team: 'home' },
    { n: '15', name: 'Haho', team: 'home' },
    { n: '30', name: 'Österman', team: 'away' }
  ];
  game.events = [
    { id: 'goal', type: 'Maali', team: 'home', period: 1, time: 70, n: '0', assists: ['15'] },
    { id: 'save', type: 'Torjunta', team: 'away', period: 1, time: 80, n: '30', assists: [] },
    { id: 'penalty', type: 'Jäähy', team: 'away', period: 1, time: 100, n: '30', assists: [], minutes: 2, penaltyLabel: '2 min · pieni rangaistus', reason: 'Kampitus', detail: 'Kärsii #22' },
    { id: 'custom', type: 'Jäähy', team: 'home', period: 1, time: 110, n: '', assists: [], minutes: 3, penaltyLabel: 'Oma rangaistus', reason: 'Tarkka oma selite' }
  ];
  const original = structuredClone(game);
  const en = textReport(game, 'en');
  assert.match(en, /KIEKKOKIRJURI · MATCH SUMMARY/);
  assert.match(en, /Score: 1–0/);
  assert.match(en, /Date: 27\/11\/2026/);
  assert.match(en, /Kiekko-Espoo \(home\)\nGoals: 1\nShots on goal: 2\nSaves: 0\nPenalty minutes: 3/);
  assert.match(en, /#0 Mäkinen · G 1 · A 0 · P 1/);
  assert.match(en, /Period 1 01:10 · Goal · Kiekko-Espoo · #0 Mäkinen · Assists: #15 Haho · Score 1–0/);
  assert.match(en, /Tripping/);
  const sv = textReport(game, 'sv');
  assert.match(sv, /KIEKKOKIRJURI · MATCHREFERAT/);
  assert.match(sv, /Ställning: 1–0/);
  assert.match(sv, /Datum: 2026-11-27/);
  assert.match(sv, /Kiekko-Espoo \(hemma\)\nMål: 1\nSkott på mål: 2\nRäddningar: 0\nUtvisningsminuter: 3/);
  assert.match(sv, /#15 Haho · M 0 · A 1 · P 1/);
  assert.match(sv, /Period 1 01:10 · Mål · Kiekko-Espoo/);
  for (const report of [en, sv]) {
    assert.match(report, /#30 Österman/);
    assert.match(report, /Kärsii #22/);
    assert.match(report, /Oma rangaistus · Tarkka oma selite/);
    assert.match(report, /Muistiinpanot säilyvät juuri näin\./);
    assert.doesNotMatch(report, /OTTELUKOOSTE|JOUKKUETILASTOT|Päivämäärä|Laukaukset maalia kohti|Maalintekijä kirjaamatta/);
    assert.doesNotMatch(report, /\{(?:home|away|period|players|count|time|value)\}/);
  }
  assert.deepEqual(game, original);
});

test('translated missing-player labels and legacy shot events do not invent participants', () => {
  const game = createGame({ away: 'GrIFK' });
  game.events = [
    { id: 'goal', type: 'Maali', team: 'home', period: 1, time: 10, n: '', assists: [] },
    { id: 'save', type: 'Torjunta', team: 'away', period: 1, time: 20, n: '', assists: [] },
    { id: 'legacy', type: 'Laukaus', team: 'home', period: 1, time: 30, n: '', assists: [] }
  ];
  const en = textReport(game, 'en');
  const sv = textReport(game, 'sv');
  assert.match(en, /Scorer not recorded/);
  assert.match(en, /Goalkeeper not recorded/);
  assert.match(en, /Legacy shot attempts/);
  assert.match(sv, /Målskytt saknas/);
  assert.match(sv, /Målvakt saknas/);
  assert.match(sv, /Äldre skottförsök/);
  assert.doesNotMatch(en + sv, /#0/);
});

test('default opponent placeholder is translated for display without changing stored team names', () => {
  const game = createGame();
  assert.equal(game.away, 'Vastustaja');
  assert.match(textReport(game, 'en'), /Kiekko-Espoo – Opponent/);
  assert.match(textReport(game, 'sv'), /Kiekko-Espoo – Motståndare/);
  assert.equal(game.away, 'Vastustaja');
  game.away = 'Vastustaja HC';
  assert.match(textReport(game, 'en'), /Kiekko-Espoo – Vastustaja HC/);
});

test('poster generation captures its chosen language across asynchronous image loading', async () => {
  const { createPoster, REPORT_MESSAGES } = await import('../reports.js');
  const { setLanguage } = await import('../i18n.js?v=0.7.1');
  const originalDocument = globalThis.document;
  const originalImage = globalThis.Image;
  const labels = [];
  const noOp = () => {};
  const context = new Proxy({
    font: '600 24px Arial',
    fillText: text => labels.push(String(text)),
    measureText(text) { return { width: String(text).length * Number(this.font.match(/(\d+)px/)[1]) * 0.52 }; },
    createLinearGradient: () => ({ addColorStop: noOp }),
    createRadialGradient: () => ({ addColorStop: noOp })
  }, { get: (target, property) => property in target ? target[property] : noOp });
  globalThis.document = { createElement: () => ({ getContext: () => context, toBlob: callback => callback(new Blob(['test'], { type: 'image/png' })) }) };
  globalThis.Image = class { set src(value) { queueMicrotask(() => this.onload()); } };
  try {
    const game = createGame({ away: 'GrIFK' });
    setLanguage('en');
    const pending = createPoster(game);
    setLanguage('sv');
    const image = await pending;
    assert.equal(image.type, 'image/png');
    assert.ok(labels.includes('MATCH SUMMARY'));
    assert.ok(labels.includes('HOME'));
    assert.ok(labels.includes('Shots on goal'));
    assert.ok(labels.includes('No goals recorded yet.'));
    assert.ok(labels.includes('Event times show elapsed time in the period.'));
    assert.ok(!labels.includes('MATCHREFERAT'));
    labels.length = 0;
    await createPoster(game, 'sv');
    assert.ok(labels.includes('MATCHREFERAT'));
    assert.ok(labels.includes('HEMMA'));
    assert.ok(labels.includes('Skott på mål'));
    assert.ok(labels.includes('Inga mål registrerade än.'));
    for (const [source, translated] of Object.entries(REPORT_MESSAGES)) {
      const slots = value => [...value.matchAll(/\{(\w+)\}/g)].map(match => match[1]).sort();
      for (const language of ['en', 'sv']) {
        assert.ok(translated[language]?.trim(), `${source}: missing ${language}`);
        assert.deepEqual(slots(translated[language]), slots(source), `${source}: ${language} placeholders`);
      }
    }
  } finally {
    setLanguage('fi');
    if (originalDocument === undefined) delete globalThis.document; else globalThis.document = originalDocument;
    if (originalImage === undefined) delete globalThis.Image; else globalThis.Image = originalImage;
  }
});
