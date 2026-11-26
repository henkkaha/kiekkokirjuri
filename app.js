import { VERSION, createGame, normalizeState, elapsed, elapsedPrecise, formatTime, score, teamStats,
  playerStats, periodStats, archiveAndNew, openArchive, validateEvent,
  normalizeNumber, nextPeriod, snapshot } from './model.js?v=0.7.0';
import { setupPWA, checkForUpdate, refreshPWALanguage } from './pwa.js?v=0.7.0';
import { textReport, createPoster } from './reports.js?v=0.7.0';
import { renderHelp } from './help.js?v=0.7.0';
import { FEEDBACK_STORAGE_KEY, FEEDBACK_KINDS, getFeedbackKinds, FEEDBACK_LIMITS, createFeedbackDraft,
  normalizeFeedbackDraft, validateFeedbackDraft, buildFeedbackEmail } from './feedback.js?v=0.7.0';

import { LANGUAGE_STORAGE_KEY, LANGUAGES, getLanguage, getLocale, resolveLanguage, setLanguage } from './i18n.js?v=0.7.0';
import { uiText as tr } from './ui-messages.js?v=0.7.0';
import { domainText } from './domain-messages.js?v=0.7.0';

let savedLanguage = null;
try { savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY); } catch { /* Language remains usable in memory. */ }
setLanguage(resolveLanguage(savedLanguage, navigator.languages?.length ? navigator.languages : [navigator.language]));
const STORAGE_KEY = 'ke-match-v1';
const FEEDBACK_RECIPIENT = 'henri.haho@gmail.com';
const $ = id => document.getElementById(id);
const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, char => ({
  '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'
}[char]));
const clone = value => JSON.parse(JSON.stringify(value));
const paths = {
  language:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 4 6 4 9s-1 6-4 9c-3-3-4-6-4-9s1-6 4-9Z"/>',
  arrow:'<path d="m9 5 7 7-7 7"/>',
  close:'<path d="m6 6 12 12M18 6 6 18"/>',
  play:'<path d="m9 5 11 7-11 7V5Z"/>',
  pause:'<path d="M8 5v14M16 5v14"/>',
  goal:'<path d="M4 18V8a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v10M4 18h16M8 5v9M12 5v9M16 5v9M4 9h16M4 13h16"/><ellipse cx="12" cy="18" rx="3" ry="1.6"/>',
  save:'<path d="M12 3 4 6v6c0 4.5 8 9 8 9s8-4.5 8-9V6l-8-3Z"/><path d="m8.5 11.8 2.4 2.4 4.6-4.7"/>',
  penalty:'<path d="M9 4v7M13 3v8M17 5v6M5 8v6c0 4 3 7 7 7s7-3 7-7v-4a2 2 0 0 0-4 0v3M5 11V8a2 2 0 0 1 4 0"/>',
  rink:'<rect x="3" y="5" width="18" height="14" rx="5"/><path d="M12 5v14M7 6v12M17 6v12"/><circle cx="12" cy="12" r="2.5"/>',
  people:'<circle cx="9" cy="8" r="3"/><path d="M3 20v-2a6 6 0 0 1 12 0v2M16 5a3 3 0 0 1 0 6M18 14a5 5 0 0 1 3 4v2"/>',
  chart:'<path d="M5 20V10M12 20V4M19 20v-7"/>',
  archive:'<rect x="3" y="4" width="18" height="4" rx="1"/><path d="M5 8v12h14V8M10 12h4"/>',
  settings:'<path d="M4 7h16M4 17h16"/><circle cx="9" cy="7" r="3" fill="currentColor" stroke="none"/><circle cx="15" cy="17" r="3" fill="currentColor" stroke="none"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  edit:'<path d="m14 5 5 5M4 20l5-1L20 8a2.1 2.1 0 0 0-5-5L4 15l-1 6Z"/>',
  info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7h.01"/>',
  check:'<path d="m5 12 4 4L19 6"/>',
  download:'<path d="M12 3v12m-4-4 4 4 4-4M4 16v5h16v-5"/>',
  upload:'<path d="M12 16V4m-4 4 4-4 4 4M4 16v5h16v-5"/>',
  image:'<rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8" cy="8" r="1"/><path d="m4 17 6-6 4 4 3-3 4 4"/>',
  text:'<path d="M6 3h9l4 4v14H6V3ZM15 3v5h4M9 12h7M9 16h7"/>',
  share:'<path d="M12 15V3m-4 4 4-4 4 4M7 10H4v11h16V10h-3"/>',
  mail:'<rect x="3" y="5" width="18" height="14" rx="3"/><path d="m4 7 8 6 8-6"/>',
  trash:'<path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7M14 10v7"/>',
  new:'<path d="M6 3h9l4 4v14H6V3ZM15 3v5h4M9 14h7M12.5 10.5v7"/>',
  wifi:'<path d="M3 9a14 14 0 0 1 18 0M6 12a9 9 0 0 1 12 0M9 15a4 4 0 0 1 6 0M12 19h.01"/>',
  refresh:'<path d="M20 7v5h-5M4 17v-5h5M5 8a8 8 0 0 1 14-3l1 7M4 12l1 7a8 8 0 0 0 14-3"/>',
  lock:'<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V6a4 4 0 0 1 8 0v4M12 14v3"/>'
};
const icon = (name, extra='') => `<svg ${extra} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">${paths[name] || paths.info}</svg>`;
const eventIcon = type => type === 'Maali' ? 'goal' : type === 'Torjunta' ? 'save' : type === 'Jäähy' ? 'penalty' : 'rink';
const eventClass = type => type === 'Maali' ? 'goal' : type === 'Torjunta' ? 'save' : type === 'Jäähy' ? 'penalty' : '';
const teamLabel = team => team === 'home' ? tr("Kotijoukkue") : tr("Vierasjoukkue");

// Keep the existing storage key and validate the entire backup before changing anything.
let state = createGame();
let unreadableRaw = null;
let startupError = '';
let lastStoredRaw = null;
let externalConflict = null;
try {
  const raw = localStorage.getItem(STORAGE_KEY);
  lastStoredRaw = raw;
  if (raw !== null) {
    try { state = normalizeState(JSON.parse(raw)); }
    catch (error) { unreadableRaw = raw; startupError = error.message; }
  }
} catch { startupError = tr("Selaimen tallennustila ei ole käytettävissä."); }
let view = ['ottelu','pelaajat','tilastot','ottelut'].includes(location.hash.slice(1)) ? location.hash.slice(1) : 'ottelu';
let rosterTeam = 'home';
let statsTeam = 'home';
let pending = null;
let editingPlayer = null;
let confirmAction = null;
let reportGame = null;
let posterBlob = null;
let posterURL = null;
let toastTimer = null;
let undoAction = null;
let updateAction = null;
let pwaStatus = null;
let viewAllEvents = false;
let wakeLock = null;
let sheetToken = 0;
let feedbackDraft = null;
let feedbackStorageIssue = '';
let feedbackStorageBlocked = false;
let feedbackPreview = null;

function hasDraft() {
  return $('sheet').open || Boolean($('player-number')?.value || $('player-name')?.value);
}
function recordConflict(raw) {
  externalConflict = {raw};
  $('storage-banner').innerHTML = `${tr("Ottelua muutettiin toisessa ikkunassa. Lataa uudemmat tiedot ennen seuraavaa kirjausta.")} <button type="button" class="button" data-action="sync-storage">${tr("Lataa uudemmat tiedot")}</button>`;
  $('storage-banner').hidden = false;
  if($('sheet').open) formError(tr("Ottelu muuttui toisessa ikkunassa. Tätä lomaketta ei tallennettu. Sulje lomake, jotta uudemmat tiedot ladataan."));
}
function adoptExternal(raw) {
  externalConflict=null;
  lastStoredRaw=raw;
  try {
    const next=raw===null?createGame():normalizeState(JSON.parse(raw));
    state=next;unreadableRaw=null;
    $('storage-banner').hidden=true;
    render();
    notify(tr("Uudemmat ottelutiedot ladattu."));
  }catch(error){unreadableRaw=raw;storageProblem(tr("Toisen ikkunan tallennusta ei voitu lukea. Alkuperäiset tiedot voi viedä valikon varmuuskopiolla."));}
}

function storageProblem(message) {
  $('storage-banner').textContent = message;
  $('storage-banner').hidden = false;
}
function persist(next) {
  if (unreadableRaw !== null) {
    storageProblem(tr("Aiemman tallennuksen lukeminen epäonnistui. Alkuperäiset tiedot ovat tallella. Vie ne valikon varmuuskopiolla ennen tietojen palautusta."));
    return false;
  }
  try {
    const currentRaw=localStorage.getItem(STORAGE_KEY);
    if(currentRaw!==lastStoredRaw || externalConflict) {recordConflict(currentRaw);return false;}
    const serialized=JSON.stringify(next);
    localStorage.setItem(STORAGE_KEY, serialized);
    lastStoredRaw=serialized;
    state = next;
    $('storage-banner').hidden = true;
    return true;
  } catch {
    storageProblem(tr("Tallennus ei onnistunut. Kirjausta ei lisätty. Tarkista laitteen vapaa tila ja vie otteluista varmuuskopio."));
    return false;
  }
}
function mutate(change) {
  const next = clone(state);
  change(next);
  if (!persist(next)) return false;
  render();
  return true;
}
function notify(message, undo=null) {
  clearTimeout(toastTimer);
  undoAction = undo;
  $('toast').innerHTML = `<span>${escapeHTML(message)}</span>${undo ? `<button type="button" data-action="undo">${tr("Kumoa")}</button>` : ''}`;
  $('toast').hidden = false;
  toastTimer = setTimeout(() => { $('toast').hidden = true; undoAction = null; }, undo ? 9000 : 4200);
}
function jerseyName(n, team, game=state) {
  if (n === '' || n === null || n === undefined) return '';
  const player = game.roster.find(p => p.n === String(n) && (p.team || 'home') === team);
  return `#${n}${player?.name ? ' ' + player.name : ''}`;
}
function dateLabel(game, long=false) {
  if (!game.date || Number.isNaN(new Date(game.date).getTime())) return tr("Ottelupäivä puuttuu");
  return new Intl.DateTimeFormat(getLocale(), { day:'numeric', month:long?'long':'numeric', year:'numeric' }).format(new Date(game.date));
}
function empty(iconName, title, description) {
  return `<div class="empty-state"><div class="empty-illustration">${icon(iconName)}</div><h3>${escapeHTML(title)}</h3><p>${escapeHTML(description)}</p></div>`;
}
function heading(title, description, action='') {
  return `<div class="page-heading"><div><h1>${title}</h1><p class="heading-label">${escapeHTML(description)}</p></div>${action ? `<div class="heading-actions">${action}</div>` : ''}</div>`;
}
const newButton = () => `<button class="button" data-action="new-game">${icon('new')}${tr("Uusi ottelu")}</button>`;

