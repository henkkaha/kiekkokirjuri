/** Local, offline translations. Language never changes the stored match model. */
export const LANGUAGE_STORAGE_KEY = 'kiekkokirjuri-language-v1';
export const LANGUAGES = Object.freeze([
  Object.freeze({ code: 'fi', name: 'Suomi' }),
  Object.freeze({ code: 'en', name: 'English' }),
  Object.freeze({ code: 'sv', name: 'Svenska' }),
]);
const supported = new Set(LANGUAGES.map(language => language.code));
const locales = { fi: 'fi-FI', en: 'en-GB', sv: 'sv-SE' };
let currentLanguage = 'fi';

export function getLanguage() { return currentLanguage; }
export function getLocale(language = currentLanguage) { return locales[language] || locales.fi; }

/** The saved explicit choice wins; otherwise use the first supported device language. */
export function resolveLanguage(saved, preferred = []) {
  if (supported.has(saved)) return saved;
  const list = Array.isArray(preferred) ? preferred : [preferred];
  for (const preference of list) {
    if (typeof preference !== 'string') continue;
    const language = preference.toLowerCase().split(/[-_]/)[0];
    if (supported.has(language)) return language;
  }
  return list.length ? 'en' : 'fi';
}

/** Pure in-memory change. The application separately reports persistence failures. */
export function setLanguage(language) {
  if (!supported.has(language)) throw new RangeError('Unsupported language');
  currentLanguage = language;
  return language;
}

/** Finnish source strings are the stable keys; interpolation is one pass only. */
export function createTranslator(catalog) {
  return (source, values = {}, language = currentLanguage) => {
    const key = String(source ?? '');
    const template = language === 'fi' ? key : catalog[key]?.[language] ?? key;
    return template.replace(/\{([A-Za-z][A-Za-z0-9_]*)\}/g, (placeholder, name) =>
      Object.hasOwn(values, name) ? String(values[name]) : placeholder);
  };
}
