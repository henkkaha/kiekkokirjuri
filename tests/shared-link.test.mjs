import test from 'node:test';
import assert from 'node:assert/strict';
import { gzipSync } from 'node:zlib';
import { createGame, score, teamStats, playerStats, periodStats } from '../model.js';
import { textReport } from '../reports.js';
import { SHARE_LIMITS, prepareSharedGame, createMatchLink, readMatchLink } from '../shared-link.js';

const base = 'https://example.test/kiekkokirjuri/index.html?private=query#tilastot';
const code = expected => error => error?.code === expected;
const hash = url => new URL(url).hash;
const plain = payload => '#v1.j.' + Buffer.from(JSON.stringify(payload)).toString('base64url');
const compressed = payload => '#v1.g.' + gzipSync(Buffer.from(JSON.stringify(payload))).toString('base64url');

function fixture() {
  const game = createGame({ home: 'EKS Blue', away: 'GrIFK', teamColors: { home: 'blue', away: 'yellow' } });
  game.date = '2026-11-28T14:00:00.000Z';
  game.period = 2;
  game.seconds = 30.25;
  game.start = 100000;
  game.roster = [
    { team: 'home', n: '0', name: 'Mäkinen' },
    { team: 'home', n: '15', name: 'Haho' },
    { team: 'away', n: '7', name: 'Österman' },
    { team: 'away', n: '30', name: '</textarea><script>alert("name")</script>' },
  ];
  const event = (type, team, values = {}) => ({ id: Math.random().toString(), type, team, period: 1, time: 45, n: '', assists: [], ...values });
  game.events = [
    event('Maali', 'home', { n: '15', assists: ['0'] }),
    event('Maali', 'away', { n: '7' }), // Equal timestamps retain the original score progression.
    event('Torjunta', 'home', { n: '0', time: 70 }),
    event('Torjunta', 'away', { n: '', time: 80 }),
    event('Jäähy', 'away', { period: 2, n: '30', minutes: 2, penaltyLabel: '2 min · pieni rangaistus', reason: 'Kampitus', detail: 'Kärsii #22 & <ei HTML>' }),
    event('Jäähy', 'home', { period: 2, time: 60, minutes: 3, penaltyLabel: 'Oma rangaistus', reason: 'Tarkka oma selite' }),
    event('Laukaus', 'home', { period: 2, time: 61, n: '15', detail: 'Ohi maalin' }),
  ];
  game.notes = 'PRIVATE MATCH NOTE';
  game.feedbackDraft = { email: 'private@example.test', body: 'PRIVATE FEEDBACK' };
  game.activeGoalies = { home: '0', away: '30' };
  game.extra = 'PRIVATE UNKNOWN FIELD';
  game.archive = [{ secret: 'PRIVATE OTHER MATCH' }];
  return game;
}