function render() {
  renderChrome();
  const views = { ottelu:renderLive, pelaajat:renderRoster, tilastot:renderStats, ottelut:renderArchives };
  $('main').innerHTML = `<div>${views[view]()}</div>`;
  $('navigation').innerHTML = [['ottelu','rink',tr("Ottelu")],['pelaajat','people',tr("Pelaajat")],['tilastot','chart',tr("Tilastot")],['ottelut','archive',tr("Ottelut")]].map(([id,i,label]) =>
    `<a class="nav-item${view===id?' active':''}" href="#${id}" ${view===id?'aria-current="page"':''}>${icon(i)}<span>${label}</span></a>`).join('');
}
function displayTeam(game, team) { return game[team] === 'Vastustaja' ? tr('Vastustaja') : game[team]; }
function renderChrome() {
  document.documentElement.lang = getLanguage();
  document.querySelectorAll('[data-i18n]').forEach(element => { element.textContent = tr(element.dataset.i18n); });
  document.querySelectorAll('[data-i18n-aria]').forEach(element => { element.setAttribute('aria-label', tr(element.dataset.i18nAria)); });
  document.querySelectorAll('[data-i18n-title]').forEach(element => { element.title = tr(element.dataset.i18nTitle); });
  $('language-code').textContent = getLanguage().toUpperCase();
  document.querySelector('meta[name="description"]').content = tr('Kiekkokirjuri – ottelun maalit, torjunnat ja jäähyt helposti, myös ilman verkkoyhteyttä.');
  if (!pwaStatus) $('connection-label').textContent = tr('Tallennus laitteelle');
  const updateVersion = $('update-banner').dataset.version;
  if (updateVersion) $('update-banner').innerHTML = `<span>${tr('Uusi versio {version} on valmis.',{version:escapeHTML(updateVersion)})}</span><button type="button" data-action="apply-update">${tr('Päivitä sovellus')}</button>`;
}
function showLanguage() {
  captureFeedbackDraft();
  openSheet('Kieli / Language / Språk', tr('Valitse sovelluksen kieli.'),
    `<div class="language-options" role="group" aria-label="${tr('Kieli')}">${LANGUAGES.map(language => `<button type="button" class="language-option${getLanguage()===language.code?' selected':''}" data-action="set-language" data-language="${language.code}" aria-pressed="${getLanguage()===language.code}"><span class="language-code" aria-hidden="true">${language.code.toUpperCase()}</span><span lang="${language.code}">${language.name}</span>${getLanguage()===language.code?icon('check'):icon('arrow')}</button>`).join('')}</div><p class="language-note">${tr('Kielivalinta tallentuu vain tähän laitteeseen. Kaikki kielet toimivat myös ilman nettiä.')}</p>`,
    `<button type="button" class="button quiet" data-action="close-sheet">${tr('Sulje')}</button>`);
}
function changeLanguage(language) {
  if (!LANGUAGES.some(item => item.code === language)) return;
  // Preserve an unsubmitted player row in the page behind the language sheet.
  const draftInputs = ['player-number','player-name'].map(id => [id,$(id)?.value]);
  setLanguage(language);
  let saved = true;
  try { localStorage.setItem(LANGUAGE_STORAGE_KEY,language); } catch { saved = false; }
  closeSheet();
  render();
  for (const [id,value] of draftInputs) if (value !== undefined && $(id)) $(id).value = value;
  refreshPWALanguage();
  notify(saved ? tr('Kieli vaihdettu.') : tr('Kieli vaihtui, mutta valintaa ei voitu tallentaa. Valitse kieli tarvittaessa uudelleen seuraavalla avauksella.'));
}
function teamCrest(team, game=state) {
  const isEspoo = /kiekko[\s-]?espoo|^k[ -]?espoo$/i.test(game[team]);
  return isEspoo ? '<div class="team-crest"><img src="./assets/club-logo.svg" alt="" width="55" height="55"></div>' :
    `<div class="team-crest opponent-crest" aria-hidden="true">${escapeHTML(displayTeam(game,team).replace(/[^\p{L}\p{N}]/gu,'').slice(0,2).toUpperCase() || 'V')}</div>`;
}
function renderLive() {
  const tally = score(state), stats = teamStats(state), played = elapsed(state);
  const running = state.start !== null;
  const ended = played >= state.periodLength;
  const status = state.finished ? tr("Ottelu päättynyt") : running ? tr("Peli käynnissä") : ended ? tr("Erä päättynyt") : played || state.events.length ? tr("Kello pysäytetty") : tr("Valmiina peliin");
  const clockAction = state.finished ? tr("Jatka ottelua") : ended ? tr("Seuraava erä") : running ? tr("Pysäytä") : played ? tr("Jatka erää") : tr("Aloita erä");
  const events = state.events.slice().sort((a,b) => b.period-a.period || b.time-a.time || state.events.indexOf(b)-state.events.indexOf(a));
  const visible = viewAllEvents ? events : events.slice(0,7);
  return `${heading(tr("Ottelu"),dateLabel(state,true),newButton())}
    <div class="live-layout"><div class="live-left">
      <section class="scoreboard" aria-label="${tr("Tulostaulu")}">
        <div class="board-top"><span class="match-state ${running?'running':''}" id="match-state"><span class="status-dot"></span>${status}</span><button class="icon-button board-settings" data-action="match-settings" aria-label="${tr("Ottelun ja kellon asetukset")}">${icon('settings')}</button></div>
        <div class="scoreline"><div class="team-block">${teamCrest('home')}<div class="team-name">${escapeHTML(displayTeam(state,'home'))}</div><div class="team-role">${tr("Koti")}</div></div>
          <div class="score-digits" aria-label="${tr('Tulos {home}–{away}',{home:tally.home,away:tally.away})}"><span class="score-number" data-score="home">${tally.home}</span><span class="score-divider">:</span><span class="score-number" data-score="away">${tally.away}</span></div>
          <div class="team-block">${teamCrest('away')}<div class="team-name">${escapeHTML(displayTeam(state,'away'))}</div><div class="team-role">${tr("Vieras")}</div></div></div>
        <div class="clock-strip"><div class="clock-info"><div class="period-tag"><b>${tr('{period}. erä',{period:state.period})}</b>${formatTime(state.periodLength)}</div><div class="clock-value" id="clock" aria-label="${tr("Aikaa jäljellä")}">${formatTime(state.periodLength-played)}</div></div>
          <button class="clock-button ${running?'is-running':''}" data-action="${state.finished?'reopen-game':ended?'next-period':'toggle-clock'}" id="clock-toggle">${icon(running?'pause':'play')}${clockAction}</button></div>
        <div class="board-stats"><span class="board-stat"><abbr title="${tr("Laukaukset maalia kohti")}">${tr("Laukaukset maalia kohti")}</abbr><strong data-stat="shots">${stats.home.shots} – ${stats.away.shots}</strong></span><span class="board-stat">${tr("Torjunnat")} <strong data-stat="saves">${stats.home.saves} – ${stats.away.saves}</strong></span></div>
      </section>
      <section class="action-section" aria-labelledby="actions-title"><div class="section-heading"><h2 id="actions-title">${tr("Kirjaa tapahtuma")}</h2><span class="eyebrow">${tr("Yksi tilanne, yksi kirjaus")}</span></div>
        <div class="action-grid">${[['Maali','goal'],['Torjunta','save'],['Jäähy','penalty']].map(([name,i])=>`<button class="event-action ${i}" data-action="event" data-type="${name}">${icon(i)}<span class="action-label">${domainText(name)}${icon('arrow')}</span></button>`).join('')}</div>
        <p class="action-hint">${icon('info')}${tr("Maali ja torjunta päivittävät laukaukset automaattisesti.")}</p>
      </section>
      <div class="live-note">${icon('people')}<div><b>${tr("Numerolla nopeasti, nimellä myöhemminkin.")}</b>${tr("Lisää kokoonpano Pelaajat-välilehdellä. Voit kirjata tapahtuman myös ilman pelaajatietoja.")}</div></div>
    </div><div class="live-right">
      <section class="panel event-panel"><div class="panel-heading"><h2>${tr("Tapahtumat")}</h2><span class="count-badge" aria-label="${tr('{count} tapahtumaa',{count:state.events.length})}">${state.events.length}</span></div>
        ${visible.length ? `<ol class="event-list">${visible.map(e=>eventRow(e)).join('')}</ol>` : empty('rink',tr("Tästä se alkaa."),tr("Aloita kello ja kirjaa kentän tapahtumat. Ottelun tarina rakentuu tähän."))}
        ${events.length>7 ? `<div class="event-panel-footer"><button class="text-button" data-action="all-events">${viewAllEvents?tr("Näytä viimeisimmät"):tr('Näytä kaikki {count} tapahtumaa',{count:events.length})}${icon('arrow')}</button></div>` : ''}
      </section>
      <div class="view-footer"><span>${icon('lock')}${tr("Tallennetaan tälle laitteelle")}</span><span>${tr("Tapahtumissa kulunut peliaika")}</span></div>
    </div></div>`;
}
function eventRow(event, game=state, editable=true) {
  const player = jerseyName(event.n,event.team,game);
  const title = event.type === 'Laukaus' ? tr('Laukausyritys') : domainText(event.type);
  const details = event.type === 'Jäähy' ? [domainText(event.penaltyLabel) || `${event.minutes} min`,domainText(event.reason)].filter(Boolean).join(' · ') :
    event.assists?.length ? tr('Syötöt: {players}',{players:event.assists.map(n=>jerseyName(n,event.team,game)).join(', ')}) : '';
  return `<li class="event-row"><div class="event-time">${formatTime(event.time)}<small>${tr('{period}. ERÄ',{period:event.period})}</small></div><div class="event-symbol ${eventClass(event.type)}">${icon(eventIcon(event.type))}</div><div class="event-body"><div class="event-title">${escapeHTML(title)}${player?` <span>${escapeHTML(player)}</span>`:''}</div><div class="event-subtitle">${escapeHTML(displayTeam(game,event.team))}</div>${details?`<div class="event-meta">${escapeHTML(details)}</div>`:''}${event.detail?`<div class="event-meta">${escapeHTML(event.detail)}</div>`:''}${event.type==='Laukaus'?`<div class="event-meta">${tr("Vanha kirjaus · ei sisälly laukauksiin maalia kohti")}</div>`:''}</div>${editable?`<button class="event-edit" data-action="edit-event" data-id="${escapeHTML(event.id)}" aria-label="${escapeHTML(tr('Muokkaa: {event}',{event:title}))}, ${formatTime(event.time)}, ${escapeHTML(displayTeam(game,event.team))}">${icon('edit')}</button>`:''}</li>`;
}
function teamTabs(selected, action) {
  return `<div class="tabs" role="group" aria-label="${tr("Joukkue")}">${['home','away'].map(t=>`<button class="tab-button ${selected===t?'active':''}" data-action="${action}" data-team="${t}" aria-pressed="${selected===t}">${escapeHTML(displayTeam(state,t))}</button>`).join('')}</div>`;
}
function renderRoster() {
  const roster = state.roster.filter(p=>p.team===rosterTeam).sort((a,b)=>Number(a.n)-Number(b.n));
  return `${heading(tr("Pelaajat"),tr("Tämän ottelun kokoonpano"),`<span class="count-badge">${state.roster.length}</span>`)}<div class="two-column"><section class="panel content-panel">${teamTabs(rosterTeam,'roster-team')}
    <form id="add-player-form" class="inline-form"><label class="field" for="player-number">${tr("Numero")}<input id="player-number" name="n" inputmode="numeric" pattern="[0-9]{1,2}" maxlength="2" placeholder="00" required autocomplete="off"></label><label class="field" for="player-name">${tr("Sukunimi")}<input id="player-name" name="name" placeholder="${tr("Valinnainen")}" maxlength="60" autocomplete="off"></label><button class="button primary" type="submit">${tr("Lisää")}</button></form>
    <p class="roster-info">${tr("Pelkkä numero riittää. Nimen voi lisätä nyt tai myöhemmin pelaajaa napauttamalla.")}</p><div id="roster-error" class="form-error" role="alert" hidden></div>
    ${roster.length?`<div class="roster-grid">${roster.map(p=>`<button class="roster-player" data-action="edit-player" data-number="${p.n}" data-team="${rosterTeam}" aria-label="${escapeHTML(tr('Muokkaa pelaajaa {player}',{player:jerseyName(p.n,rosterTeam)}))}"><span class="roster-number">${p.n}</span><span class="roster-name">${escapeHTML(p.name||tr("Lisää nimi"))}<small>${p.name?tr("Pelaaja"):tr("Nimi puuttuu")}</small></span></button>`).join('')}</div>`:empty('people',tr("Ketkä pelaavat tänään?"),tr("Lisää joukkueen pelaajanumerot. Saat niistä nopeat valintapainikkeet tapahtumiin."))}
    </section><section class="panel content-panel"><div class="section-heading"><h2>${tr("Valmiina ennen aloitusta")}</h2></div><div class="info-list"><div class="info-item">${icon('people')}<div><strong>${tr("Molempien joukkueiden pelaajat")}</strong>${tr("Vaihda joukkuetta yläreunan valinnasta. Sama numero voi olla kummassakin joukkueessa.")}</div></div><div class="info-item">${icon('goal')}<div><strong>${tr("Voit täydentää myös pelin aikana")}</strong>${tr("Tapahtumaan kirjoitettu uusi numero lisätään tämän ottelun kokoonpanoon automaattisesti.")}</div></div><div class="info-item">${icon('new')}<div><strong>${tr("Uusi peli, uusi kokoonpano")}</strong>${tr("Valitse uudelle ottelulle EKS-kokoonpano tai aloita tyhjillä pelaajalistoilla. Aiempien ottelujen tiedot säilyvät arkistossa.")}</div></div></div></section></div>`;
}
function comparison(label, a, b) {
  const total = a+b || 2;
  return `<div class="comparison-row"><strong class="comparison-number">${a}</strong><div><div class="comparison-label">${label}</div><div class="comparison-bars" aria-hidden="true"><span style="width:${(a+b?a:1)/total*100}%"></span><span style="width:${(a+b?b:1)/total*100}%"></span></div></div><strong class="comparison-number">${b}</strong></div>`;
}
function renderStats() {
  const stats = teamStats(state), players = playerStats(state,statsTeam), periods = periodStats(state);
  return `${heading(tr("Tilastot"),tr("Jokainen kirjaus näkyy tässä."))}<div class="two-column"><div><section class="panel stats-overview"><div class="comparison-head"><span>${escapeHTML(displayTeam(state,'home'))}</span><span>${escapeHTML(displayTeam(state,'away'))}</span></div>
    ${comparison(tr("Maalit"),stats.home.goals,stats.away.goals)}${comparison(tr("Laukaukset maalia kohti"),stats.home.shots,stats.away.shots)}${comparison(tr("Torjunnat"),stats.home.saves,stats.away.saves)}${comparison(tr("Rangaistusminuutit"),stats.home.penaltyMinutes,stats.away.penaltyMinutes)}
    <table class="period-table"><caption class="sr-only">${tr("Maalit erissä")}</caption><thead><tr><th>${tr("Erä")}</th><th>${escapeHTML(displayTeam(state,'home'))}</th><th>${escapeHTML(displayTeam(state,'away'))}</th></tr></thead><tbody>${periods.map(p=>`<tr><td>${tr('{period}. erä',{period:p.period})}</td><td>${p.home}</td><td>${p.away}</td></tr>`).join('')}</tbody></table>
    <p class="table-legend">${tr("Laukaukset maalia kohti = omat maalit + vastustajan torjunnat. Ohi menneitä tai blokattuja yrityksiä ei lasketa mukaan.")}</p></section>
    <section class="export-card"><h3>${tr("Ottelun tarina talteen.")}</h3><p>${tr("Jaa siisti ottelukuva tai vie koko tapahtumalista tekstinä.")}</p><div class="export-actions"><button class="button" data-action="poster">${icon('image')}${tr("Ottelukuva")}</button><button class="button" data-action="report">${icon('text')}${tr("Tekstikooste")}</button></div></section></div>
    <section class="panel content-panel"><div class="section-heading"><h2>${tr("Pelaajatilastot")}</h2></div>${teamTabs(statsTeam,'stats-team')}${players.length?`<div class="table-scroll"><table class="player-table"><caption class="sr-only">${escapeHTML(tr('{team}: pelaajatilastot',{team:displayTeam(state,statsTeam)}))}</caption><thead><tr><th>${tr("Pelaaja")}</th><th><abbr title="${tr("Maalit")}">${tr("M")}</abbr></th><th><abbr title="${tr("Syötöt")}">${tr("S")}</abbr></th><th><abbr title="${tr("Pisteet")}">${tr("P")}</abbr></th><th><abbr title="${tr("Torjunnat")}">${tr("T")}</abbr></th><th><abbr title="${tr("Jäähyminuutit")}">${tr("JM")}</abbr></th></tr></thead><tbody>${players.map(p=>`<tr><td><span class="table-player"><b>${p.n}</b>${escapeHTML(p.name||'—')}</span></td><td>${p.goals}</td><td>${p.assists}</td><td>${p.points}</td><td>${p.saves}</td><td>${p.penaltyMinutes}</td></tr>`).join('')}</tbody></table></div><p class="table-legend">${tr("M = maalit · S = syötöt · P = pisteet")}<br>${tr("T = torjunnat · JM = jäähyminuutit")}</p>`:empty('chart',tr("Numerot kertovat pelistä."),tr("Lisää pelaajat kokoonpanoon tai merkitse numero tapahtuman yhteydessä. Tilastot kertyvät automaattisesti."))}</section></div>`;
}
function archiveCard(game,current=false) {
  const goals = score(game);
  return `<button class="archive-card${current?' current':''}" data-action="${current?'go-live':'archive-detail'}" ${current?'':`data-id="${escapeHTML(game.id)}"`}><div class="archive-symbol">${icon(current?'rink':'archive')}</div><div class="archive-main"><h3>${escapeHTML(displayTeam(game,'home'))} – ${escapeHTML(displayTeam(game,'away'))}</h3><p>${current?tr('Nykyinen ottelu')+' · ':''}${dateLabel(game)} · ${tr('{count} tapahtumaa',{count:game.events.length})}</p></div><strong class="archive-score">${goals.home}–${goals.away}</strong>${icon('arrow')}</button>`;
}
function renderArchives() {
  return `${heading(tr("Ottelut"),tr("Pelit vaihtuvat. Muistot säilyvät."),newButton())}<div class="two-column"><section><div class="section-heading"><h2>${tr("Nykyinen ottelu")}</h2></div>${archiveCard(state,true)}<div class="section-heading" style="margin-top:27px"><h2>${tr("Otteluarkisto")}</h2><span class="count-badge">${state.archive.length}</span></div><div class="archive-list">${state.archive.length?state.archive.slice().reverse().map(g=>archiveCard(g)).join(''):`<div class="panel">${empty('archive',tr("Ensimmäinen peli odottaa vielä."),tr("Kun aloitat uuden ottelun, nykyinen siirtyy tänne automaattisesti."))}</div>`}</div></section>
    <section class="panel content-panel"><div class="section-heading"><h2>${tr("Ota pelit talteen")}</h2>${icon('lock')}</div><p class="roster-info">${tr("Ottelut tallentuvat tämän laitteen selaimeen. Varmuuskopiolla voit siirtää kaikki ottelut toiseen laitteeseen tai palauttaa ne myöhemmin.")}</p><div class="stack"><button class="button primary wide" data-action="backup">${icon('download')}${tr("Vie kaikkien ottelujen varmuuskopio")}</button><button class="button wide" data-action="restore">${icon('upload')}${tr("Palauta varmuuskopio")}</button><p class="field-note">${tr("Selaimen sivustotietojen poistaminen poistaa myös paikalliset ottelut. Tallennetut varmuuskopiot säilyvät erillisinä tiedostoina.")}</p></div></section></div>`;
}

