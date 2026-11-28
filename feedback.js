/** Feedback formatting only. No network, storage, browser globals or match data. */
import { createTranslator, getLanguage } from './i18n.js?v=0.8.1';

export const FEEDBACK_MESSAGES = {
  "Bugi": {
    "en": "Bug report",
    "sv": "Felrapport"
  },
  "Kehitysidea": {
    "en": "Feature request",
    "sv": "Funktionsförslag"
  },
  "Kysymys": {
    "en": "Question",
    "sv": "Fråga"
  },
  "Otsikko": {
    "en": "Title",
    "sv": "Rubrik"
  },
  "Kuvaus": {
    "en": "Description",
    "sv": "Beskrivning"
  },
  "Toistamisohje": {
    "en": "Steps to reproduce",
    "sv": "Steg för att återskapa felet"
  },
  "{field} ei ole tekstiä.": {
    "en": "{field} must be text.",
    "sv": "{field} måste vara text."
  },
  "{field} saa olla enintään {maximum} merkkiä. Tekstiä ei lyhennetty.": {
    "en": "{field} can contain up to {maximum} characters. Your text has not been shortened.",
    "sv": "{field} får innehålla högst {maximum} tecken. Din text har inte kortats ned."
  },
  "Valitse palautteen tyyppi.": {
    "en": "Choose a feedback type.",
    "sv": "Välj typ av respons."
  },
  "Palauteluonnosta ei voitu lukea.": {
    "en": "The feedback draft could not be read.",
    "sv": "Responsutkastet kunde inte läsas."
  },
  "Palauteluonnoksen teknisten tietojen valinta ei kelpaa.": {
    "en": "The feedback draft has an invalid diagnostics setting.",
    "sv": "Inställningen för teknisk information i responsutkastet är ogiltig."
  },
  "Kirjoita palautteelle lyhyt otsikko.": {
    "en": "Give your feedback a short title.",
    "sv": "Skriv en kort rubrik för din respons."
  },
  "Kerro, mitä tapahtui tai mitä toivoisit.": {
    "en": "Describe what happened or what you would like.",
    "sv": "Beskriv vad som hände eller vad du önskar."
  },
  "Sovellusversio": {
    "en": "App version",
    "sv": "Appversion"
  },
  "Laite / käyttöjärjestelmä": {
    "en": "Device / operating system",
    "sv": "Enhet / operativsystem"
  },
  "Selain": {
    "en": "Browser",
    "sv": "Webbläsare"
  },
  "Avaustapa": {
    "en": "Opened as",
    "sv": "Öppnad som"
  },
  "Kotinäyttösovellus": {
    "en": "Home screen app",
    "sv": "App från hemskärmen"
  },
  "Verkkoyhteys": {
    "en": "Connection",
    "sv": "Anslutning"
  },
  "Verkossa": {
    "en": "Online",
    "sv": "Online"
  },
  "Ilman yhteyttä": {
    "en": "Offline",
    "sv": "Utan internet"
  },
  "Offline-valmius": {
    "en": "Offline readiness",
    "sv": "Offline-status"
  },
  "Valmis": {
    "en": "Ready",
    "sv": "Klar"
  },
  "Ei valmis": {
    "en": "Not ready",
    "sv": "Inte klar"
  },
  "Aihe": {
    "en": "Subject",
    "sv": "Ämne"
  },
  "Näin toistat ongelman": {
    "en": "Steps to reproduce",
    "sv": "Så återskapar du felet"
  },
  "Tekniset tiedot": {
    "en": "Technical details",
    "sv": "Teknisk information"
  },
  "Palautteen vastaanottajan sähköpostiosoite ei kelpaa.": {
    "en": "The feedback recipient’s email address is invalid.",
    "sv": "E-postadressen till mottagaren av responsen är ogiltig."
  }
};
const t = createTranslator(FEEDBACK_MESSAGES);

export const FEEDBACK_STORAGE_KEY = 'kiekkokirjuri-feedback-v1';
export const FEEDBACK_KINDS = Object.freeze({
  bug: 'Bugi',
  idea: 'Kehitysidea',
  question: 'Kysymys',
});
/** Labels are translated at render time; the stored type identifiers never change. */
export function getFeedbackKinds(language = getLanguage()) {
  return Object.fromEntries(Object.entries(FEEDBACK_KINDS).map(([type, label]) => [type, t(label, {}, language)]));
}

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

function cleanText(value, field, singleLine = false, language = getLanguage()) {
  if (value === undefined) return '';
  if (typeof value !== 'string') throw new Error(t('{field} ei ole tekstiä.', {field:t(fieldNames[field], {}, language)}, language));
  let text = wellFormed(value).replace(/\r\n?/g, '\n').replace(controlCharacters, '');
  if (singleLine) text = text.replace(/\s+/gu, ' ');
  if (text.length > FEEDBACK_LIMITS[field]) {
    throw new Error(t('{field} saa olla enintään {maximum} merkkiä. Tekstiä ei lyhennetty.', {field:t(fieldNames[field], {}, language), maximum:FEEDBACK_LIMITS[field]}, language));
  }
  return text;
}

export function createFeedbackDraft(type = 'bug', language = getLanguage()) {
  if (typeof type !== 'string' || !Object.hasOwn(FEEDBACK_KINDS, type)) throw new Error(t('Valitse palautteen tyyppi.', {}, language));
  return { type, title: '', description: '', steps: '', includeDiagnostics: true };
}