test('a compressed link preserves the frozen match and all three reports without sharing other data', async () => {
  const game = fixture();
  const original = structuredClone(game);
  const url = await createMatchLink(game, base, { now: 101250 });
  assert.equal(new URL(url).pathname, '/kiekkokirjuri/kooste.html');
  assert.equal(new URL(url).search, '');
  assert.match(hash(url), /^#v1\.g\.[A-Za-z0-9_-]+$/);
  assert.ok(url.length < SHARE_LIMITS.url);
  const decoded = await readMatchLink(hash(url));
  assert.equal(decoded.seconds, 31.5);
  assert.equal(decoded.start, null);
  assert.equal(decoded.finished, false);
  assert.deepEqual(decoded.teamColors, { home: 'blue', away: 'yellow' });
  assert.equal(decoded.events[2].n, '0');
  assert.equal(decoded.events[3].n, '');
  assert.deepEqual(decoded.events.map(event => event.type), game.events.map(event => event.type));
  assert.deepEqual(score(decoded), { home: 1, away: 1 });
  assert.deepEqual(teamStats(decoded), teamStats(game));
  assert.deepEqual(periodStats(decoded), periodStats(game));
  for (const team of ['home', 'away']) assert.deepEqual(playerStats(decoded, team), playerStats(game, team));
  const expected = { ...game, seconds: 31.5, start: null, notes: undefined };
  for (const language of ['fi', 'en', 'sv']) {
    assert.equal(textReport(decoded, language), textReport(expected, language));
  }
  const publicJSON = JSON.stringify(decoded);
  assert.doesNotMatch(publicJSON, /PRIVATE|private@example|archive|feedbackDraft|activeGoalies|"id"|"notes"|"extra"/);
  assert.equal(decoded.roster[3].name, game.roster[3].name);
  assert.equal(decoded.events[4].detail, 'Kärsii #22 & <ei HTML>');
  assert.deepEqual(game, original);
});

test('a link remains the same snapshot after later edits, with no shared object references', async () => {
  const game = fixture();
  const prepared = prepareSharedGame(game, 101250);
  const url = await createMatchLink(prepared, base);
  game.home = 'Changed later';
  game.roster[0].name = 'Changed player';
  game.events[0].assists.push('99');
  game.events.push({ type: 'Maali', team: 'home', period: 2, time: 120, n: '', assists: [] });
  assert.equal(prepared.home, 'EKS Blue');
  assert.equal(prepared.roster[0].name, 'Mäkinen');
  assert.deepEqual(prepared.events[0].assists, ['0']);
  const decoded = await readMatchLink(hash(url));
  assert.deepEqual(score(decoded), { home: 1, away: 1 });
  assert.equal(decoded.seconds, 31.5);
});

test('plain mode and browsers without CompressionStream produce portable links', async () => {
  const game = fixture();
  game.start = null;
  const direct = await createMatchLink(game, base, { compression: false });
  assert.match(hash(direct), /^#v1\.j\./);
  const native = globalThis.CompressionStream;
  try {
    globalThis.CompressionStream = undefined;
    const fallback = await createMatchLink(game, base);
    assert.equal(fallback, direct);
    assert.deepEqual(await readMatchLink(hash(fallback)), await readMatchLink(hash(direct)));
  } finally { globalThis.CompressionStream = native; }
});

test('missing date stays missing and an archived match is shared independently', async () => {
  const archived = createGame({ home: 'Old home', away: 'Old away' });
  delete archived.date;
  archived.finished = true;
  archived.roster = [{ team: 'away', n: 0, name: 'Nolla' }];
  archived.events = [{ type: 'Maali', team: 'away', period: 1, time: 0, n: 0, assists: [] }];
  archived.archive = [fixture()];
  const decoded = await readMatchLink(hash(await createMatchLink(archived, base)));
  assert.equal(decoded.finished, true);
  assert.equal(decoded.date, undefined);
  assert.equal(decoded.home, 'Old home');
  assert.deepEqual(score(decoded), { home: 0, away: 1 });
  assert.equal(decoded.events[0].n, '0');
  assert.doesNotMatch(textReport(decoded, 'fi'), /Päivämäärä|EKS Blue|PRIVATE/);
});

test('only own whitelisted fields survive and unknown CSS colors are never copied', async () => {
  const game = fixture();
  Object.setPrototypeOf(game, { inheritedSecret: 'PRIVATE PROTOTYPE' });
  game.__protoPayload = JSON.parse('{"__proto__":{"polluted":true}}');
  game.teamColors = { home: 'url(javascript:alert(1))', away: 'yellow', background: 'evil' };
  game.roster[0].privateAddress = 'PRIVATE ADDRESS';
  game.events[0].privateEmail = 'PRIVATE EMAIL';
  const decoded = await readMatchLink(hash(await createMatchLink(game, base)));
  for (const object of [decoded, ...decoded.roster, ...decoded.events]) {
    assert.equal(Object.getPrototypeOf(object), Object.prototype);
    assert.equal(object.polluted, undefined);
  }
  assert.deepEqual(decoded.teamColors, { home: 'blue', away: 'yellow' });
  assert.equal(decoded.inheritedSecret, undefined);
  assert.doesNotMatch(JSON.stringify(decoded), /PRIVATE|__proto__|javascript/);
  assert.equal({}.polluted, undefined);
});

test('malformed, unsupported, noncanonical, and invalid UTF-8 fragments fail with stable codes', async () => {
  for (const value of ['', '#', '#v1.g.', '#v1.j.A=', '#v1.j.a+b', '#v1.j.A', '#v1.j.Zh', '#v1.j.____', '#v1.g.YWJj', '#v1.j.' + Buffer.from([0xc3, 0x28]).toString('base64url')]) {
    await assert.rejects(readMatchLink(value), code('SHARE_INVALID'), value);
  }
  for (const value of ['#v2.j.AA', '#v1.z.AA']) await assert.rejects(readMatchLink(value), code('SHARE_UNSUPPORTED'));
  await assert.rejects(readMatchLink(null), code('SHARE_INVALID'));
  await assert.rejects(createMatchLink(fixture(), 'javascript:alert(1)'), code('SHARE_INVALID'));
});

test('decoded tuples reject invalid teams, numbers, shapes, timestamps, and extra fields', async () => {
  const url = await createMatchLink(fixture(), base, { compression: false, now: 101250 });
  const valid = JSON.parse(Buffer.from(hash(url).split('.')[2], 'base64url').toString());
  const mutations = [
    payload => payload.push('unexpected'),
    payload => { payload[0] = {}; },
    payload => { payload[2] = 'not a date'; },
    payload => { payload[3] = 0; },
    payload => { payload[4] = 1001; },
    payload => { payload[5] = -1; },
    payload => { payload[6] = true; },
    payload => { payload[7][0] = -1; },
    payload => { payload[8][0][0] = 2; },
    payload => { payload[8][0][1] = null; },
    payload => { payload[8][0][1] = '0'; },
    payload => { payload[9][0][0] = 4; },
    payload => { payload[9][0][1] = 2; },
    payload => { payload[9][0][3] = -1; },
    payload => { payload[9][0][4] = 100; },
    payload => { payload[9][0][5] = {}; },
    payload => { payload[9][0][5] = [100]; },
  ];
  for (const mutate of mutations) {
    const payload = structuredClone(valid);
    mutate(payload);
    await assert.rejects(readMatchLink(plain(payload)), code('SHARE_INVALID'));
  }
  await assert.rejects(readMatchLink(plain({ __proto__: { polluted: true } })), code('SHARE_INVALID'));
});

test('input size limits fail without silently truncating teams, events, or details', async () => {
  const event = { type: 'Torjunta', team: 'home', period: 1, time: 0, n: '', assists: [] };
  for (const change of [
    game => { game.home = 'a'.repeat(SHARE_LIMITS.name + 1); },
    game => { game.events = Array.from({ length: SHARE_LIMITS.events + 1 }, () => ({ ...event })); },
    game => { game.roster = Array.from({ length: SHARE_LIMITS.roster + 1 }, () => ({ team: 'home', n: '1', name: '' })); },
    game => { game.events[0].detail = 'a'.repeat(SHARE_LIMITS.detail + 1); },
  ]) {
    const game = fixture(); change(game);
    await assert.rejects(createMatchLink(game, base), code('SHARE_TOO_LARGE'));
  }
  const large = fixture();
  large.events = Array.from({ length: 600 }, () => ({ ...event, detail: 'a'.repeat(SHARE_LIMITS.detail) }));
  await assert.rejects(createMatchLink(large, base), code('SHARE_TOO_LARGE'));
  const longPlain = fixture();
  longPlain.events = Array.from({ length: 20 }, () => ({ ...event, detail: 'a'.repeat(400) }));
  await assert.rejects(createMatchLink(longPlain, base, { compression: false }), code('SHARE_TOO_LARGE'));
  await assert.rejects(readMatchLink('#v1.j.' + 'a'.repeat(SHARE_LIMITS.url)), code('SHARE_TOO_LARGE'));
});

test('a compressed oversized payload is bounded before JSON parsing', async () => {
  const bomb = gzipSync(Buffer.alloc(SHARE_LIMITS.decodedBytes + 1, 0x20));
  const fragment = '#v1.g.' + bomb.toString('base64url');
  assert.ok(fragment.length < SHARE_LIMITS.url);
  await assert.rejects(readMatchLink(fragment), code('SHARE_TOO_LARGE'));
  const many = ['H', 'A', null, 1200, 1, 0, 0, [0, 1], [], Array.from({ length: SHARE_LIMITS.events + 1 }, () => [1, 0, 1, 0, null])];
  await assert.rejects(readMatchLink(compressed(many)), code('SHARE_TOO_LARGE'));
});

test('gzip corruption and unavailable decompression do not return a partial match', async () => {
  const url = await createMatchLink(fixture(), base);
  const valid = hash(url);
  assert.match(valid, /^#v1\.g\./);
  const bytes = Buffer.from(valid.split('.')[2], 'base64url');
  bytes[bytes.length - 1] ^= 1;
  await assert.rejects(readMatchLink('#v1.g.' + bytes.toString('base64url')), code('SHARE_INVALID'));
  const native = globalThis.DecompressionStream;
  try {
    globalThis.DecompressionStream = undefined;
    await assert.rejects(readMatchLink(valid), code('SHARE_UNSUPPORTED'));
    const plainURL = await createMatchLink(fixture(), base, { compression: false });
    assert.deepEqual(score(await readMatchLink(hash(plainURL))), { home: 1, away: 1 });
  } finally { globalThis.DecompressionStream = native; }
});

test('a typical long game remains a compact URL with complete save totals', async () => {
  const game = createGame();
  game.roster = Array.from({ length: 40 }, (_, index) => ({ team: index < 20 ? 'home' : 'away', n: String(index % 20), name: `Sukunimi${index}` }));
  game.events = Array.from({ length: 300 }, (_, index) => ({ type: 'Torjunta', team: index % 2 ? 'home' : 'away', period: 1 + Math.floor(index / 100), time: index % 100 * 12, n: String(index % 20), assists: [] }));
  game.period = 3;
  const url = await createMatchLink(game, base);
  assert.ok(url.length < 4000, `Expected a practical compressed link, got ${url.length} characters`);
  const decoded = await readMatchLink(hash(url));
  assert.equal(decoded.events.length, 300);
  assert.equal(decoded.roster.length, 40);
  assert.deepEqual(teamStats(decoded), teamStats(game));
});
