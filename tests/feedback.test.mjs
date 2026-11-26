import test from 'node:test';
import assert from 'node:assert/strict';
import {
  FEEDBACK_STORAGE_KEY, FEEDBACK_KINDS, FEEDBACK_LIMITS, createFeedbackDraft,
  normalizeFeedbackDraft, validateFeedbackDraft, buildFeedbackText, buildFeedbackEmail,
} from '../feedback.js';

const draft = fields => ({ ...createFeedbackDraft(), title: 'Kello pysähtyy', description: 'Pysäytin kellon, mutta aika vaihtui.', ...fields });
const context = fields => ({ recipient: 'developer@example.com', version: '0.6.4', platform: 'iPhone · iOS 27', browser: 'Safari', standalone: true, online: false, offlineReady: true, ...fields });

test('incomplete feedback drafts are separate from match data and round-trip without mutation', () => {
  assert.equal(FEEDBACK_STORAGE_KEY, 'kiekkokirjuri-feedback-v1');
  assert.deepEqual(Object.keys(FEEDBACK_KINDS), ['bug', 'idea', 'question']);
  const incomplete = { ...createFeedbackDraft('idea'), title: '  Oma idea ', description: 'Kesken\r\nuusi rivi', roster: [{ name: 'Salainen pelaaja' }], archive: ['salainen'] };
  const original = structuredClone(incomplete);
  const clean = normalizeFeedbackDraft(incomplete);
  assert.equal(clean.title, ' Oma idea ');
  assert.equal(clean.description, 'Kesken\nuusi rivi');
  assert.deepEqual(normalizeFeedbackDraft(JSON.parse(JSON.stringify(clean))), clean);
  assert.deepEqual(incomplete, original);
  assert.deepEqual(Object.keys(clean), ['type', 'title', 'description', 'steps', 'includeDiagnostics']);
  assert.deepEqual(normalizeFeedbackDraft({}), createFeedbackDraft());
});

test('corrupt draft fields and overlong user text are rejected instead of silently shortened', () => {
  for (const raw of [null, undefined, [], 'not a draft', 1]) assert.throws(() => normalizeFeedbackDraft(raw), /luonnosta/);
  for (const bad of [{ type: 'other' }, { type: null }, { type: '__proto__' }, { title: 42 }, { description: {} }, { steps: [] }, { includeDiagnostics: 'false' }]) {
    assert.throws(() => normalizeFeedbackDraft(bad));
  }
  for (const [field, maximum] of Object.entries(FEEDBACK_LIMITS)) {
    assert.equal(normalizeFeedbackDraft(draft({ [field]: 'a'.repeat(maximum) }))[field].length, maximum);
    assert.throws(() => normalizeFeedbackDraft(draft({ [field]: 'a'.repeat(maximum + 1) })), /Tekstiä ei lyhennetty/);
  }
  assert.throws(() => createFeedbackDraft('other'), /tyyppi/);
});

test('sendable feedback requires both title and description but no reproduction steps', () => {
  assert.throws(() => validateFeedbackDraft(draft({ title: ' \r\n\t ' })), /otsikko/);
  assert.throws(() => validateFeedbackDraft(draft({ description: '\n\t ' })), /mitä tapahtui/);
  const input = draft({ title: '  Kello\n pysähtyy  ', description: '  Kuvaus\n  ', steps: ' \n ' });
  const original = structuredClone(input);
  assert.deepEqual(validateFeedbackDraft(input), draft({ title: 'Kello pysähtyy', description: 'Kuvaus', steps: '' }));
  assert.deepEqual(input, original);
});

