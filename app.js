import { VERSION, createGame, normalizeState, elapsed, elapsedPrecise, formatTime, score, teamStats,
  playerStats, periodStats, archiveAndNew, openArchive, validateEvent,
  normalizeNumber, nextPeriod, snapshot } from './model.js?v=0.6.3';
import { setupPWA, checkForUpdate } from './pwa.js?v=0.6.3';
import { textReport, createPoster } from './reports.js?v=0.6.3';

const STORAGE_KEY = 'ke-match-v1';
const $ = id => document.getElementById(id);
const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, char => ({
  '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'
}[char]));
const clone = value => JSON.parse(JSON.stringify(value));
const paths = {
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
  trash:'<path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7M14 10v7"/>',
  new:'<path d="M6 3h9l4 4v14H6V3ZM15 3v5h4M9 14h7M12.5 10.5v7"/>',
  wifi:'<path d="M3 9a14 14 0 0 1 18 0M6 12a9 9 0 0 1 12 0M9 15a4 4 0 0 1 6 0M12 19h.01"/>',
  refresh:'<path d="M20 7v5h-5M4 17v-5h5M5 8a8 8 0 0 1 14-3l1 7M4 12l1 7a8 8 0 0 0 14-3"/>',
  lock:'<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V6a4 4 0 0 1 8 0v4M12 14v3"/>'
};
const icon = (name, extra='') => `<svg ${extra} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">${paths[name] || paths.info}</svg>`;
const eventIcon = type => type === 'Maali' ? 'goal' : type === 'Torjunta' ? 'save' : type === 'Jäähy' ? 'penalty' : 'rink';
const eventClass = type => type === 'Maali' ? 'goal' : type === 'Torjunta' ? 'save' : type === 'Jäähy' ? 'penalty' : '';
const teamLabel = team => team === 'home' ? 'Kotijoukkue' : 'Vierasjoukkue';

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
} catch { startupError = 'Selaimen tallennustila ei ole käytettävissä.'; }
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

function hasDraft() {
  return $('sheet').open || Boolean($('player-number')?.value || $('player-name')?.value);
}
function recordConflict(raw) {
  externalConflict = {raw};
  $('storage-banner').innerHTML = 'Ottelua muutettiin toisessa ikkunassa. Lataa uudemmat tiedot ennen seuraavaa kirjausta. <button type="button" class="button" data-action="sync-storage">Lataa uudemmat tiedot</button>';
  $('storage-banner').hidden = false;
  if($('sheet').open) formError('Ottelu muuttui toisessa ikkunassa. Tätä lomaketta ei tallennettu. Sulje lomake, jotta uudemmat tiedot ladataan.');
}
function adoptExternal(raw) {
  externalConflict=null;
  lastStoredRaw=raw;
  try {
    const next=raw===null?createGame():normalizeState(JSON.parse(raw));
    state=next;unreadableRaw=null;
    $('storage-banner').hidden=true;
    render();
    notify('Uudemmat ottelutiedot ladattu.');
  }catch(error){unreadableRaw=raw;storageProblem('Toisen ikkunan tallennusta ei voitu lukea. Alkuperäiset tiedot voi viedä valikon varmuuskopiolla.');}
}