function openSheet(title, subtitle, body, footer='', formId='', preservePosition=false) {
  const scrollTop=preservePosition?$('sheet').scrollTop:0;
  const active=preservePosition?document.activeElement:null;
  const focusSelector=active?.id?'#'+CSS.escape(active.id):active?.dataset.action?`[data-action="${CSS.escape(active.dataset.action)}"]${active.dataset.number!==undefined?`[data-number="${CSS.escape(active.dataset.number)}"]`:''}`:null;
  const token=++sheetToken;
  $('sheet-content').innerHTML = `${formId?`<form id="${formId}">`:''}<div class="sheet-header"><div><h2 id="sheet-title">${escapeHTML(title)}</h2>${subtitle?`<p>${escapeHTML(subtitle)}</p>`:''}</div><button class="icon-button" type="button" data-action="close-sheet" aria-label="${tr("Sulje")}">${icon('close')}</button></div><div class="sheet-body">${body}<div id="sheet-error" class="form-error" role="alert" hidden></div></div>${footer?`<div class="sheet-footer">${footer}</div>`:''}${formId?'</form>':''}`;
  if (!$('sheet').open) $('sheet').showModal();
  if(focusSelector) $('sheet').querySelector(focusSelector)?.focus({preventScroll:true});
  $('sheet').scrollTop = scrollTop;
  return token;
}
function closeSheet() {
  captureFeedbackDraft();
  sheetToken++;
  $('sheet').close();
  pending = null;
  editingPlayer = null;
  confirmAction = null;
  if (posterURL) { URL.revokeObjectURL(posterURL); posterURL=null; }
  posterBlob = null;
  if(externalConflict)adoptExternal(externalConflict.raw);
}
function formError(message, id='sheet-error') {
  const field = $(id);
  if (field) { field.textContent=message; field.hidden=false; field.scrollIntoView({block:'nearest'}); }
  else notify(message);
}
function askConfirm(title, body, action, label=tr("Vahvista"), danger=false) {
  pending = null;
  confirmAction = action;
  openSheet(title,'',`<p class="small muted" style="line-height:1.9">${escapeHTML(body)}</p>`,
    `<button type="button" class="button quiet" data-action="close-sheet">${tr("Peruuta")}</button><button type="button" class="button ${danger?'danger':'primary'}" data-action="confirm">${escapeHTML(label)}</button>`);
}