test('email URL preserves Finnish text and reserved characters without creating extra headers', () => {
  const input = draft({ title: 'Ääni & jäähy? #1\r\nBcc: x@example.com', description: 'Öljy + jää = 100%\nKuvaus: ä, ö, & ja ? # 😀' });
  const email = buildFeedbackEmail(input, context({ recipient: 'developer+feedback@example.com' }));
  const url = new URL(email.mailto);
  assert.equal(url.protocol, 'mailto:');
  assert.equal(decodeURIComponent(url.pathname), 'developer+feedback@example.com');
  assert.deepEqual([...url.searchParams.keys()], ['subject', 'body']);
  assert.equal(url.searchParams.get('subject'), email.subject);
  assert.doesNotMatch(email.subject, /[\r\n]/);
  assert.equal(url.searchParams.get('body'), email.body.replace(/\n/g, '\r\n'));
  assert.match(email.body, /Öljy \+ jää = 100%\nKuvaus: ä, ö, & ja \? # 😀/);
  assert.equal(url.searchParams.get('bcc'), null);
});

test('only explicitly allowed technical data enters feedback and diagnostics can be disabled', () => {
  const metadata = context({ roster: ['Private name'], archive: ['Private game'], events: ['Private goal'], token: 'SECRET', userAgent: 'Full sensitive user agent', location: 'Private position', raw: 'Private raw backup' });
  const text = buildFeedbackText(draft({ roster: ['Other private player'] }), metadata);
  assert.match(text, /Sovellusversio: 0\.6\.4/);
  assert.match(text, /Laite \/ käyttöjärjestelmä: iPhone · iOS 27/);
  assert.match(text, /Selain: Safari/);
  assert.match(text, /Avaustapa: Kotinäyttösovellus/);
  assert.match(text, /Verkkoyhteys: Ilman yhteyttä/);
  assert.match(text, /Offline-valmius: Valmis/);
  assert.doesNotMatch(text, /Private|private|SECRET|sensitive|userAgent|roster|archive/);
  const optedOut = buildFeedbackEmail(draft({ includeDiagnostics: false }), metadata);
  assert.doesNotMatch(optedOut.body, /Tekniset tiedot|0\.6\.4|iPhone|Safari|Verkkoyhteys|Offline-valmius/);
  assert.doesNotMatch(optedOut.subject, /0\.6\.4/);
});

test('reproduction steps belong only to bug reports and user-authored information remains intact', () => {
  const bug = draft({ steps: '1. Avaa peli.\n2. Paina Aloita erä.', description: 'Kirjoitin itse pelaajan numeron #15 tähän.' });
  assert.match(buildFeedbackText(bug), /Näin toistat ongelman\n1\. Avaa peli\.\n2\. Paina Aloita erä\./);
  assert.match(buildFeedbackText(bug), /#15/);
  for (const type of ['idea', 'question']) {
    const email = buildFeedbackEmail({ ...bug, type }, context());
    assert.match(email.subject, new RegExp(FEEDBACK_KINDS[type]));
    assert.doesNotMatch(email.body, /Näin toistat ongelman|1\. Avaa peli/);
  }
});

test('configured recipient is one validated address and cannot inject recipient lists or headers', () => {
  for (const recipient of ['', null, 'bad', 'a@example.com,b@example.com', 'a@example.com?bcc=x@example.com', 'a@example.com\r\nBcc:x@example.com', 'Name <a@example.com>', 'a@-example.com']) {
    assert.throws(() => buildFeedbackEmail(draft(), context({ recipient })), /sähköpostiosoite/);
  }
  assert.throws(() => buildFeedbackEmail(draft()), /sähköpostiosoite/);
  assert.throws(() => buildFeedbackEmail(draft(), null), /sähköpostiosoite/);
});

test('long allowed messages remain complete and damaged Unicode cannot crash email encoding', () => {
  const input = draft({ title: 'ä'.repeat(100), description: 'ö'.repeat(1500), steps: 'å'.repeat(600) });
  const email = buildFeedbackEmail(input, context());
  assert.ok(email.mailto.length > 10000);
  assert.ok(email.body.includes(input.description));
  assert.ok(email.body.includes(input.steps));
  const repaired = buildFeedbackEmail(draft({ description: 'Teksti\ud800\u0000 jatkuu 😀' }), context({ browser: 'Safari\r\nVäärä otsake: x', platform: 'x'.repeat(300) }));
  assert.match(repaired.body, /Teksti� jatkuu 😀/);
  assert.match(repaired.body, /Selain: Safari Väärä otsake: x/);
  const platform = repaired.body.split('\n').find(line => line.startsWith('Laite / käyttöjärjestelmä: ')).split(': ')[1];
  assert.equal(platform.length, 120);
  assert.ok(platform.endsWith('…'));
  const boundary = buildFeedbackEmail(draft(), context({ browser: 'a'.repeat(118) + '😀' + 'b'.repeat(10) }));
  assert.equal(new URL(boundary.mailto).searchParams.get('body'), boundary.body.replace(/\n/g, '\r\n'));
  assert.match(boundary.body, new RegExp('Selain: ' + 'a'.repeat(118) + '…'));
});