function storageProblem(message) {
  $('storage-banner').textContent = message;
  $('storage-banner').hidden = false;
}
function persist(next) {
  if (unreadableRaw !== null) {
    storageProblem('Aiemman tallennuksen lukeminen epäonnistui. Alkuperäiset tiedot ovat tallella. Vie ne valikon varmuuskopiolla ennen tietojen palautusta.');
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
    storageProblem('Tallennus ei onnistunut. Kirjausta ei lisätty. Tarkista laitteen vapaa tila ja vie otteluista varmuuskopio.');
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
  $('toast').innerHTML = `<span>${escapeHTML(message)}</span>${undo ? '<button type="button" data-action="undo">Kumoa</button>' : ''}`;
  $('toast').hidden = false;
  toastTimer = setTimeout(() => { $('toast').hidden = true; undoAction = null; }, undo ? 9000 : 4200);
}
function jerseyName(n, team, game=state) {
  if (n === '' || n === null || n === undefined) return '';
  const player = game.roster.find(p => p.n === String(n) && (p.team || 'home') === team);
  return `#${n}${player?.name ? ' ' + player.name : ''}`;
}
function dateLabel(game, long=false) {
  if (!game.date || Number.isNaN(new Date(game.date).getTime())) return 'Ottelupäivä puuttuu';
  return new Intl.DateTimeFormat('fi-FI', { day:'numeric', month:long?'long':'numeric', year:'numeric' }).format(new Date(game.date));
}
function empty(iconName, title, description) {
  return `<div class="empty-state"><div class="empty-illustration">${icon(iconName)}</div><h3>${escapeHTML(title)}</h3><p>${escapeHTML(description)}</p></div>`;
}
function heading(title, description, action='') {
  return `<div class="page-heading"><div><h1>${title}</h1><p class="heading-label">${escapeHTML(description)}</p></div>${action ? `<div class="heading-actions">${action}</div>` : ''}</div>`;
}
const newButton = () => `<button class="button" data-action="new-game">${icon('new')}Uusi ottelu</button>`;

function render() {
  const views = { ottelu:renderLive, pelaajat:renderRoster, tilastot:renderStats, ottelut:renderArchives };
  $('main').innerHTML = `<div>${views[view]()}</div>`;
  $('navigation').innerHTML = [['ottelu','rink','Ottelu'],['pelaajat','people','Pelaajat'],['tilastot','chart','Tilastot'],['ottelut','archive','Ottelut']].map(([id,i,label]) =>
    `<a class="nav-item${view===id?' active':''}" href="#${id}" ${view===id?'aria-current="page"':''}>${icon(i)}<span>${label}</span></a>`).join('');
}
function teamCrest(team, game=state) {
  const isEspoo = /kiekko[\s-]?espoo|^k[ -]?espoo$/i.test(game[team]);
  return isEspoo ? '<div class="team-crest"><img src="./assets/club-logo.svg" alt="" width="55" height="55"></div>' :
    `<div class="team-crest opponent-crest" aria-hidden="true">${escapeHTML(game[team].replace(/[^\p{L}\p{N}]/gu,'').slice(0,2).toUpperCase() || 'V')}</div>`;
}
function renderLive() {
  const tally = score(state), stats = teamStats(state), played = elapsed(state);
  const running = state.start !== null;
  const ended = played >= state.periodLength;
  const status = state.finished ? 'Ottelu päättynyt' : running ? 'Peli käynnissä' : ended ? 'Erä päättynyt' : played || state.events.length ? 'Kello pysäytetty' : 'Valmiina peliin';
  const clockAction = state.finished ? 'Jatka ottelua' : ended ? 'Seuraava erä' : running ? 'Pysäytä' : played ? 'Jatka erää' : 'Aloita erä';
  const events = state.events.slice().sort((a,b) => b.period-a.period || b.time-a.time || state.events.indexOf(b)-state.events.indexOf(a));
  const visible = viewAllEvents ? events : events.slice(0,7);
  return `${heading('Ottelu',dateLabel(state,true),newButton())}
    <div class="live-layout"><div class="live-left">
      <section class="scoreboard" aria-label="Tulostaulu">
        <div class="board-top"><span class="match-state ${running?'running':''}" id="match-state"><span class="status-dot"></span>${status}</span><button class="icon-button board-settings" data-action="match-settings" aria-label="Ottelun ja kellon asetukset">${icon('settings')}</button></div>
        <div class="scoreline"><div class="team-block">${teamCrest('home')}<div class="team-name">${escapeHTML(state.home)}</div><div class="team-role">Koti</div></div>
          <div class="score-digits" aria-label="Tulos ${tally.home}–${tally.away}"><span class="score-number" data-score="home">${tally.home}</span><span class="score-divider">:</span><span class="score-number" data-score="away">${tally.away}</span></div>
          <div class="team-block">${teamCrest('away')}<div class="team-name">${escapeHTML(state.away)}</div><div class="team-role">Vieras</div></div></div>
        <div class="clock-strip"><div class="clock-info"><div class="period-tag"><b>${state.period}. erä</b>${formatTime(state.periodLength)}</div><div class="clock-value" id="clock" aria-label="Aikaa jäljellä">${formatTime(state.periodLength-played)}</div></div>
          <button class="clock-button ${running?'is-running':''}" data-action="${state.finished?'reopen-game':ended?'next-period':'toggle-clock'}" id="clock-toggle">${icon(running?'pause':'play')}${clockAction}</button></div>
        <div class="board-stats"><span class="board-stat"><abbr title="Laukaukset maalia kohti">Laukaukset maalia kohti</abbr><strong data-stat="shots">${stats.home.shots} – ${stats.away.shots}</strong></span><span class="board-stat">Torjunnat <strong data-stat="saves">${stats.home.saves} – ${stats.away.saves}</strong></span></div>
      </section>
      <section class="action-section" aria-labelledby="actions-title"><div class="section-heading"><h2 id="actions-title">Kirjaa tapahtuma</h2><span class="eyebrow">Yksi tilanne, yksi kirjaus</span></div>
        <div class="action-grid">${[['Maali','goal'],['Torjunta','save'],['Jäähy','penalty']].map(([name,i])=>`<button class="event-action ${i}" data-action="event" data-type="${name}">${icon(i)}<span class="action-label">${name}${icon('arrow')}</span></button>`).join('')}</div>
        <p class="action-hint">${icon('info')}Maali ja torjunta päivittävät laukaukset automaattisesti.</p>
      </section>
      <div class="live-note">${icon('people')}<div><b>Numerolla nopeasti, nimellä myöhemminkin.</b>Lisää kokoonpano Pelaajat-välilehdellä. Voit kirjata tapahtuman myös ilman pelaajatietoja.</div></div>
    </div><div class="live-right">
      <section class="panel event-panel"><div class="panel-heading"><h2>Tapahtumat</h2><span class="count-badge" aria-label="${state.events.length} tapahtumaa">${state.events.length}</span></div>
        ${visible.length ? `<ol class="event-list">${visible.map(e=>eventRow(e)).join('')}</ol>` : empty('rink','Tästä se alkaa.','Aloita kello ja kirjaa kentän tapahtumat. Ottelun tarina rakentuu tähän.')}
        ${events.length>7 ? `<div class="event-panel-footer"><button class="text-button" data-action="all-events">${viewAllEvents?'Näytä viimeisimmät':'Näytä kaikki '+events.length+' tapahtumaa'}${icon('arrow')}</button></div>` : ''}
      </section>
      <div class="view-footer"><span>${icon('lock')}Tallennetaan tälle laitteelle</span><span>Tapahtumissa kulunut peliaika</span></div>
    </div></div>`;
}
function eventRow(event, game=state, editable=true) {
  const player = jerseyName(event.n,event.team,game);
  const title = event.type === 'Laukaus' ? 'Laukausyritys' : event.type;
  const details = event.type === 'Jäähy' ? [event.penaltyLabel || `${event.minutes} min`,event.reason].filter(Boolean).join(' · ') :
    event.assists?.length ? 'Syötöt: '+event.assists.map(n=>jerseyName(n,event.team,game)).join(', ') : '';
  return `<li class="event-row"><div class="event-time">${formatTime(event.time)}<small>${event.period}. ERÄ</small></div><div class="event-symbol ${eventClass(event.type)}">${icon(eventIcon(event.type))}</div><div class="event-body"><div class="event-title">${escapeHTML(title)}${player?` <span>${escapeHTML(player)}</span>`:''}</div><div class="event-subtitle">${escapeHTML(game[event.team])}</div>${details?`<div class="event-meta">${escapeHTML(details)}</div>`:''}${event.detail?`<div class="event-meta">${escapeHTML(event.detail)}</div>`:''}${event.type==='Laukaus'?'<div class="event-meta">Vanha kirjaus · ei sisälly laukauksiin maalia kohti</div>':''}</div>${editable?`<button class="event-edit" data-action="edit-event" data-id="${escapeHTML(event.id)}" aria-label="Muokkaa: ${escapeHTML(title)}, ${formatTime(event.time)}, ${escapeHTML(game[event.team])}">${icon('edit')}</button>`:''}</li>`;
}
function teamTabs(selected, action) {
  return `<div class="tabs" role="group" aria-label="Joukkue">${['home','away'].map(t=>`<button class="tab-button ${selected===t?'active':''}" data-action="${action}" data-team="${t}" aria-pressed="${selected===t}">${escapeHTML(state[t])}</button>`).join('')}</div>`;
}
function renderRoster() {
  const roster = state.roster.filter(p=>p.team===rosterTeam).sort((a,b)=>Number(a.n)-Number(b.n));
  return `${heading('Pelaajat','Tämän ottelun kokoonpano',`<span class="count-badge">${state.roster.length}</span>`)}<div class="two-column"><section class="panel content-panel">${teamTabs(rosterTeam,'roster-team')}
    <form id="add-player-form" class="inline-form"><label class="field" for="player-number">Numero<input id="player-number" name="n" inputmode="numeric" pattern="[0-9]{1,2}" maxlength="2" placeholder="00" required autocomplete="off"></label><label class="field" for="player-name">Sukunimi<input id="player-name" name="name" placeholder="Valinnainen" maxlength="60" autocomplete="off"></label><button class="button primary" type="submit">Lisää</button></form>
    <p class="roster-info">Pelkkä numero riittää. Nimen voi lisätä nyt tai myöhemmin pelaajaa napauttamalla.</p><div id="roster-error" class="form-error" role="alert" hidden></div>
    ${roster.length?`<div class="roster-grid">${roster.map(p=>`<button class="roster-player" data-action="edit-player" data-number="${p.n}" data-team="${rosterTeam}" aria-label="Muokkaa pelaajaa ${escapeHTML(jerseyName(p.n,rosterTeam))}"><span class="roster-number">${p.n}</span><span class="roster-name">${escapeHTML(p.name||'Lisää nimi')}<small>${p.name?'Pelaaja':'Nimi puuttuu'}</small></span></button>`).join('')}</div>`:empty('people','Ketkä pelaavat tänään?','Lisää joukkueen pelaajanumerot. Saat niistä nopeat valintapainikkeet tapahtumiin.')}
    </section><section class="panel content-panel"><div class="section-heading"><h2>Valmiina ennen aloitusta</h2></div><div class="info-list"><div class="info-item">${icon('people')}<div><strong>Molempien joukkueiden pelaajat</strong>Vaihda joukkuetta yläreunan valinnasta. Sama numero voi olla kummassakin joukkueessa.</div></div><div class="info-item">${icon('goal')}<div><strong>Voit täydentää myös pelin aikana</strong>Tapahtumaan kirjoitettu uusi numero lisätään tämän ottelun kokoonpanoon automaattisesti.</div></div><div class="info-item">${icon('new')}<div><strong>Uusi peli, uusi kokoonpano</strong>Valitse uudelle ottelulle EKS-kokoonpano tai aloita tyhjillä pelaajalistoilla. Aiempien ottelujen tiedot säilyvät arkistossa.</div></div></div></section></div>`;
}
function comparison(label, a, b) {
  const total = a+b || 2;
  return `<div class="comparison-row"><strong class="comparison-number">${a}</strong><div><div class="comparison-label">${label}</div><div class="comparison-bars" aria-hidden="true"><span style="width:${(a+b?a:1)/total*100}%"></span><span style="width:${(a+b?b:1)/total*100}%"></span></div></div><strong class="comparison-number">${b}</strong></div>`;
}
function renderStats() {
  const stats = teamStats(state), players = playerStats(state,statsTeam), periods = periodStats(state);
  return `${heading('Tilastot','Jokainen kirjaus näkyy tässä.')}<div class="two-column"><div><section class="panel stats-overview"><div class="comparison-head"><span>${escapeHTML(state.home)}</span><span>${escapeHTML(state.away)}</span></div>
    ${comparison('Maalit',stats.home.goals,stats.away.goals)}${comparison('Laukaukset maalia kohti',stats.home.shots,stats.away.shots)}${comparison('Torjunnat',stats.home.saves,stats.away.saves)}${comparison('Rangaistusminuutit',stats.home.penaltyMinutes,stats.away.penaltyMinutes)}
    <table class="period-table"><caption class="sr-only">Maalit erissä</caption><thead><tr><th>Erä</th><th>${escapeHTML(state.home)}</th><th>${escapeHTML(state.away)}</th></tr></thead><tbody>${periods.map(p=>`<tr><td>${p.period}. erä</td><td>${p.home}</td><td>${p.away}</td></tr>`).join('')}</tbody></table>
    <p class="table-legend">Laukaukset maalia kohti = omat maalit + vastustajan torjunnat. Ohi menneitä tai blokattuja yrityksiä ei lasketa mukaan.</p></section>
    <section class="export-card"><h3>Ottelun tarina talteen.</h3><p>Jaa siisti ottelukuva tai vie koko tapahtumalista tekstinä.</p><div class="export-actions"><button class="button" data-action="poster">${icon('image')}Ottelukuva</button><button class="button" data-action="report">${icon('text')}Tekstikooste</button></div></section></div>
    <section class="panel content-panel"><div class="section-heading"><h2>Pelaajatilastot</h2></div>${teamTabs(statsTeam,'stats-team')}${players.length?`<div class="table-scroll"><table class="player-table"><caption class="sr-only">${escapeHTML(state[statsTeam])}: pelaajatilastot</caption><thead><tr><th>Pelaaja</th><th><abbr title="Maalit">M</abbr></th><th><abbr title="Syötöt">S</abbr></th><th><abbr title="Pisteet">P</abbr></th><th><abbr title="Torjunnat">T</abbr></th><th><abbr title="Jäähyminuutit">JM</abbr></th></tr></thead><tbody>${players.map(p=>`<tr><td><span class="table-player"><b>${p.n}</b>${escapeHTML(p.name||'—')}</span></td><td>${p.goals}</td><td>${p.assists}</td><td>${p.points}</td><td>${p.saves}</td><td>${p.penaltyMinutes}</td></tr>`).join('')}</tbody></table></div><p class="table-legend">M = maalit · S = syötöt · P = pisteet<br>T = torjunnat · JM = jäähyminuutit</p>`:empty('chart','Numerot kertovat pelistä.','Lisää pelaajat kokoonpanoon tai merkitse numero tapahtuman yhteydessä. Tilastot kertyvät automaattisesti.')}</section></div>`;
}
function archiveCard(game,current=false) {
  const goals = score(game);
  return `<button class="archive-card${current?' current':''}" data-action="${current?'go-live':'archive-detail'}" ${current?'':`data-id="${escapeHTML(game.id)}"`}><div class="archive-symbol">${icon(current?'rink':'archive')}</div><div class="archive-main"><h3>${escapeHTML(game.home)} – ${escapeHTML(game.away)}</h3><p>${current?'Nykyinen ottelu · ':''}${dateLabel(game)} · ${game.events.length} tapahtumaa</p></div><strong class="archive-score">${goals.home}–${goals.away}</strong>${icon('arrow')}</button>`;
}
function renderArchives() {
  return `${heading('Ottelut','Pelit vaihtuvat. Muistot säilyvät.',newButton())}<div class="two-column"><section><div class="section-heading"><h2>Nykyinen ottelu</h2></div>${archiveCard(state,true)}<div class="section-heading" style="margin-top:27px"><h2>Otteluarkisto</h2><span class="count-badge">${state.archive.length}</span></div><div class="archive-list">${state.archive.length?state.archive.slice().reverse().map(g=>archiveCard(g)).join(''):`<div class="panel">${empty('archive','Ensimmäinen peli odottaa vielä.','Kun aloitat uuden ottelun, nykyinen siirtyy tänne automaattisesti.')}</div>`}</div></section>
    <section class="panel content-panel"><div class="section-heading"><h2>Ota pelit talteen</h2>${icon('lock')}</div><p class="roster-info">Ottelut tallentuvat tämän laitteen selaimeen. Varmuuskopiolla voit siirtää kaikki ottelut toiseen laitteeseen tai palauttaa ne myöhemmin.</p><div class="stack"><button class="button primary wide" data-action="backup">${icon('download')}Vie kaikkien ottelujen varmuuskopio</button><button class="button wide" data-action="restore">${icon('upload')}Palauta varmuuskopio</button><p class="field-note">Selaimen sivustotietojen poistaminen poistaa myös paikalliset ottelut. Tallennetut varmuuskopiot säilyvät erillisinä tiedostoina.</p></div></section></div>`;
}

function openSheet(title, subtitle, body, footer='', formId='', preservePosition=false) {
  const scrollTop=preservePosition?$('sheet').scrollTop:0;
  const active=preservePosition?document.activeElement:null;
  const focusSelector=active?.id?'#'+CSS.escape(active.id):active?.dataset.action?`[data-action="${CSS.escape(active.dataset.action)}"]${active.dataset.number!==undefined?`[data-number="${CSS.escape(active.dataset.number)}"]`:''}`:null;
  const token=++sheetToken;
  $('sheet-content').innerHTML = `${formId?`<form id="${formId}">`:''}<div class="sheet-header"><div><h2 id="sheet-title">${escapeHTML(title)}</h2>${subtitle?`<p>${escapeHTML(subtitle)}</p>`:''}</div><button class="icon-button" type="button" data-action="close-sheet" aria-label="Sulje">${icon('close')}</button></div><div class="sheet-body">${body}<div id="sheet-error" class="form-error" role="alert" hidden></div></div>${footer?`<div class="sheet-footer">${footer}</div>`:''}${formId?'</form>':''}`;
  if (!$('sheet').open) $('sheet').showModal();
  if(focusSelector) $('sheet').querySelector(focusSelector)?.focus({preventScroll:true});
  $('sheet').scrollTop = scrollTop;
  return token;
}
function closeSheet() {
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
function askConfirm(title, body, action, label='Vahvista', danger=false) {
  pending = null;
  confirmAction = action;
  openSheet(title,'',`<p class="small muted" style="line-height:1.9">${escapeHTML(body)}</p>`,
    `<button type="button" class="button quiet" data-action="close-sheet">Peruuta</button><button type="button" class="button ${danger?'danger':'primary'}" data-action="confirm">${escapeHTML(label)}</button>`);
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
  const subtitle = `${p.period}. erä · kellossa ${formatTime(Math.max(0,state.periodLength-p.time))}${p._editing?' · muokkaus':''}`;
  if (!p.team) {
    const question = p.type==='Torjunta'?'Kumpi joukkue torjui?':p.type==='Maali'?'Kumpi joukkue teki maalin?':'Kummalle joukkueelle jäähy?';
    openSheet(p.type,subtitle,`<div class="sheet-step"><span>01 Joukkue</span>${icon('arrow')}<span>02 Pelaaja ja tiedot</span></div><h3 style="margin-bottom:16px">${question}</h3><div class="choice-grid">${['home','away'].map(t=>`<button type="button" class="choice" data-action="event-team" data-team="${t}">${escapeHTML(state[t])}<small>${teamLabel(t)}</small></button>`).join('')}</div>${p.type==='Torjunta'?'<p class="assist-help">Valitse torjuneen maalivahdin joukkue. Vastustajalle lisätään samalla laukaus maalia kohti.</p>':''}`);
    return;
  }
  const roster = state.roster.filter(player=>player.team===p.team).sort((a,b)=>Number(a.n)-Number(b.n));
  const unknownSelected = p.n!=='' && !roster.some(player=>player.n===p.n);
  const numbers = [...roster,...(unknownSelected?[{n:p.n,name:''}]:[])];
  const role = p.type==='Maali'?'Maalintekijä':p.type==='Torjunta'?'Maalivahti':'Pelaaja';
  let body = `<div class="sheet-team-line"><div><strong>${escapeHTML(state[p.team])}</strong><br><span>${teamLabel(p.team)}</span></div><button class="text-button" type="button" data-action="change-event-team">Vaihda joukkuetta</button></div><div class="sheet-section"><div class="field-heading">${role}<span>Valinnainen</span></div>
    ${numbers.length?`<div class="number-grid">${numbers.map(player=>`<button type="button" class="number-chip ${p.n===player.n?'selected':''}" data-action="pick-player" data-number="${player.n}" aria-pressed="${p.n===player.n}" aria-label="${escapeHTML(jerseyName(player.n,p.team)||'#'+player.n)}"><b>${player.n}</b><small>${escapeHTML(player.name||'Numero')}</small></button>`).join('')}</div>`:''}
    <div class="manual-entry"><label class="field" for="manual-number"><span class="sr-only">${role}, numero</span><input id="manual-number" inputmode="numeric" pattern="[0-9]{1,2}" maxlength="2" placeholder="${numbers.length?'Muu numero':'Pelaajan numero, 0–99'}" value="${escapeHTML(p._manualNumber||'')}" autocomplete="off"></label><button type="button" class="button" data-action="manual-player">Valitse</button></div>
    ${p.n!==''?`<p class="selected-summary">${icon('check')}${escapeHTML(jerseyName(p.n,p.team)||'#'+p.n)}<button type="button" data-action="clear-player" aria-label="Poista pelaajavalinta">${icon('close')}</button></p>`:'<p class="assist-help">Numeron voi täydentää myöhemmin tapahtumaa muokkaamalla.</p>'}</div>`;
  if(p.type==='Maali') {
    const assistRoster = [...roster,...p.assists.filter(n=>!roster.some(player=>player.n===n)).map(n=>({n,name:''}))].filter(player=>player.n!==p.n);
    body += `<div class="sheet-section"><div class="field-heading">Syöttäjät<span>${p.assists.length} / 2</span></div>${assistRoster.length?`<div class="number-grid">${assistRoster.map(player=>`<button class="number-chip assist ${p.assists.includes(player.n)?'selected':''}" type="button" data-action="pick-assist" data-number="${player.n}" aria-pressed="${p.assists.includes(player.n)}" aria-label="Syöttäjä ${escapeHTML(jerseyName(player.n,p.team)||'#'+player.n)}"><b>${player.n}</b><small>${escapeHTML(player.name||'Numero')}</small></button>`).join('')}</div>`:''}<div class="manual-entry"><label class="field" for="manual-assist"><span class="sr-only">Syöttäjän numero</span><input id="manual-assist" inputmode="numeric" pattern="[0-9]{1,2}" maxlength="2" placeholder="Syöttäjän numero" value="${escapeHTML(p._manualAssist||'')}" autocomplete="off"></label><button type="button" class="button" data-action="manual-assist">Valitse</button></div><p class="assist-help">${p.assists.length?'Valittu: '+escapeHTML(p.assists.map(n=>jerseyName(n,p.team)||'#'+n).join(', ')):'Jätä tyhjäksi, jos maali syntyi ilman syöttöä.'}</p></div>`;
  }
  if(p.type==='Jäähy') {
    const reasons = p.reason && !penaltyReasons.includes(p.reason) ? [p.reason,...penaltyReasons] : penaltyReasons;
    body += `<div class="sheet-section stack"><label class="field" for="penalty-reason">Jäähyn syy<select id="penalty-reason" data-pending="reason"><option value="">Valitse rike</option>${reasons.map(reason=>`<option ${reason===p.reason?'selected':''}>${escapeHTML(reason)}</option>`).join('')}</select></label><label class="field" for="penalty-type">Rangaistus<select id="penalty-type" data-pending="penaltyType">${penaltyTypes.map(t=>`<option value="${t.id}" ${p.penaltyType===t.id?'selected':''}>${escapeHTML(t.label)}</option>`).join('')}</select></label>${p.penaltyType==='custom'?`<div class="form-grid"><label class="field" for="penalty-minutes">Minuutit<input id="penalty-minutes" type="number" inputmode="numeric" min="0" max="1000" value="${Number(p.minutes)||0}" data-pending="minutes"></label><label class="field" for="penalty-label">Rangaistuksen nimi<input id="penalty-label" maxlength="100" value="${escapeHTML(p.penaltyLabel||'')}" data-pending="penaltyLabel"></label></div>`:''}<label class="field" for="penalty-detail">Tarkennus <small>Valinnainen</small><input id="penalty-detail" maxlength="240" placeholder="Esim. jäähyn kärsivä pelaaja" value="${escapeHTML(p.detail||'')}" data-pending="detail"></label></div>`;
  }
  body += `<details class="sheet-section" style="margin-top:22px"><summary class="small muted" style="cursor:pointer;padding:8px 0">Korjaa tapahtuma-aikaa</summary><div class="form-grid" style="margin-top:12px"><label class="field" for="event-period">Erä<input id="event-period" type="number" inputmode="numeric" min="1" max="1000" value="${p.period}" data-pending="period"></label><label class="field" for="event-time">Kulunut eräaika<input id="event-time" inputmode="numeric" value="${formatTime(p.time)}" placeholder="mm:ss" data-pending="time"></label></div><p class="event-time-note">Aikaleima otetaan tapahtumapainikkeen painalluksesta. Tässä näkyy kulunut eräaika; tulostaulun kello laskee alaspäin.</p></details>`;
  openSheet(p._editing?'Muokkaa: '+p.type:p.type,subtitle,body,`${p._editing?`<button type="button" class="button danger" data-action="delete-event" data-id="${escapeHTML(p.id)}" aria-label="Poista tapahtuma">${icon('trash')}</button>`:'<button type="button" class="button quiet" data-action="close-sheet">Peruuta</button>'}<button type="submit" class="button primary" id="save-event">${icon('check')}${p._editing?'Tallenna muutokset':'Tallenna '+p.type.toLowerCase()}</button>`,'event-form',preservePosition);
}

function pickPlayer(number) {
  const n = normalizeNumber(number);
  if(n==='') throw new Error('Anna pelaajan numero väliltä 0–99.');
  pending.n = pending.n===n?'':n;
  pending._manualNumber='';
  pending.assists = pending.assists.filter(a=>a!==pending.n);
  drawEvent(true);
}
function pickAssist(number) {
  const n = normalizeNumber(number);
  if(n==='') throw new Error('Anna syöttäjän numero väliltä 0–99.');
  if(n===pending.n) throw new Error('Maalintekijä ei voi olla myös syöttäjä.');
  if(pending.assists.includes(n)) pending.assists=pending.assists.filter(a=>a!==n);
  else if(pending.assists.length<2) pending.assists.push(n);
  else throw new Error('Maalille voi valita enintään kaksi syöttäjää.');
  pending._manualAssist='';
  drawEvent(true);
}
function parseTime(value) {
  if(!/^\d{1,4}:[0-5]\d$/.test(String(value).trim())) throw new Error('Anna aika muodossa mm:ss, esimerkiksi 12:30.');
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
  if(!persist(next)) { if(!externalConflict)formError('Kirjausta ei voitu tallentaa. Tarkista ilmoitus sivun yläreunassa.'); return; }
  closeSheet();
  render();
  notify(`${event.type} ${previous?'päivitetty':'tallennettu'} · ${state[event.team]}`,()=>{
    if(state.id!==gameId) return notify('Ottelu vaihtui. Muokkaa kirjausta otteluarkiston kautta.');
    mutate(s=>{const i=s.events.findIndex(e=>e.id===event.id);if(i>=0){if(previous)s.events[i]=previous;else s.events.splice(i,1);}});
  });
}

const ROSTER_CACHE='kiekkokirjuri-rosters-v1';
function validateRoster(raw){if(raw.schema!==1||!Array.isArray(raw.teams)||typeof raw.event!=="string"||typeof raw.updated!=="string"||typeof raw.opponent!=="string"||!["home","away"].includes(raw.side))throw Error("Virheellinen kokoonpanotiedosto");let ids=new Set();for(const t of raw.teams){if(!/^[a-z0-9-]+$/.test(t.id)||ids.has(t.id)||typeof t.name!=="string"||!Array.isArray(t.players))throw Error("Virheellinen ryhmä");ids.add(t.id);let ns=new Set();for(const p of t.players){if(!Array.isArray(p)||p.length!==2||!Number.isInteger(p[0])||p[0]<0||p[0]>99||ns.has(p[0])||typeof p[1]!=="string"||!p[1].trim()||p[1].length>60)throw Error("Virheellinen tai toistuva pelaajanumero");ns.add(p[0])}}return raw}
let rosterPresets=validateRoster({"schema":1,"event":"GrIFK – EKS","updated":"2026-11-26","opponent":"GrIFK","side":"away","teams":[{"id":"blue","name":"Blue","players":[[58,"Honkimaa"],[15,"Haho"],[26,"Jantunen"],[14,"Niemelä"],[19,"Pekkarinen"],[64,"Laurila"]]},{"id":"white","name":"White","players":[[61,"Koponen"],[11,"Schlosser"],[28,"Kipinä"],[24,"Kniazev"],[18,"Suokko"],[98,"Alho"],[88,"Pyykkö"]]},{"id":"yellow","name":"Yellow","players":[[17,"Hannonen"],[28,"Lehto"],[12,"Nylund"],[36,"Rämä"],[18,"Tapioharju"],[91,"Luukkanen"],[66,"Heikel"]]}]});
let rosterSource='Asennettu offline-kokoonpano';
try {const raw=localStorage.getItem(ROSTER_CACHE);if(raw){const saved=validateRoster(JSON.parse(raw));if(saved.updated>=rosterPresets.updated){rosterPresets=saved;rosterSource='Tallennettu kopio';}}}catch{}
let rosterRefresh=null;
async function refreshRosterPresets(){if(!navigator.onLine)return;if(rosterRefresh)return rosterRefresh;rosterRefresh=(async()=>{
  const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),3500);
  try{const response=await fetch('./rosters.json',{cache:'no-store',signal:controller.signal});if(!response.ok)throw Error('Kokoonpano ei saatavilla');const data=validateRoster(await response.json());if(data.updated<rosterPresets.updated)return;rosterPresets=data;rosterSource='Verkosta tarkistettu';try{localStorage.setItem(ROSTER_CACHE,JSON.stringify(data))}catch{}}
  catch{rosterSource=rosterPresets?'Tallennettu kopio · tarkista ajantasaisuus':'Kokoonpanoa ei saatu ladattua';}
  finally{clearTimeout(timer);}
})();try{await rosterRefresh}finally{rosterRefresh=null;}
}
function rosterOptions(data){return '<option value="">Tyhjä kokoonpano / käsin</option>'+(data?.teams||[]).map(t=>'<option value="'+escapeHTML(t.id)+'">EKS '+escapeHTML(t.name)+' · '+t.players.length+' pelaajaa</option>').join('')}
function wireRosterForm(){
  const form=$('new-game-form');if(!form)return;
  let data=rosterPresets;const select=$('roster-preset'),side=$('roster-side'),preview=$('roster-preview'),status=$('roster-status');
  form.rosterSnapshot=data;
  function statusText(){status.textContent=data?data.event+' · '+data.updated+' · '+rosterSource:rosterSource||'Tarkistetaan kokoonpanoja…'}
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
  openSheet('Uusi ottelu','Uusi peli, puhdas tulostaulu.',`<div class="stack"><div class="helper-box"><label class="field" for="roster-preset">EKS:n kokoonpano<select id="roster-preset" name="preset"></select></label><p class="field-note" id="roster-status"></p><label class="field" for="roster-side" style="margin-top:12px">EKS pelaa<select id="roster-side" name="presetSide" disabled><option value="home">Kotijoukkueena</option><option value="away">Vierasjoukkueena</option></select></label><div id="roster-preview" class="roster-preview"></div></div><label class="field" for="new-home">Kotijoukkue<input id="new-home" name="home" value="${escapeHTML(state.home)}" maxlength="60" required></label><label class="field" for="new-away">Vierasjoukkue<input id="new-away" name="away" placeholder="Vastustajan nimi" maxlength="60"></label><div class="form-grid"><label class="field" for="new-length">Erän pituus, min<input id="new-length" name="length" type="number" inputmode="numeric" min="1" max="60" value="${state.periodLength/60}" required></label><label class="field" for="new-date">Ottelupäivä<input id="new-date" name="date" type="date" value="${localDate()}" required></label></div><div class="helper-box"><strong>Nykyinen ottelu siirtyy arkistoon.</strong><br>Uuden ottelun tulos ja tapahtumat nollautuvat. Valittu EKS-kokoonpano kopioidaan uuteen otteluun; vastustajan pelaajat lisätään tarvittaessa käsin.</div></div>`,
    '<button class="button quiet" type="button" data-action="close-sheet">Peruuta</button><button class="button primary" type="submit">Luo ottelu</button>','new-game-form');
  wireRosterForm();
}
function localDate() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
}
function submitNewGame(form) {
  const data = new FormData(form);
  const minutes = Number(data.get('length'));
  if(!Number.isInteger(minutes)||minutes<1||minutes>60) throw new Error('Valitse erän pituus väliltä 1–60 minuuttia.');
  const hasContent = state.events.length || state.roster.length || elapsedPrecise(state) || state.start!==null || state.period>1 || state.away!=='Vastustaja' || state.notes || state.detail || state.title;
  const next = hasContent ? archiveAndNew({...state,finished:true}) : {...createGame(),archive:clone(state.archive)};
  next.home = String(data.get('home')).trim() || 'Kiekko-Espoo';
  next.away = String(data.get('away')).trim() || 'Vastustaja';
  next.periodLength = minutes*60;
  next.date = new Date(String(data.get('date'))+'T12:00:00').toISOString();
  next.configured = true;
  const presetId=String(data.get('preset')||'');
  if(presetId){const preset=form.rosterSnapshot?.teams.find(t=>t.id===presetId);const side=String(data.get('presetSide'));if(!preset||!['home','away'].includes(side))throw new Error('Valitse kokoonpano uudelleen.');next.roster=preset.players.map(([n,name])=>({n:String(n),name,team:side}));next.rosterPreset={event:form.rosterSnapshot.event,updated:form.rosterSnapshot.updated,id:preset.id};}
  if(!persist(next)) return formError('Uutta ottelua ei voitu tallentaa.');
  closeSheet();
  viewAllEvents=false;
  navigate('ottelu');
  render();
  releaseWakeLock();
  notify(presetId?'Uusi ottelu ja EKS-kokoonpano valmis.':'Uusi ottelu valmis. Lisää kokoonpano Pelaajat-välilehdellä.');
}
function showMatchSettings(startAfter=false) {
  const canChangeLength = !state.events.length && !elapsed(state) && state.start===null && state.period===1;
  openSheet(startAfter?'Valmiina aloitukseen?':'Ottelun asetukset',startAfter?'Valitse erän pituus ennen kellon käynnistämistä.':'Joukkueet ja peliaika.',`<div class="stack"><label class="field" for="settings-home">Kotijoukkue<input id="settings-home" name="home" value="${escapeHTML(state.home)}" maxlength="60" required></label><label class="field" for="settings-away">Vierasjoukkue<input id="settings-away" name="away" value="${escapeHTML(state.away)}" maxlength="60" required></label><label class="field" for="settings-length">Erän pituus, min<input id="settings-length" name="length" type="number" inputmode="numeric" min="1" max="60" value="${state.periodLength/60}" ${canChangeLength?'required':'disabled'}>${canChangeLength?'':'<small>Erän pituus on lukittu tämän ottelun alkamisen jälkeen.</small>'}</label><input name="startAfter" type="hidden" value="${startAfter?'yes':'no'}">${startAfter?'':`<div class="form-grid"><button class="button" type="button" data-action="edit-clock">${icon('clock')}Korjaa kelloa</button><button class="button" type="button" data-action="next-period">Seuraava erä${icon('arrow')}</button></div><button class="text-button" type="button" data-action="${state.finished?'reopen-game':'finish-game'}">${state.finished?'Jatka ottelua':'Merkitse ottelu päättyneeksi'}</button>`}</div>`,
    `<button type="button" class="button quiet" data-action="close-sheet">Peruuta</button><button type="submit" class="button primary">${startAfter?icon('play')+'Aloita 1. erä':'Tallenna asetukset'}</button>`,'settings-form');
}
function submitSettings(form) {
  const data = new FormData(form);
  const next = clone(state);
  next.home = String(data.get('home')).trim() || 'Kiekko-Espoo';
  next.away = String(data.get('away')).trim() || 'Vastustaja';
  if(data.has('length')) {
    const length = Number(data.get('length'));
    if(!Number.isInteger(length)||length<1||length>60) throw new Error('Valitse erän pituus väliltä 1–60 minuuttia.');
    next.periodLength=length*60;
  }
  next.configured=true;
  if(data.get('startAfter')==='yes') { next.start=Date.now(); next.finished=false; }
  if(!persist(next)) return formError('Asetuksia ei voitu tallentaa.');
  closeSheet(); render();
  if(next.start!==null) requestWakeLock();
  notify(data.get('startAfter')==='yes'?'Erä käynnissä.':'Ottelun asetukset tallennettu.');
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
  openSheet('Korjaa kelloa',`${state.period}. erä · kello on pysäytetty`, `<div class="stack"><label class="field" for="remaining-time">Jäljellä oleva aika<input class="clock-editor" id="remaining-time" name="remaining" inputmode="numeric" value="${formatTime(state.periodLength-elapsed(state))}" placeholder="mm:ss" required></label><p class="helper-box">Syötä hallin kellossa näkyvä aika. Aiemmin kirjattujen tapahtumien ajat säilyvät ennallaan.</p></div>`,
    '<button class="button quiet" type="button" data-action="close-sheet">Peruuta</button><button class="button primary" type="submit">Aseta aika</button>','clock-form');
}
function changePeriod() {
  askConfirm('Siirry seuraavaan erään?',`${state.period+1}. erä alkaa ajasta ${formatTime(state.periodLength)}. Käynnistät kellon erikseen Aloita erä -painikkeesta.`,()=>{
    const next = nextPeriod(state);
    next.finished=false;
    if(persist(next)) { closeSheet();render();releaseWakeLock();notify(`${next.period}. erä valmiina aloitukseen.`); }
  },'Valmistele seuraava erä');
}
function finishGame() {
  askConfirm('Merkitäänkö ottelu päättyneeksi?','Kello pysähtyy. Voit tehdä ottelukoosteen ja jatkaa muokkaamista tarvittaessa.',()=>{
    if(mutate(next=>{next.seconds=elapsedPrecise(state);next.start=null;next.finished=true;})) {closeSheet();releaseWakeLock();navigate('tilastot');notify('Ottelu merkitty päättyneeksi.');}
  },'Päätä ottelu');
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
  if(n==='') throw new Error('Anna pelaajan numero väliltä 0–99.');
  const existed = state.roster.some(p=>p.n===n&&p.team===rosterTeam);
  if(!mutate(next=>{const p=next.roster.find(p=>p.n===n&&p.team===rosterTeam);if(p)p.name=name;else next.roster.push({n,name,team:rosterTeam});})) return;
  notify(existed?`Pelaaja #${n} päivitetty.`:`Pelaaja #${n} lisätty.`);
  $('player-number')?.focus({preventScroll:true});
}
function showPlayerEditor(n,team) {
  const player = state.roster.find(p=>p.n===n&&p.team===team);
  if(!player) return;
  editingPlayer={n,team};
  openSheet(`Pelaaja #${n}`,state[team],`<div class="stack"><label class="field" for="edit-player-name">Sukunimi<input id="edit-player-name" name="name" value="${escapeHTML(player.name)}" maxlength="60" placeholder="Pelaajan sukunimi"></label><p class="helper-box">Nimi päivittyy myös tämän ottelun aiempiin tapahtumiin ja koosteeseen.</p></div>`,
    '<button class="button danger" type="button" data-action="remove-player" aria-label="Poista pelaaja kokoonpanosta">'+icon('trash')+'</button><button class="button primary" type="submit">Tallenna pelaaja</button>','edit-player-form');
}
function deleteEvent(id) {
  const previous=clone(state.events.find(e=>e.id===id));
  const index=state.events.findIndex(e=>e.id===id), gameId=state.id;
  if(!previous) return;
  askConfirm('Poistetaanko tapahtuma?',`${previous.type} · ${state[previous.team]} · ${previous.period}. erä ${formatTime(previous.time)}`,()=>{
    if(!mutate(next=>{next.events=next.events.filter(e=>e.id!==id);}))return;
    closeSheet();
    notify('Tapahtuma poistettu.',()=>{if(state.id===gameId)mutate(next=>{if(!next.events.some(e=>e.id===id))next.events.splice(index,0,previous);});});
  },'Poista tapahtuma',true);
}
function showLegacyEvent(event) {
  openSheet('Vanha tapahtuma','Säilytetty aiemmasta versiosta.',`<ol class="event-list" style="padding:0">${eventRow(event,state,false)}</ol><p class="helper-box">Vanha laukausyritys säilyy historiassa, mutta sitä ei lasketa laukauksiin maalia kohti. Korjaa virheellinen kirjaus poistamalla se ja kirjaamalla tarvittaessa maali tai torjunta.</p>`,
    `<button class="button danger" type="button" data-action="delete-event" data-id="${escapeHTML(event.id)}">${icon('trash')}Poista tapahtuma</button><button class="button primary" type="button" data-action="close-sheet">Valmis</button>`);
}
function showArchive(id) {
  const game = state.archive.find(g=>g.id===id);
  if(!game)return;
  reportGame=game;
  const goals=score(game), stats=teamStats(game);
  openSheet('Tallennettu ottelu',dateLabel(game,true),`<h3 style="text-align:center">${escapeHTML(game.home)} – ${escapeHTML(game.away)}</h3><div style="text-align:center;font-size:60px;font-weight:850;letter-spacing:-3px;margin:12px 0;color:var(--navy)">${goals.home} : ${goals.away}</div><div class="helper-box" style="text-align:center">Laukaukset maalia kohti ${stats.home.shots}–${stats.away.shots}<br>Torjunnat ${stats.home.saves}–${stats.away.saves}<br>${game.events.length} tapahtumaa · ${game.roster.length} pelaajaa</div><div class="form-grid" style="margin-top:18px"><button class="button" data-action="archive-poster" type="button">${icon('image')}Ottelukuva</button><button class="button" data-action="archive-report" type="button">${icon('text')}Tekstikooste</button></div><p class="field-note" style="margin-top:18px">Avaaminen siirtää nykyisen ottelun arkistoon. Voit sen jälkeen tarkastella ja korjata tämän pelin tapahtumia.</p>`,
    `<button class="button quiet" type="button" data-action="close-sheet">Sulje</button><button class="button primary" type="button" data-action="open-archive" data-id="${escapeHTML(id)}">Avaa ottelu${icon('arrow')}</button>`);
}
function showMenu() {
  pending=null;
  const item=(action,i,title,description)=>`<button class="menu-item" type="button" data-action="${action}">${icon(i)}<span>${title}<small>${description}</small></span>${icon('arrow','class="chevron"')}</button>`;
  openSheet('Peli hallussa.','Asetukset ja tiedot.',`<div class="menu-list">${item('match-settings','settings','Ottelun asetukset','Joukkueet, kello ja erät')}${item('new-game','new','Uusi ottelu','Nykyinen peli talteen, uusi tilalle')}${item('backup','download','Vie varmuuskopio','Kaikki ottelut yhdessä tiedostossa')}${item('restore','upload','Palauta varmuuskopio','Avaa aiemmin viety JSON-tiedosto')}${item('install-help','share','Lisää kotivalikkoon','Oma kuvake iPhonen tai Androidin aloitusnäyttöön')}</div><hr class="menu-divider"><p class="small muted" id="offline-description">${escapeHTML(pwaStatus?.message||'Tarkistetaan offline-valmiutta…')}</p><div class="version-line"><span>Versio ${VERSION}</span><button class="text-button" type="button" data-action="check-update">${icon('refresh')}Tarkista päivitys</button></div><p class="field-note">Epävirallinen ottelutyökalu Kiekko-Espoon väreissä.</p>`);
}
function showInstallHelp() {
  openSheet('Kiekkokirjuri kotivalikkoon','iPhone ja Android',`<div class="info-list"><div class="info-item">${icon('share')}<div><strong>iPhone · Safari</strong>Avaa tämä osoite Safarissa. Valitse Jaa → Lisää Koti-valikkoon. Ota Avaa verkkoappina käyttöön, jos valinta näkyy. Tarkista nimeksi Kiekkokirjuri ja paina Lisää.</div></div><div class="info-item">${icon('rink')}<div><strong>Android · Chrome</strong>Avaa tämä osoite Chromessa. Valitse ⋮ → Asenna ja luo pikakuvake → Asenna. Joissakin versioissa valinta on Lisää aloitusnäyttöön.</div></div><div class="info-item">${icon('check')}<div><strong>Avaa uusi Kiekkokirjuri-kuvake kerran netissä</strong>Odota, että asetuksissa lukee Valmis myös ilman yhteyttä. Sen jälkeen voit kirjata ottelut ilman verkkoa. Uudet kokoonpanot ja sovelluspäivitykset haetaan verkkoyhteydellä.</div></div></div><p class="helper-box" style="margin-top:22px"><strong>Onko sinulla jo otteluita vanhassa kuvakkeessa tai selaimessa?</strong><br>Vie niistä varmuuskopio ennen uuden kuvakkeen lisäämistä. Vanha kuvake ei välttämättä vaihda nimeä tai kuvaa itsestään. Jos uusi kuvake avaa tyhjän ottelun, palauta varmuuskopio siinä. Säilytä vanha sovellus, kunnes ottelut näkyvät myös uudessa.</p>`,
    '<button class="button primary" type="button" data-action="close-sheet">Selvä</button>');
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
  notify(unreadableRaw!==null?'Alkuperäinen tallennus vietiin tiedostoksi.':'Varmuuskopio sisältää nykyisen ottelun ja koko arkiston.');
}
async function restoreFile(file) {
  if(!file)return;
  if(file.size>25*1024*1024) throw new Error('Varmuuskopio on liian suuri. Enimmäiskoko on 25 Mt.');
  const restored=normalizeState(JSON.parse(await file.text()));
  // Import resumes paused, so a backup never restarts a clock using an old timestamp.
  restored.seconds=elapsedPrecise(restored);
  restored.start=null;
  askConfirm('Palautetaanko varmuuskopio?',`Tiedostossa on nykyinen ottelu ja ${restored.archive.length} arkistoitua ottelua. Palautus korvaa tällä laitteella olevat ottelut. Vie tarvittaessa ensin nykyinen varmuuskopio.`,()=>{
    const original=unreadableRaw;
    unreadableRaw=null;
    if(!persist(restored)) {unreadableRaw=original;return formError('Varmuuskopiota ei voitu tallentaa.');}
    closeSheet();releaseWakeLock();navigate('ottelu');render();notify('Varmuuskopio palautettu. Kello on pysäytetty.');
  },'Palauta ottelut');
}
function showReport(game=state) {
  reportGame=snapshot(game);
  openSheet('Ottelukooste','Koko ottelu tekstinä.',`<textarea class="report-text" id="report-text" readonly aria-label="Ottelun tekstikooste">${escapeHTML(textReport(reportGame))}</textarea>`,
    `<button class="button" type="button" data-action="download-report">${icon('download')}Lataa .txt</button><button class="button primary" type="button" data-action="copy-report">${icon('text')}Kopioi teksti</button>`);
}
async function showPoster(game=state) {
  reportGame=snapshot(game);
  const token=openSheet('Ottelukuva','Valmistellaan jaettavaa koostetta…',empty('image','Hetki, kuva valmistuu.','Kuva luodaan tällä laitteella. Myös ilman verkkoyhteyttä.'));
  const requestedGame=reportGame;
  const blob=await createPoster(requestedGame);
  if(!$('sheet').open || sheetToken!==token || reportGame!==requestedGame) return;
  posterBlob=blob;
  if(posterURL)URL.revokeObjectURL(posterURL);
  posterURL=URL.createObjectURL(blob);
  openSheet('Ottelukuva','Valmis jaettavaksi.',`<div class="poster-wrap"><img class="poster-preview" src="${posterURL}" alt="Ottelukooste: ${escapeHTML(game.home)} vastaan ${escapeHTML(game.away)}"></div>`,
    `<button class="button" type="button" data-action="download-poster">${icon('download')}Lataa PNG</button><button class="button primary" type="button" data-action="share-poster">${icon('share')}Jaa kuva</button>`);
}
async function sharePoster() {
  if(!posterBlob||!reportGame)return;
  const file=new File([posterBlob],safeFilename(reportGame,'ottelukooste.png'),{type:'image/png'});
  if(navigator.canShare?.({files:[file]})&&navigator.share) {
    try {await navigator.share({files:[file],title:'Ottelukooste'});} catch(error){if(error.name!=='AbortError')formError('Jakaminen ei onnistunut. Voit ladata kuvan PNG-tiedostona.');}
  } else {download(posterBlob,file.name);notify('Kuva ladattu. Voit jakaa sen laitteen tiedostoista.');}
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
      case 'close-sheet':closeSheet();break;
      case 'confirm':if(confirmAction)confirmAction();break;
      case 'undo':{const undo=undoAction;$('toast').hidden=true;undoAction=null;if(undo)undo();break;}
      case 'event':if(state.finished){notify('Jatka ottelua ennen uuden tapahtuman kirjaamista.');break;}beginEvent(type);break;
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
      case 'reopen-game':if(mutate(next=>{next.finished=false;})){closeSheet();notify('Ottelu avattu muokattavaksi. Kello on pysäytetty.');}break;
      case 'roster-team':rosterTeam=team;render();break;
      case 'stats-team':statsTeam=team;render();break;
      case 'edit-player':showPlayerEditor(number,team);break;
      case 'remove-player':{const player={...editingPlayer};askConfirm('Poistetaanko pelaaja kokoonpanosta?',`Pelaajan #${player.n} tapahtumat ja tilastot säilyvät numerolla.`,()=>{if(mutate(next=>{next.roster=next.roster.filter(p=>!(p.n===player.n&&p.team===player.team));})){closeSheet();notify('Pelaaja poistettu kokoonpanosta.');}},'Poista pelaaja',true);break;}
      case 'go-live':navigate('ottelu');break;
      case 'archive-detail':showArchive(id);break;
      case 'open-archive':if(persist(openArchive(state,id))){closeSheet();releaseWakeLock();navigate('ottelu');render();notify('Tallennettu ottelu avattu.');}break;
      case 'backup':backup();break;
      case 'restore':$('restore-file').value='';$('restore-file').click();break;
      case 'report':showReport();break;
      case 'archive-report':showReport(reportGame);break;
      case 'poster':await showPoster();break;
      case 'archive-poster':await showPoster(reportGame);break;
      case 'download-report':download(new Blob([textReport(reportGame)],{type:'text/plain;charset=utf-8'}),safeFilename(reportGame,'ottelukooste.txt'));break;
      case 'copy-report':try{await navigator.clipboard.writeText(textReport(reportGame));notify('Ottelukooste kopioitu.');}catch{$('report-text').select();formError('Valitse ja kopioi teksti käsin. Selain ei sallinut automaattista kopiointia.');}break;
      case 'download-poster':if(posterBlob)download(posterBlob,safeFilename(reportGame,'ottelukooste.png'));break;
      case 'share-poster':await sharePoster();break;
      case 'install-help':showInstallHelp();break;
      case 'check-update':{button.disabled=true;try{const result=await checkForUpdate();notify(result?.updateAvailable?'Uusi versio on valmis ladattavaksi.':result?.state==='error'||!result?.online?result?.message||'Päivityksen tarkistaminen vaatii verkkoyhteyden.':'Käytössä on uusin versio '+VERSION+'.');}finally{button.disabled=false;}break;}
      case 'apply-update':if(state.start!==null||hasDraft()){notify('Pysäytä kello ja tallenna tai sulje avoin lomake ennen päivitystä.');break;}if(updateAction){await updateAction();}break;
      case 'sync-storage':if($('sheet').open)closeSheet();else if(externalConflict)adoptExternal(externalConflict.raw);break;
    }
  } catch(error) { if($('sheet').open)formError(error.message||'Toiminto epäonnistui.');else notify(error.message||'Toiminto epäonnistui.'); }
});
document.addEventListener('submit',event=>{
  event.preventDefault();
  const form=event.target;
  try {
    switch(form.id) {
      case 'event-form':submitEvent();break;
      case 'new-game-form':submitNewGame(form);break;
      case 'settings-form':submitSettings(form);break;
      case 'clock-form':{const remaining=parseTime(new FormData(form).get('remaining'));if(remaining>state.periodLength)throw new Error('Aika ei voi ylittää erän pituutta.');if(mutate(next=>{next.seconds=state.periodLength-remaining;next.start=null;next.configured=true;})){closeSheet();notify('Kello korjattu. Käynnistä se, kun peli jatkuu.');}break;}
      case 'add-player-form':addPlayer(form);break;
      case 'edit-player-form':{const name=String(new FormData(form).get('name')).trim();if(mutate(next=>{const p=next.roster.find(p=>p.n===editingPlayer.n&&p.team===editingPlayer.team);if(p)p.name=name;})){closeSheet();notify('Pelaajan nimi tallennettu.');}break;}
    }
  }catch(error){formError(error.message||'Tarkista lomakkeen tiedot.',form.id==='add-player-form'?'roster-error':'sheet-error');}
});
document.addEventListener('input',event=>{
  if(pending&&event.target.id==='manual-number')pending._manualNumber=event.target.value;
  if(pending&&event.target.id==='manual-assist')pending._manualAssist=event.target.value;
  const field=event.target.dataset.pending;
  if(!pending||!field||field==='time'||field==='period'||field==='penaltyType')return;
  pending[field]=field==='minutes'?Number(event.target.value):event.target.value;
});
document.addEventListener('change',event=>{
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
  catch(error){if($('sheet').open)formError('Varmuuskopiota ei palautettu. '+error.message);else notify('Varmuuskopiota ei palautettu. '+error.message);}
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
    if(mutate(next=>{next.seconds=state.periodLength;next.start=null;})){releaseWakeLock();notify(`${state.period}. erä päättynyt.`);}
  }
  if($('clock'))$('clock').textContent=formatTime(state.periodLength-time);
},250);

render();
if(startupError)storageProblem(unreadableRaw!==null?'Aiemman tallennuksen lukeminen epäonnistui. Alkuperäiset tiedot ovat tallella. Vie varmuuskopio valikosta. '+startupError:startupError);
setupPWA({
  canReload:()=>state.start===null&&!hasDraft(),
  onStatus(info){
    pwaStatus=info;
    const label=info.offlineReady?(info.online?'Valmis myös offlineen':'Offline · tallennus laitteelle'):'Tallennus laitteelle';
    $('connection-label').textContent=label;
    $('connection-status').title=info.message;
    $('connection-status').classList.toggle('warning',!info.offlineReady);
    if($('offline-description'))$('offline-description').textContent=info.message;
  },
  onUpdate(update){
    updateAction=update.apply;
    $('update-banner').innerHTML=`<span>Uusi versio ${escapeHTML(update.version)} on valmis.</span><button type="button" data-action="apply-update">Päivitä sovellus</button>`;
    $('update-banner').hidden=false;
  }
});
// Application ready.