const penaltyReasons = ['Kampitus','Koukkaaminen','Kiinnipitäminen','Estäminen','Huitominen','Korkea maila','Poikittainen maila','Väkivaltaisuus','Liian monta pelaajaa jäällä','Pelin viivyttäminen','Epäurheilijamainen käytös','Laitataklaus','Ryntäys','Selästä taklaaminen','Leikkaaminen','Kyynärpäätaklaus','Tappeleminen','Pääpusku','Päähän tai niskaan kohdistuva taklaus','Potkaiseminen','Polvitaklaus','Jalkapyyhkäisy','Varusteiden heittäminen','Mailan päällä tökkääminen','Keihästäminen','Sukeltaminen / teeskentely','Sääntöjenvastainen varuste','Kiekon käsittely kädellä','Sääntöjenvastainen vaihto','Maalivahdin estäminen','Penkiltä poistuminen','Vaarallinen teko','Pelistä kieltäytyminen','Sopimaton käytös tuomaristoa kohtaan','Tuomariston fyysisen koskemattomuuden loukkaaminen','Peliasu','Sääntöjenvastainen maila','Aloitusrike','Muu / sarjakohtainen rike'];
const penaltyTypes = [
  {id:'minor',minutes:2,label:'2 min · pieni rangaistus'},
  {id:'bench',minutes:2,label:'2 min · joukkuerangaistus'},
  {id:'double-minor',minutes:4,label:'2 + 2 min · kaksinkertainen pieni'},
  {id:'major',minutes:5,label:'5 min · iso rangaistus'},
  {id:'misconduct',minutes:10,label:'10 min · käytösrangaistus'},
  {id:'game',minutes:20,label:'Pelirangaistus · tilastoon 20 min'},
  {id:'major-game',minutes:25,label:'5 min + pelirangaistus · 25 min'},
  {id:'penalty-shot',minutes:0,label:'Rangaistuslaukaus · 0 min'},
  {id:'junior',minutes:1,label:'1 min · juniorisääntö'},
  {id:'series',minutes:3,label:'3 min · sarjakohtainen'},
  {id:'custom',minutes:2,label:'Muu rangaistus / oma minuuttimäärä'}
];
function beginEvent(type, existing=null) {
  pending = existing ? clone(existing) : {type,team:'',time:elapsed(state),period:state.period,n:'',assists:[],minutes:2,reason:'',penaltyType:'minor',penaltyLabel:penaltyTypes[0].label,detail:''};
  pending.assists ||= [];
  pending._editing = Boolean(existing);
  if (existing?.type==='Jäähy' && !existing.penaltyType) pending.penaltyType='custom';
  drawEvent();
}
function drawEvent(preservePosition=false) {
  if (!pending) return;
  const p = pending;
  const subtitle = tr('{period}. erä · kellossa {time}',{period:p.period,time:formatTime(Math.max(0,state.periodLength-p.time))})+(p._editing?' · '+tr('Muokkaus'):'');
  if (!p.team) {
    const question = p.type==='Torjunta'?tr("Kumpi joukkue torjui?"):p.type==='Maali'?tr("Kumpi joukkue teki maalin?"):tr("Kummalle joukkueelle jäähy?");
    openSheet(domainText(p.type),subtitle,`<div class="sheet-step"><span>${tr("01 Joukkue")}</span>${icon('arrow')}<span>${tr("02 Pelaaja ja tiedot")}</span></div><h3 style="margin-bottom:16px">${question}</h3><div class="choice-grid">${['home','away'].map(t=>`<button type="button" class="choice" data-action="event-team" data-team="${t}">${escapeHTML(displayTeam(state,t))}<small>${teamLabel(t)}</small></button>`).join('')}</div>${p.type==='Torjunta'?`<p class="assist-help">${tr("Valitse torjuneen maalivahdin joukkue. Vastustajalle lisätään samalla laukaus maalia kohti.")}</p>`:''}`);
    return;
  }
  const roster = state.roster.filter(player=>player.team===p.team).sort((a,b)=>Number(a.n)-Number(b.n));
  const unknownSelected = p.n!=='' && !roster.some(player=>player.n===p.n);
  const numbers = [...roster,...(unknownSelected?[{n:p.n,name:''}]:[])];
  const role = p.type==='Maali'?tr("Maalintekijä"):p.type==='Torjunta'?tr("Maalivahti"):tr("Pelaaja");
  let body = `<div class="sheet-team-line"><div><strong>${escapeHTML(displayTeam(state,p.team))}</strong><br><span>${teamLabel(p.team)}</span></div><button class="text-button" type="button" data-action="change-event-team">${tr("Vaihda joukkuetta")}</button></div><div class="sheet-section"><div class="field-heading">${role}<span>${tr("Valinnainen")}</span></div>
    ${numbers.length?`<div class="number-grid">${numbers.map(player=>`<button type="button" class="number-chip ${p.n===player.n?'selected':''}" data-action="pick-player" data-number="${player.n}" aria-pressed="${p.n===player.n}" aria-label="${escapeHTML(jerseyName(player.n,p.team)||'#'+player.n)}"><b>${player.n}</b><small>${escapeHTML(player.name||tr("Numero"))}</small></button>`).join('')}</div>`:''}
    <div class="manual-entry"><label class="field" for="manual-number"><span class="sr-only">${tr('{role}, numero',{role})}</span><input id="manual-number" inputmode="numeric" pattern="[0-9]{1,2}" maxlength="2" placeholder="${numbers.length?tr("Muu numero"):tr("Pelaajan numero, 0–99")}" value="${escapeHTML(p._manualNumber||'')}" autocomplete="off"></label><button type="button" class="button" data-action="manual-player">${tr("Valitse")}</button></div>
    ${p.n!==''?`<p class="selected-summary">${icon('check')}${escapeHTML(jerseyName(p.n,p.team)||'#'+p.n)}<button type="button" data-action="clear-player" aria-label="${tr("Poista pelaajavalinta")}">${icon('close')}</button></p>`:`<p class="assist-help">${tr("Numeron voi täydentää myöhemmin tapahtumaa muokkaamalla.")}</p>`}</div>`;
  if(p.type==='Maali') {
    const assistRoster = [...roster,...p.assists.filter(n=>!roster.some(player=>player.n===n)).map(n=>({n,name:''}))].filter(player=>player.n!==p.n);
    body += `<div class="sheet-section"><div class="field-heading">${tr("Syöttäjät")}<span>${p.assists.length} / 2</span></div>${assistRoster.length?`<div class="number-grid">${assistRoster.map(player=>`<button class="number-chip assist ${p.assists.includes(player.n)?'selected':''}" type="button" data-action="pick-assist" data-number="${player.n}" aria-pressed="${p.assists.includes(player.n)}" aria-label="${escapeHTML(tr('Syöttäjä {player}',{player:jerseyName(player.n,p.team)||'#'+player.n}))}"><b>${player.n}</b><small>${escapeHTML(player.name||tr("Numero"))}</small></button>`).join('')}</div>`:''}<div class="manual-entry"><label class="field" for="manual-assist"><span class="sr-only">${tr("Syöttäjän numero")}</span><input id="manual-assist" inputmode="numeric" pattern="[0-9]{1,2}" maxlength="2" placeholder="${tr("Syöttäjän numero")}" value="${escapeHTML(p._manualAssist||'')}" autocomplete="off"></label><button type="button" class="button" data-action="manual-assist">${tr("Valitse")}</button></div><p class="assist-help">${p.assists.length?escapeHTML(tr('Valittu: {players}',{players:p.assists.map(n=>jerseyName(n,p.team)||'#'+n).join(', ')})):tr("Jätä tyhjäksi, jos maali syntyi ilman syöttöä.")}</p></div>`;
  }
  if(p.type==='Jäähy') {
    const reasons = p.reason && !penaltyReasons.includes(p.reason) ? [p.reason,...penaltyReasons] : penaltyReasons;
    body += `<div class="sheet-section stack"><label class="field" for="penalty-reason">${tr("Jäähyn syy")}<select id="penalty-reason" data-pending="reason"><option value="">${tr("Valitse rike")}</option>${reasons.map(reason=>`<option value="${escapeHTML(reason)}" ${reason===p.reason?'selected':''}>${escapeHTML(domainText(reason))}</option>`).join('')}</select></label><label class="field" for="penalty-type">${tr("Rangaistus")}<select id="penalty-type" data-pending="penaltyType">${penaltyTypes.map(t=>`<option value="${t.id}" ${p.penaltyType===t.id?'selected':''}>${escapeHTML(domainText(t.label))}</option>`).join('')}</select></label>${p.penaltyType==='custom'?`<div class="form-grid"><label class="field" for="penalty-minutes">${tr("Minuutit")}<input id="penalty-minutes" type="number" inputmode="numeric" min="0" max="1000" value="${Number(p.minutes)||0}" data-pending="minutes"></label><label class="field" for="penalty-label">${tr("Rangaistuksen nimi")}<input id="penalty-label" maxlength="100" value="${escapeHTML(p.penaltyLabel||'')}" data-pending="penaltyLabel"></label></div>`:''}<label class="field" for="penalty-detail">${tr("Tarkennus")} <small>${tr("Valinnainen")}</small><input id="penalty-detail" maxlength="240" placeholder="${tr("Esim. jäähyn kärsivä pelaaja")}" value="${escapeHTML(p.detail||'')}" data-pending="detail"></label></div>`;
  }
  body += `<details class="sheet-section" style="margin-top:22px"><summary class="small muted" style="cursor:pointer;padding:8px 0">${tr("Korjaa tapahtuma-aikaa")}</summary><div class="form-grid" style="margin-top:12px"><label class="field" for="event-period">${tr("Erä")}<input id="event-period" type="number" inputmode="numeric" min="1" max="1000" value="${p.period}" data-pending="period"></label><label class="field" for="event-time">${tr("Kulunut eräaika")}<input id="event-time" inputmode="numeric" value="${formatTime(p.time)}" placeholder="mm:ss" data-pending="time"></label></div><p class="event-time-note">${tr("Aikaleima otetaan tapahtumapainikkeen painalluksesta. Tässä näkyy kulunut eräaika; tulostaulun kello laskee alaspäin.")}</p></details>`;
  openSheet(p._editing?tr('Muokkaa: {event}',{event:domainText(p.type)}):domainText(p.type),subtitle,body,`${p._editing?`<button type="button" class="button danger" data-action="delete-event" data-id="${escapeHTML(p.id)}" aria-label="${tr("Poista tapahtuma")}">${icon('trash')}</button>`:`<button type="button" class="button quiet" data-action="close-sheet">${tr("Peruuta")}</button>`}<button type="submit" class="button primary" id="save-event">${icon('check')}${p._editing?tr("Tallenna muutokset"):tr('Tallenna {event}',{event:domainText(p.type).toLocaleLowerCase(getLocale())})}</button>`,'event-form',preservePosition);
}

function pickPlayer(number) {
  const n = normalizeNumber(number);
  if(n==='') throw new Error(tr("Anna pelaajan numero väliltä 0–99."));
  pending.n = pending.n===n?'':n;
  pending._manualNumber='';
  pending.assists = pending.assists.filter(a=>a!==pending.n);
  drawEvent(true);
}
function pickAssist(number) {
  const n = normalizeNumber(number);
  if(n==='') throw new Error(tr("Anna syöttäjän numero väliltä 0–99."));
  if(n===pending.n) throw new Error(tr("Maalintekijä ei voi olla myös syöttäjä."));
  if(pending.assists.includes(n)) pending.assists=pending.assists.filter(a=>a!==n);
  else if(pending.assists.length<2) pending.assists.push(n);
  else throw new Error(tr("Maalille voi valita enintään kaksi syöttäjää."));
  pending._manualAssist='';
  drawEvent(true);
}
function parseTime(value) {
  if(!/^\d{1,4}:[0-5]\d$/.test(String(value).trim())) throw new Error(tr("Anna aika muodossa mm:ss, esimerkiksi 12:30."));
  const [minutes,seconds] = value.trim().split(':').map(Number);
  return minutes*60+seconds;
}
function submitEvent() {
  const input = clone(pending);
  if($('manual-number')?.value) input.n=normalizeNumber($('manual-number').value);
  if($('manual-assist')?.value) {
    const assist = normalizeNumber($('manual-assist').value);
    if(!input.assists.includes(assist)) input.assists.push(assist);
  }
  input.time = parseTime($('event-time').value);
  input.period = Number($('event-period').value);
  if($('penalty-minutes')) input.minutes=Number($('penalty-minutes').value);
  for(const key of Object.keys(input))if(key.startsWith('_'))delete input[key];
  const event = validateEvent(input,state);
  const next = clone(state);
  const index = next.events.findIndex(e=>e.id===event.id);
  const previous = index>=0?clone(next.events[index]):null;
  if(index>=0) next.events[index]=event; else next.events.push(event);
  for(const n of [event.n,...event.assists]) {
    if(n!=='' && !next.roster.some(p=>p.n===n&&p.team===event.team)) next.roster.push({n,name:'',team:event.team});
  }
  const gameId = state.id;
  if(!persist(next)) { if(!externalConflict)formError(tr("Kirjausta ei voitu tallentaa. Tarkista ilmoitus sivun yläreunassa.")); return; }
  closeSheet();
  render();
  notify(tr(previous?'Kirjaus päivitetty · {team}':'Kirjaus tallennettu · {team}',{team:displayTeam(state,event.team)}),()=>{
    if(state.id!==gameId) return notify(tr("Ottelu vaihtui. Muokkaa kirjausta otteluarkiston kautta."));
    mutate(s=>{const i=s.events.findIndex(e=>e.id===event.id);if(i>=0){if(previous)s.events[i]=previous;else s.events.splice(i,1);}});
  });
}