/** Accept incomplete drafts; reject corrupt fields and never silently truncate user text. */
export function normalizeFeedbackDraft(raw, language = getLanguage()) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    throw new Error(t('Palauteluonnosta ei voitu lukea.', {}, language));
  }
  const type = raw.type === undefined ? 'bug' : raw.type;
  if (typeof type !== 'string' || !Object.hasOwn(FEEDBACK_KINDS, type)) {
    throw new Error(t('Valitse palautteen tyyppi.', {}, language));
  }
  if (raw.includeDiagnostics !== undefined && typeof raw.includeDiagnostics !== 'boolean') {
    throw new Error(t('Palauteluonnoksen teknisten tietojen valinta ei kelpaa.', {}, language));
  }
  // Explicit projection keeps unrelated imported fields, matches and rosters out.
  return {
    type,
    title: cleanText(raw.title, 'title', true, language),
    description: cleanText(raw.description, 'description', false, language),
    steps: cleanText(raw.steps, 'steps', false, language),
    includeDiagnostics: raw.includeDiagnostics ?? true,
  };
}

/** Return a sendable draft or throw a localized form error. */
export function validateFeedbackDraft(raw, language = getLanguage()) {
  const draft = normalizeFeedbackDraft(raw, language);
  draft.title = draft.title.trim();
  draft.description = draft.description.trim();
  draft.steps = draft.steps.trim();
  if (!draft.title) throw new Error(t('Kirjoita palautteelle lyhyt otsikko.', {}, language));
  if (!draft.description) throw new Error(t('Kerro, mitä tapahtui tai mitä toivoisit.', {}, language));
  return draft;
}

function diagnosticText(value, maximum = 120) {
  if (typeof value !== 'string') return '';
  const text = wellFormed(value).replace(controlCharacters, '').replace(/\s+/gu, ' ').trim();
  if (text.length <= maximum) return text;
  // Do not leave half of a surrogate pair when shortening technical labels.
  return `${text.slice(0, maximum - 1).replace(/[\ud800-\udbff]$/, '')}…`;
}

function diagnostics(context, language) {
  if (!context || typeof context !== 'object' || Array.isArray(context)) return [];
  const rows = [];
  for (const [field, label, maximum] of [
    ['version', 'Sovellusversio', 40],
    ['platform', 'Laite / käyttöjärjestelmä', 120],
    ['browser', 'Selain', 120],
  ]) {
    const text = diagnosticText(context[field], maximum);
    if (text) rows.push(`${t(label, {}, language)}: ${text}`);
  }
  if (typeof context.standalone === 'boolean') rows.push(`${t('Avaustapa', {}, language)}: ${t(context.standalone ? 'Kotinäyttösovellus' : 'Selain', {}, language)}`);
  if (typeof context.online === 'boolean') rows.push(`${t('Verkkoyhteys', {}, language)}: ${t(context.online ? 'Verkossa' : 'Ilman yhteyttä', {}, language)}`);
  if (typeof context.offlineReady === 'boolean') rows.push(`${t('Offline-valmius', {}, language)}: ${t(context.offlineReady ? 'Valmis' : 'Ei valmis', {}, language)}`);
  return rows;
}

export function buildFeedbackText(raw, context = {}) {
  const language = context?.language ?? getLanguage();
  const draft = validateFeedbackDraft(raw, language);
  const paragraphs = [
    `Kiekkokirjuri – ${getFeedbackKinds(language)[draft.type]}`,
    `${t('Aihe', {}, language)}: ${draft.title}`,
    `${t('Kuvaus', {}, language)}\n${draft.description}`,
  ];
  if (draft.type === 'bug' && draft.steps) paragraphs.push(`${t('Näin toistat ongelman', {}, language)}\n${draft.steps}`);
  if (draft.includeDiagnostics) {
    const rows = diagnostics(context, language);
    if (rows.length) paragraphs.push(`${t('Tekniset tiedot', {}, language)}\n${rows.join('\n')}`);
  }
  return paragraphs.join('\n\n');
}

function recipientAddress(value, language) {
  const recipient = typeof value === 'string' ? value.trim() : '';
  // This app accepts a single configured address, never a header or address list.
  const address = /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)+$/i;
  if (recipient.length > 254 || !address.test(recipient)) {
    throw new Error(t('Palautteen vastaanottajan sähköpostiosoite ei kelpaa.', {}, language));
  }
  return recipient;
}

/** Opens a draft in the user's email app; this function does not send anything. */
export function buildFeedbackEmail(raw, context = {}) {
  const language = context?.language ?? getLanguage();
  const draft = validateFeedbackDraft(raw, language);
  const recipient = recipientAddress(context?.recipient, language);
  const subject = `[Kiekkokirjuri · ${getFeedbackKinds(language)[draft.type]}] ${draft.title}`;
  const body = buildFeedbackText(draft, context);
  const encodedRecipient = encodeURIComponent(recipient).replace(/%40/g, '@');
  // RFC mailto body line breaks use CRLF; the copyable plain text uses LF.
  const mailto = `mailto:${encodedRecipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body.replace(/\n/g, '\r\n'))}`;
  return { subject, body, mailto };
}
