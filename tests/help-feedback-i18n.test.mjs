import test from 'node:test';
import assert from 'node:assert/strict';
import { getLanguage, setLanguage } from '../i18n.js?v=0.7.1';
import { renderHelp, HELP_MESSAGES } from '../help.js';
import { HELP_COPY } from '../help-messages.js?v=0.7.1';
import {
  FEEDBACK_MESSAGES, FEEDBACK_KINDS, getFeedbackKinds, createFeedbackDraft,
  normalizeFeedbackDraft, validateFeedbackDraft, buildFeedbackText, buildFeedbackEmail,
} from '../feedback.js';

const escapeHTML = value => String(value).replace(/[&<>"']/g, character => ({
  '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'
}[character]));
const help = language => renderHelp({ icon:() => '<svg aria-hidden="true"></svg>', escapeHTML, version:'0.7.1', language });
const input = { ...createFeedbackDraft('bug'), title:'Åberg & Co {version}', description:'User-written text: Maali, Jäähy, äö, <test> 😀', steps:'1. Start.\n2. Stop.' };
const context = { recipient:'developer@example.com', version:'0.7.1', platform:'iPhone', browser:'Safari', standalone:true, online:false, offlineReady:true };

test('every help and feedback translation preserves interpolation placeholders and static markup', () => {
  const placeholders = text => [...text.matchAll(/\{([A-Za-z][A-Za-z0-9_]*)\}/g)].map(match => match[1]).sort();
  const tags = text => text.match(/<\/?[a-z][^>]*>/gi) || [];
  for (const [source, translations] of Object.entries({ ...HELP_MESSAGES, ...FEEDBACK_MESSAGES })) {
    for (const language of ['en','sv']) {
      assert.equal(typeof translations[language], 'string', source + ': ' + language);
      assert.ok(translations[language].trim().length, source + ': empty ' + language);
      assert.deepEqual(placeholders(translations[language]), placeholders(source), source);
      assert.deepEqual(tags(translations[language]), tags(source), source);
    }
  }
});

test('English and Swedish help cover all topics and retain canonical feedback actions', () => {
  for (const language of ['en','sv']) {
    const html = help(language);
    assert.equal((html.match(/class="help-topic"/g) || []).length, HELP_COPY.topics.length);
    for (const topic of HELP_COPY.topics) assert.ok(html.includes(HELP_MESSAGES[topic.title][language]));
    for (const type of ['bug','idea','question']) assert.ok(html.includes('data-kind="' + type + '"'));
    assert.ok(html.includes('data-action="install-help"'));
    assert.doesNotMatch(html, /PIKAOHJE|Käyttöohje|Valmiina ensimmäiseen|Ilmoita bugista|Ehdota ominaisuutta|Ohje toimii/);
    assert.match(html, /Suomi, English/);
  }
  assert.match(help('en'), /your team’s goals \+ the opponents’ saves/);
  assert.match(help('sv'), /egna mål \+ motståndarnas räddningar/);
  assert.match(help('fi'), /omat maalit \+ vastustajan torjunnat/);
  assert.match(renderHelp({icon:() => '',escapeHTML,version:'<img onerror=x>',language:'en'}), /&lt;img onerror=x&gt;/);
});

test('feedback language changes only generated labels and never the saved draft or recipient', () => {
  const original = structuredClone(input);
  for (const [language, kind, section] of [['en','Bug report','Technical details'],['sv','Felrapport','Teknisk information']]) {
    const email = buildFeedbackEmail(input, { ...context, language, roster:['SECRET'], languageData:'SECRET' });
    assert.equal(email.subject, '[Kiekkokirjuri · ' + kind + '] ' + input.title);
    assert.ok(email.body.includes(section));
    assert.ok(email.body.includes(input.description));
    assert.ok(email.body.includes(input.steps));
    assert.doesNotMatch(email.body, /Sovellusversio|Laite \/ käyttöjärjestelmä|Avaustapa|Verkkoyhteys|Tekniset tiedot|SECRET/);
    const url = new URL(email.mailto);
    assert.equal(url.pathname, context.recipient);
    assert.deepEqual([...url.searchParams.keys()], ['subject','body']);
    assert.equal(url.searchParams.get('body'), email.body.replace(/\n/g,'\r\n'));
    assert.deepEqual(normalizeFeedbackDraft(input, language), original);
  }
  assert.deepEqual(input, original);
  assert.deepEqual(FEEDBACK_KINDS, {bug:'Bugi',idea:'Kehitysidea',question:'Kysymys'});
});

test('explicit feedback language stays consistent even when the app language is different', () => {
  const previous = getLanguage();
  try {
    setLanguage('sv');
    assert.deepEqual(getFeedbackKinds(), {bug:'Felrapport',idea:'Funktionsförslag',question:'Fråga'});
    assert.match(buildFeedbackText(input, context), /Anslutning: Utan internet/);
    const english = buildFeedbackEmail(input, { ...context, language:'en' });
    assert.match(english.body, /Opened as: Home screen app/);
    assert.match(english.body, /Connection: Offline/);
    assert.match(english.body, /Offline readiness: Ready/);
    assert.doesNotMatch(english.body, /Felrapport|Teknisk information|Anslutning/);
    assert.throws(() => buildFeedbackEmail({...input, title:''}, {...context,language:'en'}), /short title/);
    assert.throws(() => buildFeedbackEmail(input, {...context,recipient:'bad',language:'en'}), /email address is invalid/);
  } finally { setLanguage(previous); }
});

test('localized feedback errors retain input validation and opt-out behavior', () => {
  for (const [language, emptyTitle, lengthError] of [['en',/short title/,/not been shortened/], ['sv',/kort rubrik/,/inte kortats ned/]]) {
    assert.throws(() => validateFeedbackDraft({...input,title:''},language), emptyTitle);
    assert.throws(() => normalizeFeedbackDraft({...input,description:'x'.repeat(1501)},language), lengthError);
    assert.throws(() => createFeedbackDraft('__proto__',language));
    const email = buildFeedbackEmail({...input,type:'idea',includeDiagnostics:false}, {...context,language});
    assert.ok(email.body.includes(input.description));
    assert.doesNotMatch(email.body, /Technical details|Teknisk information|iPhone|Safari|0\.7\.1|1\. Start/);
  }
});