const ROSTER_CACHE='kiekkokirjuri-rosters-v1';
function validateRoster(raw){if(raw.schema!==1||!Array.isArray(raw.teams)||typeof raw.event!=="string"||typeof raw.updated!=="string"||typeof raw.opponent!=="string"||!["home","away"].includes(raw.side))throw Error(tr("Virheellinen kokoonpanotiedosto"));let ids=new Set();for(const t of raw.teams){if(!/^[a-z0-9-]+$/.test(t.id)||ids.has(t.id)||typeof t.name!=="string"||!Array.isArray(t.players))throw Error(tr("Virheellinen ryhmä"));ids.add(t.id);let ns=new Set();for(const p of t.players){if(!Array.isArray(p)||p.length!==2||!Number.isInteger(p[0])||p[0]<0||p[0]>99||ns.has(p[0])||typeof p[1]!=="string"||!p[1].trim()||p[1].length>60)throw Error(tr("Virheellinen tai toistuva pelaajanumero"));ns.add(p[0])}}return raw}
let rosterPresets=validateRoster({"schema":1,"event":"GrIFK – EKS","updated":"2026-11-26","opponent":"GrIFK","side":"away","teams":[{"id":"blue","name":"Blue","players":[[58,"Honkimaa"],[15,"Haho"],[26,"Jantunen"],[14,"Niemelä"],[19,"Pekkarinen"],[64,"Laurila"]]},{"id":"white","name":"White","players":[[61,"Koponen"],[11,"Schlosser"],[28,"Kipinä"],[24,"Kniazev"],[18,"Suokko"],[98,"Alho"],[88,"Pyykkö"]]},{"id":"yellow","name":"Yellow","players":[[17,"Hannonen"],[28,"Lehto"],[12,"Nylund"],[36,"Rämä"],[18,"Tapioharju"],[91,"Luukkanen"],[66,"Heikel"]]}]});
let rosterSource='Asennettu offline-kokoonpano';
try {const raw=localStorage.getItem(ROSTER_CACHE);if(raw){const saved=validateRoster(JSON.parse(raw));if(saved.updated>=rosterPresets.updated){rosterPresets=saved;rosterSource='Tallennettu kopio';}}}catch{}
let rosterRefresh=null;
async function refreshRosterPresets(){if(!navigator.onLine)return;if(rosterRefresh)return rosterRefresh;rosterRefresh=(async()=>{
  const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),3500);
  try{const response=await fetch('./rosters.json',{cache:'no-store',signal:controller.signal});if(!response.ok)throw Error(tr("Kokoonpano ei saatavilla"));const data=validateRoster(await response.json());if(data.updated<rosterPresets.updated)return;rosterPresets=data;rosterSource='Verkosta tarkistettu';try{localStorage.setItem(ROSTER_CACHE,JSON.stringify(data))}catch{}}
  catch{rosterSource=rosterPresets?'Tallennettu kopio · tarkista ajantasaisuus':'Kokoonpanoa ei saatu ladattua';}
  finally{clearTimeout(timer);}
})();try{await rosterRefresh}finally{rosterRefresh=null;}
}
function rosterOptions(data){return `<option value="">${tr('Tyhjä kokoonpano / käsin')}</option>`+(data?.teams||[]).map(team=>`<option value="${escapeHTML(team.id)}">EKS ${escapeHTML(team.name)} · ${tr('{count} pelaajaa',{count:team.players.length})}</option>`).join('')}
function wireRosterForm(){
  const form=$('new-game-form');if(!form)return;
  let data=rosterPresets;const select=$('roster-preset'),side=$('roster-side'),preview=$('roster-preview'),status=$('roster-status');
  form.rosterSnapshot=data;
  function statusText(){status.textContent=data?data.event+' · '+new Intl.DateTimeFormat(getLocale()).format(new Date(data.updated+'T12:00:00'))+' · '+tr(rosterSource):tr(rosterSource)||tr('Tarkistetaan kokoonpanoja…')}
  function updatePreview(fillNames){
    const t=data?.teams.find(t=>t.id===select.value);preview.textContent='';
    side.disabled=!t;
    if(!t)return;
    if(fillNames){const own=side.value,other=own==='home'?'away':'home';$('new-'+own).value='EKS '+t.name;$('new-'+other).value=data.opponent;}
    for(const [n,name] of t.players){const span=document.createElement('span');span.className='roster-preview-chip';span.textContent='#'+n+' '+name;preview.appendChild(span)}
  }
  select.innerHTML=rosterOptions(data);if(data)side.value=data.side;statusText();updatePreview(false);
  select.addEventListener('change',()=>updatePreview(true));side.addEventListener('change',()=>updatePreview(true));
  // Use the local snapshot immediately. Background refresh never changes an open form.
}
void refreshRosterPresets();
window.addEventListener('online',()=>void refreshRosterPresets());
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'&&state.start===null)void refreshRosterPresets();});
function showNewGame() {
  pending = null;
  openSheet(tr("Uusi ottelu"),tr("Uusi peli, puhdas tulostaulu."),`<div class="stack"><div class="helper-box"><label class="field" for="roster-preset">${tr("EKS:n kokoonpano")}<select id="roster-preset" name="preset"></select></label><p class="field-note" id="roster-status"></p><label class="field" for="roster-side" style="margin-top:12px">${tr("EKS pelaa")}<select id="roster-side" name="presetSide" disabled><option value="home">${tr("Kotijoukkueena")}</option><option value="away">${tr("Vierasjoukkueena")}</option></select></label><div id="roster-preview" class="roster-preview"></div></div><label class="field" for="new-home">${tr("Kotijoukkue")}<input id="new-home" name="home" value="${escapeHTML(state.home)}" maxlength="60" required></label><label class="field" for="new-away">${tr("Vierasjoukkue")}<input id="new-away" name="away" placeholder="${tr("Vastustajan nimi")}" maxlength="60"></label><div class="form-grid"><label class="field" for="new-length">${tr("Erän pituus, min")}<input id="new-length" name="length" type="number" inputmode="numeric" min="1" max="60" value="${state.periodLength/60}" required></label><label class="field" for="new-date">${tr("Ottelupäivä")}<input id="new-date" name="date" type="date" value="${localDate()}" required></label></div><div class="helper-box"><strong>${tr("Nykyinen ottelu siirtyy arkistoon.")}</strong><br>${tr("Uuden ottelun tulos ja tapahtumat nollautuvat. Valittu EKS-kokoonpano kopioidaan uuteen otteluun; vastustajan pelaajat lisätään tarvittaessa käsin.")}</div></div>`,
    `<button class="button quiet" type="button" data-action="close-sheet">${tr("Peruuta")}</button><button class="button primary" type="submit">${tr("Luo ottelu")}</button>`,'new-game-form');
  wireRosterForm();
}
function localDate() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
}
function submitNewGame(form) {
  const data = new FormData(form);
  const minutes = Number(data.get('length'));
  if(!Number.isInteger(minutes)||minutes<1||minutes>60) throw new Error(tr("Valitse erän pituus väliltä 1–60 minuuttia."));
  const hasContent = state.events.length || state.roster.length || elapsedPrecise(state) || state.start!==null || state.period>1 || state.away!=='Vastustaja' || state.notes || state.detail || state.title;
  const next = hasContent ? archiveAndNew({...state,finished:true}) : {...createGame(),archive:clone(state.archive)};
  next.home = String(data.get('home')).trim() || 'Kiekko-Espoo';
  next.away = String(data.get('away')).trim() || 'Vastustaja';
  next.periodLength = minutes*60;
  next.date = new Date(String(data.get('date'))+'T12:00:00').toISOString();
  next.configured = true;
  const presetId=String(data.get('preset')||'');
  if(presetId){const preset=form.rosterSnapshot?.teams.find(t=>t.id===presetId);const side=String(data.get('presetSide'));if(!preset||!['home','away'].includes(side))throw new Error(tr("Valitse kokoonpano uudelleen."));next.roster=preset.players.map(([n,name])=>({n:String(n),name,team:side}));next.rosterPreset={event:form.rosterSnapshot.event,updated:form.rosterSnapshot.updated,id:preset.id};}
  if(!persist(next)) return formError(tr("Uutta ottelua ei voitu tallentaa."));
  closeSheet();
  viewAllEvents=false;
  navigate('ottelu');
  render();
  releaseWakeLock();
  notify(presetId?tr("Uusi ottelu ja EKS-kokoonpano valmis."):tr("Uusi ottelu valmis. Lisää kokoonpano Pelaajat-välilehdellä."));
}
function showMatchSettings(startAfter=false) {
  const canChangeLength = !state.events.length && !elapsed(state) && state.start===null && state.period===1;
  openSheet(startAfter?tr("Valmiina aloitukseen?"):tr("Ottelun asetukset"),startAfter?tr("Valitse erän pituus ennen kellon käynnistämistä."):tr("Joukkueet ja peliaika."),`<div class="stack"><label class="field" for="settings-home">${tr("Kotijoukkue")}<input id="settings-home" name="home" value="${escapeHTML(state.home)}" maxlength="60" required></label><label class="field" for="settings-away">${tr("Vierasjoukkue")}<input id="settings-away" name="away" value="${escapeHTML(state.away==='Vastustaja'?'':state.away)}" placeholder="${tr('Vastustaja')}" maxlength="60"></label><label class="field" for="settings-length">${tr("Erän pituus, min")}<input id="settings-length" name="length" type="number" inputmode="numeric" min="1" max="60" value="${state.periodLength/60}" ${canChangeLength?'required':'disabled'}>${canChangeLength?'':`<small>${tr("Erän pituus on lukittu tämän ottelun alkamisen jälkeen.")}</small>`}</label><input name="startAfter" type="hidden" value="${startAfter?'yes':'no'}">${startAfter?'':`<div class="form-grid"><button class="button" type="button" data-action="edit-clock">${icon('clock')}${tr("Korjaa kelloa")}</button><button class="button" type="button" data-action="next-period">${tr("Seuraava erä")}${icon('arrow')}</button></div><button class="text-button" type="button" data-action="${state.finished?'reopen-game':'finish-game'}">${state.finished?tr("Jatka ottelua"):tr("Merkitse ottelu päättyneeksi")}</button>`}</div>`,
    `<button type="button" class="button quiet" data-action="close-sheet">${tr("Peruuta")}</button><button type="submit" class="button primary">${startAfter?icon('play')+tr("Aloita 1. erä"):tr("Tallenna asetukset")}</button>`,'settings-form');
}
function submitSettings(form) {
  const data = new FormData(form);
  const next = clone(state);
  next.home = String(data.get('home')).trim() || 'Kiekko-Espoo';
  next.away = String(data.get('away')).trim() || 'Vastustaja';
  if(data.has('length')) {
    const length = Number(data.get('length'));
    if(!Number.isInteger(length)||length<1||length>60) throw new Error(tr("Valitse erän pituus väliltä 1–60 minuuttia."));
    next.periodLength=length*60;
  }
  next.configured=true;
  if(data.get('startAfter')==='yes') { next.start=Date.now(); next.finished=false; }
  if(!persist(next)) return formError(tr("Asetuksia ei voitu tallentaa."));
  closeSheet(); render();
  if(next.start!==null) requestWakeLock();
  notify(data.get('startAfter')==='yes'?tr("Erä käynnissä."):tr("Ottelun asetukset tallennettu."));
}
function toggleClock() {
  if(!state.configured && !elapsed(state) && !state.events.length && state.start===null) { showMatchSettings(true); return; }
  const next = clone(state);
  if(state.start!==null) { next.seconds=elapsedPrecise(state); next.start=null; }
  else { next.start=Date.now(); next.finished=false; }
  if(!persist(next)) return;
  render();
  if(next.start===null) releaseWakeLock(); else requestWakeLock();
}
function showClockEditor() {
  if(state.start!==null) {
    if(!mutate(next=>{next.seconds=elapsedPrecise(state);next.start=null;})) return;
    releaseWakeLock();
  }
  openSheet(tr("Korjaa kelloa"),tr('{period}. erä · kello on pysäytetty',{period:state.period}), `<div class="stack"><label class="field" for="remaining-time">${tr("Jäljellä oleva aika")}<input class="clock-editor" id="remaining-time" name="remaining" inputmode="numeric" value="${formatTime(state.periodLength-elapsed(state))}" placeholder="mm:ss" required></label><p class="helper-box">${tr("Syötä hallin kellossa näkyvä aika. Aiemmin kirjattujen tapahtumien ajat säilyvät ennallaan.")}</p></div>`,
    `<button class="button quiet" type="button" data-action="close-sheet">${tr("Peruuta")}</button><button class="button primary" type="submit">${tr("Aseta aika")}</button>`,'clock-form');
}
function changePeriod() {
  askConfirm(tr("Siirry seuraavaan erään?"),tr('{period}. erä alkaa ajasta {time}. Käynnistät kellon erikseen Aloita erä -painikkeesta.',{period:state.period+1,time:formatTime(state.periodLength)}),()=>{
    const next = nextPeriod(state);
    next.finished=false;
    if(persist(next)) { closeSheet();render();releaseWakeLock();notify(tr('{period}. erä valmiina aloitukseen.',{period:next.period})); }
  },tr("Valmistele seuraava erä"));
}
function finishGame() {
  askConfirm(tr("Merkitäänkö ottelu päättyneeksi?"),tr("Kello pysähtyy. Voit tehdä ottelukoosteen ja jatkaa muokkaamista tarvittaessa."),()=>{
    if(mutate(next=>{next.seconds=elapsedPrecise(state);next.start=null;next.finished=true;})) {closeSheet();releaseWakeLock();navigate('tilastot');notify(tr("Ottelu merkitty päättyneeksi."));}
  },tr("Päätä ottelu"));
}
async function requestWakeLock() {
  try { if('wakeLock' in navigator && document.visibilityState==='visible' && !wakeLock) wakeLock=await navigator.wakeLock.request('screen'); }
  catch { /* A running clock also works without the optional screen wake lock. */ }
}
function releaseWakeLock() {
  if(wakeLock) { wakeLock.release().catch(()=>{}); wakeLock=null; }
}
function addPlayer(form) {
  const data = new FormData(form), n = normalizeNumber(data.get('n')), name=String(data.get('name')).trim();
  if(n==='') throw new Error(tr("Anna pelaajan numero väliltä 0–99."));
  const existed = state.roster.some(p=>p.n===n&&p.team===rosterTeam);
  if(!mutate(next=>{const p=next.roster.find(p=>p.n===n&&p.team===rosterTeam);if(p)p.name=name;else next.roster.push({n,name,team:rosterTeam});})) return;
  notify(tr(existed?'Pelaaja #{number} päivitetty.':'Pelaaja #{number} lisätty.',{number:n}));
  $('player-number')?.focus({preventScroll:true});
}
function showPlayerEditor(n,team) {
  const player = state.roster.find(p=>p.n===n&&p.team===team);
  if(!player) return;
  editingPlayer={n,team};
  openSheet(tr('Pelaaja #{number}',{number:n}),displayTeam(state,team),`<div class="stack"><label class="field" for="edit-player-name">${tr("Sukunimi")}<input id="edit-player-name" name="name" value="${escapeHTML(player.name)}" maxlength="60" placeholder="${tr("Pelaajan sukunimi")}"></label><p class="helper-box">${tr("Nimi päivittyy myös tämän ottelun aiempiin tapahtumiin ja koosteeseen.")}</p></div>`,
    `<button class="button danger" type="button" data-action="remove-player" aria-label="${tr("Poista pelaaja kokoonpanosta")}">`+icon('trash')+`</button><button class="button primary" type="submit">${tr("Tallenna pelaaja")}</button>`,'edit-player-form');
}
function deleteEvent(id) {
  const previous=clone(state.events.find(e=>e.id===id));
  const index=state.events.findIndex(e=>e.id===id), gameId=state.id;
  if(!previous) return;
  askConfirm(tr("Poistetaanko tapahtuma?"),`${domainText(previous.type)} · ${displayTeam(state,previous.team)} · ${tr('{period}. erä',{period:previous.period})} ${formatTime(previous.time)}`,()=>{
    if(!mutate(next=>{next.events=next.events.filter(e=>e.id!==id);}))return;
    closeSheet();
    notify(tr("Tapahtuma poistettu."),()=>{if(state.id===gameId)mutate(next=>{if(!next.events.some(e=>e.id===id))next.events.splice(index,0,previous);});});
  },tr("Poista tapahtuma"),true);
}
function showLegacyEvent(event) {
  openSheet(tr("Vanha tapahtuma"),tr("Säilytetty aiemmasta versiosta."),`<ol class="event-list" style="padding:0">${eventRow(event,state,false)}</ol><p class="helper-box">${tr("Vanha laukausyritys säilyy historiassa, mutta sitä ei lasketa laukauksiin maalia kohti. Korjaa virheellinen kirjaus poistamalla se ja kirjaamalla tarvittaessa maali tai torjunta.")}</p>`,
    `<button class="button danger" type="button" data-action="delete-event" data-id="${escapeHTML(event.id)}">${icon('trash')}${tr("Poista tapahtuma")}</button><button class="button primary" type="button" data-action="close-sheet">${tr("Valmis")}</button>`);
}
function showArchive(id) {
  const game = state.archive.find(g=>g.id===id);
  if(!game)return;
  reportGame=game;
  const goals=score(game), stats=teamStats(game);
  openSheet(tr("Tallennettu ottelu"),dateLabel(game,true),`<h3 style="text-align:center">${escapeHTML(displayTeam(game,'home'))} – ${escapeHTML(displayTeam(game,'away'))}</h3><div style="text-align:center;font-size:60px;font-weight:850;letter-spacing:-3px;margin:12px 0;color:var(--navy)">${goals.home} : ${goals.away}</div><div class="helper-box" style="text-align:center">${tr("Laukaukset maalia kohti")} ${stats.home.shots}–${stats.away.shots}<br>${tr("Torjunnat")} ${stats.home.saves}–${stats.away.saves}<br>${tr('{count} tapahtumaa',{count:game.events.length})} · ${tr('{count} pelaajaa',{count:game.roster.length})}</div><div class="form-grid" style="margin-top:18px"><button class="button" data-action="archive-poster" type="button">${icon('image')}${tr("Ottelukuva")}</button><button class="button" data-action="archive-report" type="button">${icon('text')}${tr("Tekstikooste")}</button></div><p class="field-note" style="margin-top:18px">${tr("Avaaminen siirtää nykyisen ottelun arkistoon. Voit sen jälkeen tarkastella ja korjata tämän pelin tapahtumia.")}</p>`,
    `<button class="button quiet" type="button" data-action="close-sheet">${tr("Sulje")}</button><button class="button primary" type="button" data-action="open-archive" data-id="${escapeHTML(id)}">${tr("Avaa ottelu")}${icon('arrow')}</button>`);
}
function showMenu() {
  pending=null;
  const item=(action,i,title,description)=>`<button class="menu-item" type="button" data-action="${action}">${icon(i)}<span>${title}<small>${description}</small></span>${icon('arrow','class="chevron"')}</button>`;
  openSheet(tr("Peli hallussa."),tr("Asetukset ja tiedot."),`<div class="menu-list">${item('match-settings','settings',tr("Ottelun asetukset"),tr("Joukkueet, kello ja erät"))}${item('new-game','new',tr("Uusi ottelu"),tr("Nykyinen peli talteen, uusi tilalle"))}${item('backup','download',tr("Vie varmuuskopio"),tr("Kaikki ottelut yhdessä tiedostossa"))}${item('restore','upload',tr("Palauta varmuuskopio"),tr("Avaa aiemmin viety JSON-tiedosto"))}${item('install-help','share',tr("Lisää kotivalikkoon"),tr("Oma kuvake iPhonen tai Androidin aloitusnäyttöön"))}</div><hr class="menu-divider"><p class="small muted" id="offline-description">${escapeHTML(pwaStatus?.message||tr("Tarkistetaan offline-valmiutta…"))}</p><div class="version-line"><span>${tr('Versio {version}',{version:VERSION})}</span><button class="text-button" type="button" data-action="check-update">${icon('refresh')}${tr("Tarkista päivitys")}</button></div><p class="field-note">${tr("Epävirallinen ottelutyökalu Kiekko-Espoon väreissä.")}</p>`);
  $('sheet-content').querySelector('.menu-list').insertAdjacentHTML('afterbegin',
    item('language','language',tr('Kieli'),LANGUAGES.map(language=>language.name).join(' · '))+item('help','info',tr("Ohje ja palaute"),tr("Käyttöohje, bugit ja kehitysideat")));
}
function loadFeedbackDraft() {
  if (feedbackDraft) return feedbackDraft;
  feedbackDraft = createFeedbackDraft();
  try {
    const raw = localStorage.getItem(FEEDBACK_STORAGE_KEY);
    if (raw !== null) {
      try { feedbackDraft = normalizeFeedbackDraft(JSON.parse(raw)); }
      catch {
        feedbackStorageBlocked = true;
        feedbackStorageIssue = 'Aiemman palauteluonnoksen lukeminen epäonnistui. Uutta tekstiä ei tallenneta sen päälle. Voit silti valmistella ja kopioida viestin.';
      }
    }
  } catch {
    feedbackStorageIssue = 'Luonnoksen tallennustila ei ole käytettävissä. Kopioi viesti talteen ennen sovelluksen sulkemista.';
  }
  return feedbackDraft;
}
function feedbackHasContent() {
  const draft = loadFeedbackDraft();
  return Boolean(draft.title.trim() || draft.description.trim() || draft.steps.trim());
}
function updateFeedbackStatus() {
  const status = $('feedback-draft-status');
  if (!status) return;
  const message = tr(feedbackStorageIssue) || (feedbackHasContent()
    ? tr("Luonnos tallennettu tähän laitteeseen.")
    : tr("Luonnos tallentuu automaattisesti tähän laitteeseen."));
  if (status.textContent !== message) status.textContent = message;
  status.classList.toggle('feedback-warning', Boolean(feedbackStorageIssue));
}
function saveFeedbackDraft() {
  if (feedbackStorageBlocked) { updateFeedbackStatus(); return false; }
  try {
    localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(feedbackDraft));
    feedbackStorageIssue = '';
    updateFeedbackStatus();
    return true;
  } catch {
    feedbackStorageIssue = 'Luonnosta ei saatu tallennettua. Teksti on vielä tässä ikkunassa. Kopioi tai lataa se talteen ennen sulkemista.';
    updateFeedbackStatus();
    return false;
  }
}
function captureFeedbackDraft() {
  const form = $('feedback-form');
  if (!form) return feedbackDraft;
  const data = new FormData(form);
  try {
    feedbackDraft = normalizeFeedbackDraft({
      type: data.get('type'),
      title: data.get('title'),
      description: data.get('description'),
      steps: data.get('steps'),
      includeDiagnostics: data.get('diagnostics') === 'yes',
    });
  } catch (error) {
    feedbackStorageIssue = error.message;
    updateFeedbackStatus();
    return null;
  }
  saveFeedbackDraft();
  const isBug = feedbackDraft.type === 'bug';
  $('feedback-steps-row').hidden = !isBug;
  $('feedback-description-label').textContent = isBug ? tr("Mitä tapahtui?") : feedbackDraft.type === 'idea' ? tr("Mitä toivoisit?") : tr("Mikä mietityttää?");
  return feedbackDraft;
}
function feedbackContext() {
  const ua = navigator.userAgent || '';
  let platform = tr("Muu laite");
  if (/iPhone|iPod/.test(ua)) platform = 'iPhone / iOS';
  else if (/iPad/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1)) platform = 'iPad / iPadOS';
  else if (/Android/.test(ua)) platform = 'Android';
  else if (/Windows/.test(ua)) platform = 'Windows';
  else if (/Macintosh|Mac OS X/.test(ua)) platform = 'Mac';
  else if (/Linux/.test(ua)) platform = 'Linux';
  let browser = tr("Muu selain");
  for (const [pattern, name] of [
    [/(?:Edg|EdgiOS|EdgA)\/([\d.]+)/, 'Edge'],
    [/SamsungBrowser\/([\d.]+)/, 'Samsung Internet'],
    [/(?:FxiOS|Firefox)\/([\d.]+)/, 'Firefox'],
    [/(?:CriOS|Chrome)\/([\d.]+)/, 'Chrome'],
    [/Version\/([\d.]+).*Safari/, 'Safari'],
  ]) {
    const match = ua.match(pattern);
    if (match) { browser = name + ' ' + match[1].split('.')[0]; break; }
  }
  return { recipient: FEEDBACK_RECIPIENT, version: VERSION, language:getLanguage(), platform, browser,
    standalone: window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true,
    online: navigator.onLine, offlineReady: Boolean(pwaStatus?.offlineReady) };
}
function showHelp() {
  captureFeedbackDraft();
  pending = null;
  const resume = feedbackHasContent()
    ? '<button class="feedback-resume" type="button" data-action="feedback-resume">' + icon('edit') + `<span>${tr("Jatka palauteluonnosta")}<small>` + escapeHTML(feedbackDraft.title || getFeedbackKinds()[feedbackDraft.type]) + '</small></span></button>'
    : '';
  openSheet(tr("Ohje ja palaute"), tr("Apua peliin. Ideat talteen."),
    resume + renderHelp({icon, escapeHTML, version: VERSION}),
    `<button class="button primary" type="button" data-action="close-sheet">${tr("Valmis")}</button>`);
}
function showFeedback(kind) {
  captureFeedbackDraft();
  loadFeedbackDraft();
  if (Object.hasOwn(FEEDBACK_KINDS, kind)) {
    feedbackDraft.type = kind;
    if (feedbackHasContent()) saveFeedbackDraft();
  }
  pending = null;
  feedbackPreview = null;
  const draft = feedbackDraft;
  const isBug = draft.type === 'bug';
  const options = Object.entries(getFeedbackKinds()).map(([value, label]) =>
    '<option value="' + value + '"' + (draft.type === value ? ' selected' : '') + '>' + label + '</option>').join('');
  const body = '<div class="feedback-form-body">' +
    '<div class="feedback-recipient">' + icon('mail') + `<div><strong>${tr("Palaute Henrille")}</strong><span>` + FEEDBACK_RECIPIENT + '</span></div></div>' +
    `<p class="feedback-intro">${tr("Kerro lyhyesti, mitä huomasit tai mitä toivot. Saat tarkistaa viestin ennen sähköpostin avaamista.")}</p>` +
    `<label class="field" for="feedback-kind">${tr("Palautteen tyyppi")}<select id="feedback-kind" name="type">` + options + '</select></label>' +
    `<label class="field" for="feedback-title">${tr("Aihe")}<input id="feedback-title" name="title" maxlength="` + FEEDBACK_LIMITS.title + '" value="' + escapeHTML(draft.title) + `" placeholder="${tr("Esimerkiksi kellon korjaaminen")}" required autocomplete="off"></label>` +
    '<label class="field" for="feedback-description"><span id="feedback-description-label">' + (isBug ? tr("Mitä tapahtui?") : draft.type === 'idea' ? tr("Mitä toivoisit?") : tr("Mikä mietityttää?")) + '</span><textarea id="feedback-description" name="description" maxlength="' + FEEDBACK_LIMITS.description + `" placeholder="${tr("Kerro omin sanoin. Mitä teit ja mitä odotit tapahtuvan?")}" required rows="5">` + escapeHTML(draft.description) + '</textarea></label>' +
    '<label class="field" id="feedback-steps-row" for="feedback-steps"' + (isBug ? '' : ' hidden') + `>${tr("Miten ongelman saa esiin?")} <small>${tr("Valinnainen")}</small><textarea id="feedback-steps" name="steps" maxlength="` + FEEDBACK_LIMITS.steps + `" placeholder="${tr("Esimerkiksi: avaan ottelun, käynnistän kellon…")}" rows="3">` + escapeHTML(draft.steps) + '</textarea></label>' +
    '<label class="feedback-diagnostics"><input type="checkbox" id="feedback-diagnostics" name="diagnostics" value="yes"' + (draft.includeDiagnostics ? ' checked' : '') + `><span>${tr("Liitä tekniset perustiedot")}<small>${tr("Sovellusversio, käyttöjärjestelmä, selain ja yhteyden tila. Otteluita tai pelaajatietoja ei liitetä.")}</small></span></label>` +
    '<p class="feedback-draft-status" id="feedback-draft-status" role="status" aria-live="polite"></p>' +
    `<p class="feedback-footnote">${tr("Voit kirjoittaa myös ilman nettiä. Lähetys tehdään omasta sähköpostisovelluksestasi, kun yhteys on käytettävissä.")}</p>` +
    `<button class="text-button feedback-clear" type="button" data-action="feedback-clear">${tr("Tyhjennä palauteluonnos")}</button></div>`;
  openSheet(tr("Palaute kehittäjälle"), tr("Bugi, kehitysidea tai kysymys."), body,
    `<button class="button quiet" type="button" data-action="help">${tr("Takaisin")}</button><button class="button primary" type="submit">${tr("Esikatsele viesti")}</button>`,
    'feedback-form');
  updateFeedbackStatus();
}
function prepareFeedback() {
  const captured = captureFeedbackDraft();
  if (!captured) throw new Error(feedbackStorageIssue || tr("Tarkista palautteen tiedot."));
  feedbackDraft = validateFeedbackDraft(captured);
  saveFeedbackDraft();
  feedbackPreview = buildFeedbackEmail(feedbackDraft, feedbackContext());
  const longMessage = feedbackPreview.mailto.length > 1800;
  const mailto = longMessage ? feedbackPreview.mailto.split('&body=')[0] : feedbackPreview.mailto;
  const explanation = longMessage
    ? `<p class="feedback-delivery-note feedback-warning"><strong>${tr("Kopioi pitkä viesti ensin.")}</strong> ${tr("Paina Kopioi viesti, avaa sähköposti ja liitä teksti viestiin. Vastaanottaja ja aihe täyttyvät valmiiksi.")}</p>`
    : `<p class="feedback-delivery-note"><strong>${tr("Lähetät viestin sähköpostisovelluksessa.")}</strong> ${tr("Avaa sähköposti, tarkista viesti ja paina siellä Lähetä. Voit liittää kuvakaappauksen sähköpostissa.")}</p>`;
  const body = '<div class="feedback-preview">' +
    '<div class="feedback-recipient">' + icon('mail') + '<div><strong>Henri Haho</strong><span>' + FEEDBACK_RECIPIENT + '</span></div></div>' +
    `<p class="feedback-subject"><span>${tr("Aihe")}</span><strong>` + escapeHTML(feedbackPreview.subject) + '</strong></p>' +
    `<textarea id="feedback-preview-text" class="feedback-preview-text" readonly aria-label="${tr("Palautteen esikatselu")}">` + escapeHTML(feedbackPreview.body) + '</textarea>' +
    explanation +
    '<div class="feedback-copy-actions"><button class="button" type="button" data-action="feedback-copy">' + icon('text') + `${tr("Kopioi viesti")}</button><button class="button" type="button" data-action="feedback-download">` + icon('download') + `${tr("Lataa teksti")}</button></div>` +
    `<button class="text-button feedback-address" type="button" data-action="feedback-copy-address">${tr("Kopioi sähköpostiosoite")}</button>` +
    '<p class="feedback-draft-status" id="feedback-draft-status" role="status" aria-live="polite"></p>' +
    `<p class="feedback-footnote">${tr("Jos sähköposti ei avaudu, kopioi viesti ja osoite omaan sähköpostiisi. Tallennettu luonnos säilyy, kunnes tyhjennät sen. Sovellus ei näe, lähetettiinkö viesti.")}</p>` +
    `<button class="text-button feedback-clear" type="button" data-action="feedback-clear">${tr("Tyhjennä palauteluonnos")}</button></div>`;
  openSheet(tr("Valmis sähköpostiin"), tr("Tarkista viesti ennen lähettämistä."), body,
    `<button class="button quiet" type="button" data-action="feedback-resume">${tr("Muokkaa")}</button><a class="button primary" id="feedback-email-link" data-action="feedback-email" href="` + escapeHTML(mailto) + '">' + icon('mail') + `${tr("Avaa sähköposti")}</a>`);
  updateFeedbackStatus();
}
async function copyFeedback(addressOnly = false) {
  const text = addressOnly ? FEEDBACK_RECIPIENT : feedbackPreview?.body;
  if (!text) return;
  try {
    await navigator.clipboard.writeText(text);
    notify(addressOnly ? tr("Sähköpostiosoite kopioitu.") : tr("Palaute kopioitu. Liitä se sähköpostiisi."));
  } catch {
    if (addressOnly) formError(tr('Kopioi osoite käsin: {email}',{email:FEEDBACK_RECIPIENT}));
    else {
      const preview = $('feedback-preview-text');
      preview?.focus(); preview?.select();
      formError(tr("Selain ei sallinut kopiointia. Kopioi valittu teksti käsin tai lataa se tiedostona."));
    }
  }
}
function clearFeedback() {
  captureFeedbackDraft();
  askConfirm(tr("Tyhjennetäänkö palauteluonnos?"), tr("Vain tämän palautteen teksti poistetaan. Ottelut säilyvät."),
    () => {
      try { localStorage.removeItem(FEEDBACK_STORAGE_KEY); }
      catch { formError(tr("Luonnosta ei voitu poistaa laitteen tallennustilasta.")); return; }
      feedbackDraft = createFeedbackDraft();
      feedbackStorageIssue = '';
      feedbackStorageBlocked = false;
      feedbackPreview = null;
      showHelp();
      notify(tr("Palauteluonnos tyhjennetty."));
    }, tr("Tyhjennä"), true);
}
function showInstallHelp() {
  openSheet(tr("Kiekkokirjuri kotivalikkoon"),tr("iPhone ja Android"),`<div class="info-list"><div class="info-item">${icon('share')}<div><strong>${tr("iPhone · Safari")}</strong>${tr("Avaa tämä osoite Safarissa. Valitse Jaa → Lisää Koti-valikkoon. Ota Avaa verkkoappina käyttöön, jos valinta näkyy. Tarkista nimeksi Kiekkokirjuri ja paina Lisää.")}</div></div><div class="info-item">${icon('rink')}<div><strong>${tr("Android · Chrome")}</strong>${tr("Avaa tämä osoite Chromessa. Valitse ⋮ → Asenna ja luo pikakuvake → Asenna. Joissakin versioissa valinta on Lisää aloitusnäyttöön.")}</div></div><div class="info-item">${icon('check')}<div><strong>${tr("Avaa uusi Kiekkokirjuri-kuvake kerran netissä")}</strong>${tr("Odota, että asetuksissa lukee Valmis myös ilman yhteyttä. Sen jälkeen voit kirjata ottelut ilman verkkoa. Uudet kokoonpanot ja sovelluspäivitykset haetaan verkkoyhteydellä.")}</div></div></div><p class="helper-box" style="margin-top:22px"><strong>${tr("Onko sinulla jo otteluita vanhassa kuvakkeessa tai selaimessa?")}</strong><br>${tr("Vie niistä varmuuskopio ennen uuden kuvakkeen lisäämistä. Vanha kuvake ei välttämättä vaihda nimeä tai kuvaa itsestään. Jos uusi kuvake avaa tyhjän ottelun, palauta varmuuskopio siinä. Säilytä vanha sovellus, kunnes ottelut näkyvät myös uudessa.")}</p>`,
    `<button class="button primary" type="button" data-action="close-sheet">${tr("Selvä")}</button>`);
}

