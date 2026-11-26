import test from 'node:test';
import assert from 'node:assert/strict';
import {
  LANGUAGE_STORAGE_KEY, LANGUAGES, getLanguage, getLocale, setLanguage,
  resolveLanguage, createTranslator,
} from '../i18n.js?v=0.7.2';

test('language preference uses an explicit saved choice before device languages', () => {
  assert.equal(LANGUAGE_STORAGE_KEY, 'kiekkokirjuri-language-v1');
  assert.deepEqual(LANGUAGES.map(language => language.code), ['fi','en','sv']);
  assert.deepEqual(LANGUAGES.map(language => language.name), ['Suomi','English','Svenska']);
  for (const saved of ['fi','en','sv']) {
    assert.equal(resolveLanguage(saved, ['de-DE','sv-FI','en-US','fi-FI']), saved);
  }
  assert.equal(resolveLanguage('corrupt choice', ['sv-FI','en-US']), 'sv');
  assert.equal(resolveLanguage(null, ['de-DE','en-US','sv-FI']), 'en');
});

test('language detection supports regional device settings and deliberate fallbacks', () => {
  for (const value of ['sv','sv-FI','SV-se','sv_FI']) assert.equal(resolveLanguage(null,[value]),'sv');
  for (const value of ['en','en-US','EN-gb','en_US']) assert.equal(resolveLanguage(null,[value]),'en');
  for (const value of ['fi','fi-FI','FI-fi','fi_FI']) assert.equal(resolveLanguage(null,[value]),'fi');
  assert.equal(resolveLanguage(undefined,'sv-FI'),'sv');
  assert.equal(resolveLanguage(null,['de-DE','fr-FR']),'en');
  assert.equal(resolveLanguage(null,[null,42,'sv-FI']),'sv');
  assert.equal(resolveLanguage(null,[]),'fi');
  assert.equal(resolveLanguage(),'fi');
});

test('language changes select matching date locales and reject invalid choices without mutation', () => {
  const previous = getLanguage();
  try {
    for (const [language,locale] of [['fi','fi-FI'],['en','en-GB'],['sv','sv-SE']]) {
      assert.equal(setLanguage(language),language);
      assert.equal(getLanguage(),language);
      assert.equal(getLocale(),locale);
    }
    for (const invalid of ['',null,undefined,0,true,{},[],'EN','en-US','__proto__']) {
      assert.throws(() => setLanguage(invalid),RangeError);
      assert.equal(getLanguage(),'sv');
    }
    assert.equal(getLocale('fi'),'fi-FI');
    assert.equal(getLocale('en'),'en-GB');
    assert.equal(getLocale('sv'),'sv-SE');
    assert.equal(getLocale('invalid'),'fi-FI');
  } finally { setLanguage(previous); }
});

test('translation interpolation is one pass and never interprets user text as another placeholder', () => {
  const t = createTranslator({
    'Pelaaja {name}: {count} pistettä':{
      en:'Player {name}: {count} points',
      sv:'Spelare {name}: {count} poäng',
    },
  });
  const values = {name:'Åberg {count} <b>&</b>',count:0};
  assert.equal(t('Pelaaja {name}: {count} pistettä',values,'en'),'Player Åberg {count} <b>&</b>: 0 points');
  assert.equal(t('Pelaaja {name}: {count} pistettä',values,'sv'),'Spelare Åberg {count} <b>&</b>: 0 poäng');
  assert.equal(t('Pelaaja {name}: {count} pistettä',values,'fi'),'Pelaaja Åberg {count} <b>&</b>: 0 pistettä');
  const inherited = Object.create({name:'Do not use inherited values'});
  inherited.count=2;
  assert.equal(t('Pelaaja {name}: {count} pistettä',inherited,'en'),'Player {name}: 2 points');
});

test('unknown translation keys keep the Finnish source and available values', () => {
  const t = createTranslator({'Valmis':{en:'Ready',sv:'Klar'}});
  assert.equal(t('Tuntematon {value}',{value:'ä & ö'},'en'),'Tuntematon ä & ö');
  assert.equal(t('Tuntematon {missing}',{},'sv'),'Tuntematon {missing}');
  assert.equal(t('Valmis',{},'fi'),'Valmis');
  assert.equal(t(null,{},'en'),'');
  const previous = getLanguage();
  try {
    setLanguage('en');
    assert.equal(t('Valmis'),'Ready');
    assert.equal(t('Valmis',{},'sv'),'Klar');
    setLanguage('sv');
    assert.equal(t('Valmis'),'Klar');
  } finally { setLanguage(previous); }
});

const catalogs = [
  ['HELP_MESSAGES','../help-messages.js'],
  ['FEEDBACK_MESSAGES','../feedback.js'],
  ['REPORT_MESSAGES','../report-messages.js'],
  ['DOMAIN_MESSAGES','../domain-messages.js'],
  ['MODEL_MESSAGES','../model-messages.js'],
  ['PWA_MESSAGES','../pwa-messages.js'],
  ['UI_MESSAGES','../ui-messages.js'],
];
const placeholders = value => [...new Set([...value.matchAll(/\{([A-Za-z][A-Za-z0-9_]*)\}/g)].map(match => match[1]))].sort();
for (const [name,path] of catalogs) {
  test('bundled catalog ' + name + ' covers both languages without losing placeholders', async () => {
    const module = await import(path);
    const catalog = module[name];
    assert.ok(catalog && Object.keys(catalog).length,name + ' must not be empty');
    for (const [source,translations] of Object.entries(catalog)) {
      for (const language of ['en','sv']) {
        assert.equal(typeof translations[language],'string',name + ' missing ' + language + ': ' + source);
        assert.ok(translations[language].trim(),name + ' has empty ' + language + ': ' + source);
        assert.deepEqual(placeholders(translations[language]),placeholders(source),name + ' placeholder mismatch ' + language + ': ' + source);
      }
    }
  });
}

