/** Feedback formatting only. No network, storage, browser globals or match data. */
export const FEEDBACK_STORAGE_KEY = 'kiekkokirjuri-feedback-v1';
export const FEEDBACK_KINDS = Object.freeze({
  bug: 'Bugi',
  idea: 'Kehitysidea',
  question: 'Kysymys',
});
export const FEEDBACK_LIMITS = Object.freeze({ title: 100, description: 1500, steps: 600 });

const fieldNames = { title: 'Otsikko', description: 'Kuvaus', steps: 'Toistamisohje' };
const controlCharacters = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g;

// A damaged local draft may contain an isolated UTF-16 surrogate. Preserve its
// location as a replacement character instead of letting URL encoding fail.
function wellFormed(value) {
  return Array.from(value, character => {
    const code = character.codePointAt(0);
    return code >= 0xd800 && code <= 0xdfff ? '\ufffd' : character;
  }).join('');
}

function cleanText(value, field, singleLine = false) {
  if (value === undefined) return '';
  if (typeof value !== 'string') throw new Error(`${fieldNames[field]} ei ole tekstiä.`);
  let text = wellFormed(value).replace(/\r\n?/g, '\n').replace(controlCharacters, '');
  if (singleLine) text = text.replace(/\s+/gu, ' ');
  if (text.length > FEEDBACK_LIMITS[field]) {
    throw new Error(`${fieldNames[field]} saa olla enintään ${FEEDBACK_LIMITS[field]} merkkiä. Tekstiä ei lyhennetty.`);
  }
  return text;
}

export function createFeedbackDraft(type = 'bug') {
  if (typeof type !== 'string' || !Object.hasOwn(FEEDBACK_KINDS, type)) throw new Error('Valitse palautteen tyyppi.');
  return { type, title: '', description: '', steps: '', includeDiagnostics: true };
}

/** Accept incomplete drafts; reject corrupt fields and never silently truncate user text. */
export function normalizeFeedbackDraft(raw) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    throw new Error('Palauteluonnosta ei voitu lukea.');
  }
  const type = raw.type === undefined ? 'bug' : raw.type;
  if (typeof type !== 'string' || !Object.hasOwn(FEEDBACK_KINDS, type)) {
    throw new Error('Valitse palautteen tyyppi.');
  }
  if (raw.includeDiagnostics !== undefined && typeof raw.includeDiagnostics !== 'boolean') {
    throw new Error('Palauteluonnoksen teknisten tietojen valinta ei kelpaa.');
  }
  // Explicit projection keeps unrelated imported fields, matches and rosters out.
  return {
    type,
    title: cleanText(raw.title, 'title', true),
    description: cleanText(raw.description, 'description'),
    steps: cleanText(raw.steps, 'steps'),
    includeDiagnostics: raw.includeDiagnostics ?? true,
  };
}

/** Return a sendable draft or throw a short Finnish form error. */
export function validateFeedbackDraft(raw) {
  const draft = normalizeFeedbackDraft(raw);
  draft.title = draft.title.trim();
  draft.description = draft.description.trim();
  draft.steps = draft.steps.trim();
  if (!draft.title) throw new Error('Kirjoita palautteelle lyhyt otsikko.');
  if (!draft.description) throw new Error('Kerro, mitä tapahtui tai mitä toivoisit.');
  return draft;
}

function diagnosticText(value, maximum = 120) {
  if (typeof value !== 'string') return '';
  const text = wellFormed(value).replace(controlCharacters, '').replace(/\s+/gu, ' ').trim();
  if (text.length <= maximum) return text;
  // Do not leave half of a surrogate pair when shortening technical labels.
  return `${text.slice(0, maximum - 1).replace(/[\ud800-\udbff]$/, '')}…`;
}

function diagnostics(context) {
  if (!context || typeof context !== 'object' || Array.isArray(context)) return [];
  const rows = [];
  for (const [field, label, maximum] of [
    ['version', 'Sovellusversio', 40],
    ['platform', 'Laite / käyttöjärjestelmä', 120],
    ['browser', 'Selain', 120],
  ]) {
    const text = diagnosticText(context[field], maximum);
    if (text) rows.push(`${label}: ${text}`);
  }
  if (typeof context.standalone === 'boolean') rows.push(`Avaustapa: ${context.standalone ? 'Kotinäyttösovellus' : 'Selain'}`);
  if (typeof context.online === 'boolean') rows.push(`Verkkoyhteys: ${context.online ? 'Verkossa' : 'Ilman yhteyttä'}`);
  if (typeof context.offlineReady === 'boolean') rows.push(`Offline-valmius: ${context.offlineReady ? 'Valmis' : 'Ei valmis'}`);
  return rows;
}

export function buildFeedbackText(raw, context = {}) {
  const draft = validateFeedbackDraft(raw);
  const paragraphs = [
    `Kiekkokirjuri – ${FEEDBACK_KINDS[draft.type]}`,
    `Aihe: ${draft.title}`,
    `Kuvaus\n${draft.description}`,
  ];
  if (draft.type === 'bug' && draft.steps) paragraphs.push(`Näin toistat ongelman\n${draft.steps}`);
  if (draft.includeDiagnostics) {
    const rows = diagnostics(context);
    if (rows.length) paragraphs.push(`Tekniset tiedot\n${rows.join('\n')}`);
  }
  return paragraphs.join('\n\n');
}

function recipientAddress(value) {
  const recipient = typeof value === 'string' ? value.trim() : '';
  // This app accepts a single configured address, never a header or address list.
  const address = /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)+$/i;
  if (recipient.length > 254 || !address.test(recipient)) {
    throw new Error('Palautteen vastaanottajan sähköpostiosoite ei kelpaa.');
  }
  return recipient;
}

/** Opens a draft in the user's email app; this function does not send anything. */
export function buildFeedbackEmail(raw, context = {}) {
  const draft = validateFeedbackDraft(raw);
  const recipient = recipientAddress(context?.recipient);
  const subject = `[Kiekkokirjuri · ${FEEDBACK_KINDS[draft.type]}] ${draft.title}`;
  const body = buildFeedbackText(draft, context);
  const encodedRecipient = encodeURIComponent(recipient).replace(/%40/g, '@');
  // RFC mailto body line breaks use CRLF; the copyable plain text uses LF.
  const mailto = `mailto:${encodedRecipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body.replace(/\n/g, '\r\n'))}`;
  return { subject, body, mailto };
}