function download(blob,name) {
  const url=URL.createObjectURL(blob), anchor=document.createElement('a');
  anchor.href=url;anchor.download=name;document.body.appendChild(anchor);anchor.click();anchor.remove();
  setTimeout(()=>URL.revokeObjectURL(url),60000);
}
function safeFilename(game,suffix) {
  return `${game.home}-${game.away}-${suffix}`.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-zA-Z0-9._-]/g,'-').replace(/-+/g,'-').toLowerCase();
}
function backup() {
  download(new Blob([unreadableRaw!==null?unreadableRaw:JSON.stringify({...snapshot(state),archive:state.archive},null,2)],{type:'application/json'}),`kiekkokirjuri-varmuuskopio-${localDate()}.json`);
  notify(unreadableRaw!==null?tr("Alkuperäinen tallennus vietiin tiedostoksi."):tr("Varmuuskopio sisältää nykyisen ottelun ja koko arkiston."));
}
async function restoreFile(file) {
  if(!file)return;
  if(file.size>25*1024*1024) throw new Error(tr("Varmuuskopio on liian suuri. Enimmäiskoko on 25 Mt."));
  const restored=normalizeState(JSON.parse(await file.text()));
  // Import resumes paused, so a backup never restarts a clock using an old timestamp.
  restored.seconds=elapsedPrecise(restored);
  restored.start=null;
  askConfirm(tr("Palautetaanko varmuuskopio?"),tr('Tiedostossa on nykyinen ottelu ja {count} arkistoitua ottelua. Palautus korvaa tällä laitteella olevat ottelut. Vie tarvittaessa ensin nykyinen varmuuskopio.',{count:restored.archive.length}),()=>{
    const original=unreadableRaw;
    unreadableRaw=null;
    if(!persist(restored)) {unreadableRaw=original;return formError(tr("Varmuuskopiota ei voitu tallentaa."));}
    closeSheet();releaseWakeLock();navigate('ottelu');render();notify(tr("Varmuuskopio palautettu. Kello on pysäytetty."));
  },tr("Palauta ottelut"));
}
function showReport(game=state) {
  reportGame=snapshot(game);
  openSheet(tr("Ottelukooste"),tr("Koko ottelu tekstinä."),`<textarea class="report-text" id="report-text" readonly aria-label="${tr("Ottelun tekstikooste")}">${escapeHTML(textReport(reportGame))}</textarea>`,
    `<button class="button" type="button" data-action="download-report">${icon('download')}${tr("Lataa .txt")}</button><button class="button primary" type="button" data-action="copy-report">${icon('text')}${tr("Kopioi teksti")}</button>`);
}
async function showPoster(game=state) {
  reportGame=snapshot(game);
  const token=openSheet(tr("Ottelukuva"),tr("Valmistellaan jaettavaa koostetta…"),empty('image',tr("Hetki, kuva valmistuu."),tr("Kuva luodaan tällä laitteella. Myös ilman verkkoyhteyttä.")));
  const requestedGame=reportGame;
  const blob=await createPoster(requestedGame);
  if(!$('sheet').open || sheetToken!==token || reportGame!==requestedGame) return;
  posterBlob=blob;
  if(posterURL)URL.revokeObjectURL(posterURL);
  posterURL=URL.createObjectURL(blob);
  openSheet(tr("Ottelukuva"),tr("Valmis jaettavaksi."),`<div class="poster-wrap"><img class="poster-preview" src="${posterURL}" alt="${escapeHTML(tr('Ottelukooste: {home} vastaan {away}',{home:displayTeam(game,'home'),away:displayTeam(game,'away')}))}"></div>`,
    `<button class="button" type="button" data-action="download-poster">${icon('download')}${tr("Lataa PNG")}</button><button class="button primary" type="button" data-action="share-poster">${icon('share')}${tr("Jaa kuva")}</button>`);
}
async function sharePoster() {
  if(!posterBlob||!reportGame)return;
  const file=new File([posterBlob],safeFilename(reportGame,'ottelukooste.png'),{type:'image/png'});
  if(navigator.canShare?.({files:[file]})&&navigator.share) {
    try {await navigator.share({files:[file],title:tr("Ottelukooste")});} catch(error){if(error.name!=='AbortError')formError(tr("Jakaminen ei onnistunut. Voit ladata kuvan PNG-tiedostona."));}
  } else {download(posterBlob,file.name);notify(tr("Kuva ladattu. Voit jakaa sen laitteen tiedostoista."));}
}
function navigate(destination) {
  if(view===destination)return;
  view=destination;
  if(location.hash!=='#'+destination) history.replaceState(null,'','#'+destination);
  render();
  window.scrollTo({top:0,behavior:'instant'});
}

