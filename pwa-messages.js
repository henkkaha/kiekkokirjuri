import { createTranslator } from './i18n.js?v=0.8.2';

export const PWA_MESSAGES = {
  'Valmistellaan offline-käyttöä…': { en: 'Preparing offline use…', sv: 'Förbereder användning offline…' },
  'Uusi versio on valmis': { en: 'A new version is ready', sv: 'En ny version är klar' },
  'Valmis myös ilman yhteyttä': { en: 'Ready to use offline', sv: 'Klar att använda offline' },
  'Offline-käyttö valmis': { en: 'Ready to use offline', sv: 'Klar att använda offline' },
  'Ladataan päivitystä taustalla…': { en: 'Downloading an update in the background…', sv: 'Hämtar en uppdatering i bakgrunden…' },
  'Offline-versio ei vielä valmistunut. Yritä uudelleen yhteydessä.': { en: 'The offline version is not ready yet. Try again when connected.', sv: 'Offlineversionen är inte klar ännu. Försök igen när du har uppkoppling.' },
  'Offline-käyttö tarvitsee HTTPS-yhteyden ja tuetun selaimen.': { en: 'Offline use requires HTTPS and a supported browser.', sv: 'Användning offline kräver HTTPS och en webbläsare som stöds.' },
  'Yhteys palautui': { en: 'Connection restored', sv: 'Anslutningen är tillbaka' },
  'Avaa sovellus ensin verkkoyhteydessä': { en: 'First open the app with an internet connection', sv: 'Öppna först appen med internetanslutning' },
  'Offline-käyttöä ei saatu valmiiksi. Päivityksen voi tarkistaa uudelleen.': { en: 'Offline setup could not be completed. You can check for an update again.', sv: 'Förberedelsen för offline kunde inte slutföras. Du kan söka efter en uppdatering igen.' },
  'Offline-versiota ei ole vielä ladattu tälle laitteelle.': { en: 'The offline version has not been downloaded to this device yet.', sv: 'Offlineversionen har ännu inte hämtats till den här enheten.' },
  'Päivitys tarvitsee verkkoyhteyden': { en: 'An internet connection is needed to update', sv: 'En uppdatering kräver internetanslutning' },
  'Offline-versio valmis. Päivityksen tarkistus ei onnistunut.': { en: 'The offline version is ready. Could not check for updates.', sv: 'Offlineversionen är klar. Det gick inte att söka efter uppdateringar.' },
  'Päivityksen tarkistus ei onnistunut. Yritä uudelleen yhteydessä.': { en: 'Could not check for updates. Try again when connected.', sv: 'Det gick inte att söka efter uppdateringar. Försök igen när du har uppkoppling.' },
};

export const pwaText = createTranslator(PWA_MESSAGES);