// Event delegation keeps every player name and imported field out of executable HTML.
document.addEventListener('click',async event=>{
  const button=event.target.closest('[data-action]');
  if(!button || button.disabled)return;
  const {action,team,number,id,type}=button.dataset;
  try {
    switch(action) {
      case 'menu':showMenu();break;
      case 'language':showLanguage();break;
      case 'set-language':changeLanguage(button.dataset.language);break;
      case 'help':showHelp();break;
      case 'feedback-open':showFeedback(button.dataset.kind);break;
      case 'feedback-resume':showFeedback();break;
      case 'feedback-copy':await copyFeedback();break;
      case 'feedback-copy-address':await copyFeedback(true);break;
      case 'feedback-clear':clearFeedback();break;
      case 'feedback-email':notify(tr("Viesti on valmisteltu. Lähetä se sähköpostisovelluksessasi."));break;
      case 'feedback-download':if(feedbackPreview)download(new Blob([tr('Vastaanottaja: {email}',{email:FEEDBACK_RECIPIENT})+'\n'+tr('Aihe: {subject}',{subject:feedbackPreview.subject})+'\n\n'+feedbackPreview.body],{type:'text/plain;charset=utf-8'}),'kiekkokirjuri-palaute.txt');break;
      case 'close-sheet':closeSheet();break;
      case 'confirm':if(confirmAction)confirmAction();break;
      case 'undo':{const undo=undoAction;$('toast').hidden=true;undoAction=null;if(undo)undo();break;}
      case 'event':if(state.finished){notify(tr("Jatka ottelua ennen uuden tapahtuman kirjaamista."));break;}beginEvent(type);break;
      case 'event-team':pending.team=team;drawEvent();break;
      case 'change-event-team':pending.team='';pending.n='';pending.assists=[];drawEvent();break;
      case 'pick-player':pickPlayer(number);break;
      case 'manual-player':pickPlayer($('manual-number').value);break;
      case 'clear-player':pending.n='';pending._manualNumber='';drawEvent(true);break;
      case 'pick-assist':pickAssist(number);break;
      case 'manual-assist':pickAssist($('manual-assist').value);break;
      case 'edit-event':{const e=state.events.find(e=>e.id===id);if(e){if(['Maali','Torjunta','Jäähy'].includes(e.type))beginEvent(e.type,e);else showLegacyEvent(e);}break;}
      case 'delete-event':deleteEvent(id);break;
      case 'all-events':viewAllEvents=!viewAllEvents;render();break;
      case 'new-game':showNewGame();break;
      case 'match-settings':showMatchSettings();break;
      case 'toggle-clock':toggleClock();break;
      case 'edit-clock':showClockEditor();break;
      case 'next-period':changePeriod();break;
      case 'finish-game':finishGame();break;
      case 'reopen-game':if(mutate(next=>{next.finished=false;})){closeSheet();notify(tr("Ottelu avattu muokattavaksi. Kello on pysäytetty."));}break;
      case 'roster-team':rosterTeam=team;render();break;
      case 'stats-team':statsTeam=team;render();break;
      case 'edit-player':showPlayerEditor(number,team);break;
      case 'remove-player':{const player={...editingPlayer};askConfirm(tr("Poistetaanko pelaaja kokoonpanosta?"),tr('Pelaajan #{number} tapahtumat ja tilastot säilyvät numerolla.',{number:player.n}),()=>{if(mutate(next=>{next.roster=next.roster.filter(p=>!(p.n===player.n&&p.team===player.team));})){closeSheet();notify(tr("Pelaaja poistettu kokoonpanosta."));}},tr("Poista pelaaja"),true);break;}
      case 'go-live':navigate('ottelu');break;
      case 'archive-detail':showArchive(id);break;
      case 'open-archive':if(persist(openArchive(state,id))){closeSheet();releaseWakeLock();navigate('ottelu');render();notify(tr("Tallennettu ottelu avattu."));}break;
      case 'backup':backup();break;
      case 'restore':$('restore-file').value='';$('restore-file').click();break;
      case 'report':showReport();break;
      case 'archive-report':showReport(reportGame);break;
      case 'poster':await showPoster();break;
      case 'archive-poster':await showPoster(reportGame);break;
      case 'download-report':download(new Blob([textReport(reportGame)],{type:'text/plain;charset=utf-8'}),safeFilename(reportGame,'ottelukooste.txt'));break;
      case 'copy-report':try{await navigator.clipboard.writeText(textReport(reportGame));notify(tr("Ottelukooste kopioitu."));}catch{$('report-text').select();formError(tr("Valitse ja kopioi teksti käsin. Selain ei sallinut automaattista kopiointia."));}break;
      case 'download-poster':if(posterBlob)download(posterBlob,safeFilename(reportGame,'ottelukooste.png'));break;
      case 'share-poster':await sharePoster();break;
      case 'install-help':showInstallHelp();break;
      case 'check-update':{button.disabled=true;try{const result=await checkForUpdate();notify(result?.updateAvailable?tr("Uusi versio on valmis ladattavaksi."):result?.state==='error'||!result?.online?result?.message||tr("Päivityksen tarkistaminen vaatii verkkoyhteyden."):tr('Käytössä on uusin versio {version}.',{version:VERSION}));}finally{button.disabled=false;}break;}
      case 'apply-update':if(state.start!==null||hasDraft()){notify(tr("Pysäytä kello ja tallenna tai sulje avoin lomake ennen päivitystä."));break;}if(updateAction){await updateAction();}break;
      case 'sync-storage':if($('sheet').open)closeSheet();else if(externalConflict)adoptExternal(externalConflict.raw);break;
    }
  } catch(error) { if($('sheet').open)formError(error.message||tr("Toiminto epäonnistui."));else notify(error.message||tr("Toiminto epäonnistui.")); }
});
document.addEventListener('submit',event=>{
  event.preventDefault();
  const form=event.target;
  try {
    switch(form.id) {
      case 'event-form':submitEvent();break;
      case 'feedback-form':prepareFeedback();break;
      case 'new-game-form':submitNewGame(form);break;
      case 'settings-form':submitSettings(form);break;
      case 'clock-form':{const remaining=parseTime(new FormData(form).get('remaining'));if(remaining>state.periodLength)throw new Error(tr("Aika ei voi ylittää erän pituutta."));if(mutate(next=>{next.seconds=state.periodLength-remaining;next.start=null;next.configured=true;})){closeSheet();notify(tr("Kello korjattu. Käynnistä se, kun peli jatkuu."));}break;}
      case 'add-player-form':addPlayer(form);break;
      case 'edit-player-form':{const name=String(new FormData(form).get('name')).trim();if(mutate(next=>{const p=next.roster.find(p=>p.n===editingPlayer.n&&p.team===editingPlayer.team);if(p)p.name=name;})){closeSheet();notify(tr("Pelaajan nimi tallennettu."));}break;}
    }
  }catch(error){formError(error.message||tr("Tarkista lomakkeen tiedot."),form.id==='add-player-form'?'roster-error':'sheet-error');}
});
document.addEventListener('input',event=>{
  if(event.target.closest('#feedback-form')){captureFeedbackDraft();return;}
  if(pending&&event.target.id==='manual-number')pending._manualNumber=event.target.value;
  if(pending&&event.target.id==='manual-assist')pending._manualAssist=event.target.value;
  const field=event.target.dataset.pending;
  if(!pending||!field||field==='time'||field==='period'||field==='penaltyType')return;
  pending[field]=field==='minutes'?Number(event.target.value):event.target.value;
});
document.addEventListener('change',event=>{
  if(event.target.closest('#feedback-form')){captureFeedbackDraft();return;}
  if(!pending)return;
  const field=event.target.dataset.pending;
  if(field==='penaltyType') {
    const penalty=penaltyTypes.find(p=>p.id===event.target.value);
    pending.penaltyType=penalty.id;
    if(penalty.id!=='custom'){pending.minutes=penalty.minutes;pending.penaltyLabel=penalty.label;}
    drawEvent(true);
  } else if(field==='reason')pending.reason=event.target.value;
  else if(field==='period')pending.period=Number(event.target.value);
  else if(field==='time'){try{pending.time=parseTime(event.target.value);}catch(error){formError(error.message);}}
});
$('restore-file').addEventListener('change',async event=>{
  try {await restoreFile(event.target.files[0]);}
  catch(error){if($('sheet').open)formError(tr('Varmuuskopiota ei palautettu. {error}',{error:error.message}));else notify(tr('Varmuuskopiota ei palautettu. {error}',{error:error.message}));}
});
$('sheet').addEventListener('cancel',event=>{event.preventDefault();closeSheet();});
window.addEventListener('hashchange',()=>{
  const next=location.hash.slice(1);
  if(['ottelu','pelaajat','tilastot','ottelut'].includes(next))navigate(next);
});
window.addEventListener('storage',event=>{
  if(event.key!==STORAGE_KEY&&event.key!==null)return;
  if(hasDraft()){recordConflict(event.newValue);return;}
  adoptExternal(event.newValue);
});
document.addEventListener('visibilitychange',()=>{
  if(document.visibilityState==='visible'&&state.start!==null){wakeLock=null;requestWakeLock();}
});
setInterval(()=>{
  const time=elapsed(state);
  if(state.start!==null&&time>=state.periodLength){
    if(mutate(next=>{next.seconds=state.periodLength;next.start=null;})){releaseWakeLock();notify(tr('{period}. erä päättynyt.',{period:state.period}));}
  }
  if($('clock'))$('clock').textContent=formatTime(state.periodLength-time);
},250);

render();
if(startupError)storageProblem(unreadableRaw!==null?tr('Aiemman tallennuksen lukeminen epäonnistui. Alkuperäiset tiedot ovat tallella. Vie varmuuskopio valikosta. {error}',{error:startupError}):startupError);
setupPWA({
  canReload:()=>state.start===null&&!hasDraft(),
  onStatus(info){
    pwaStatus=info;
    const label=info.offlineReady?(info.online?tr("Valmis myös offlineen"):tr("Offline · tallennus laitteelle")):tr("Tallennus laitteelle");
    $('connection-label').textContent=label;
    $('connection-status').title=info.message;
    $('connection-status').classList.toggle('warning',!info.offlineReady);
    if($('offline-description'))$('offline-description').textContent=info.message;
  },
  onUpdate(update){
    updateAction=update.apply;
    $('update-banner').dataset.version=update.version;
    $('update-banner').innerHTML=`<span>${tr('Uusi versio {version} on valmis.',{version:escapeHTML(update.version)})}</span><button type="button" data-action="apply-update">${tr("Päivitä sovellus")}</button>`;
    $('update-banner').hidden=false;
  }
});
// Application ready.
