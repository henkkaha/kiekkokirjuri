import { LANGUAGES, resolveLanguage, getLocale } from './i18n.js?v=0.8.3';
import { score, teamStats, periodStats, playerStats, formatTime, getTeamColor } from './model.js?v=0.8.3';
import { textReport, createPoster } from './reports.js?v=0.8.3';
import { readMatchLink } from './shared-link.js?v=0.8.3';
import { sharedText } from './shared-messages.js?v=0.8.3';

// This page deliberately never imports app.js or reads/writes match storage.
let language = resolveLanguage(null, navigator.languages?.length ? navigator.languages : [navigator.language]);
let game = null;
let errorCode = null;
let imageBusy = false;
let exportToken = 0;
let readToken = 0;
let noticeTimer = null;
const $ = id => document.getElementById(id);
const tr = (source, values = {}) => sharedText(source, values, language);
const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[char]));
const paths = {
  image: '<rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8" cy="8" r="1"/><path d="m4 17 6-6 4 4 3-3 4 4"/>',
  text: '<path d="M6 3h9l4 4v14H6V3ZM15 3v5h4M9 12h7M9 16h7"/>',
  link: '<path d="m10 13 4-4M8 16l-2 2a4 4 0 0 1-6-6l4-4a4 4 0 0 1 6 0M14 8l2-2a4 4 0 0 1 6 6l-4 4a4 4 0 0 1-6 0"/>',
  arrow: '<path d="M5 12h14m-5-5 5 5-5 5"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7h.01"/>',
};
const icon = name => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">${paths[name]}</svg>`;
const teamName = side => game[side] === 'Vastustaja' ? tr('Vastustaja') : game[side];
const teamDot = side => `<span class="team-dot" style="--team-color:${getTeamColor(game, side).hex}" aria-hidden="true"></span>`;
function playerName(side, number) {
  if (number === '' || number === null || number === undefined) return tr('Maalintekijä kirjaamatta');
  const player = game.roster.find(item => item.team === side && item.n === String(number));
  return `#${number}${player?.name ? ` ${player.name}` : ''}`;
}
function matchDate() {
  if (!game.date || Number.isNaN(new Date(game.date).getTime())) return tr('Ottelun päivä puuttuu');
  return new Intl.DateTimeFormat(getLocale(language), { day:'numeric', month:'long', year:'numeric', timeZone:'Europe/Helsinki' }).format(new Date(game.date));
}
function goalList() {
  const running = { home:0, away:0 };
  const goals = game.events.map((event, index) => ({event, index})).filter(({event}) => event.type === 'Maali')
    .sort((a,b) => a.event.period - b.event.period || a.event.time - b.event.time || a.index - b.index);
  if (!goals.length) return `<p class="empty-copy">${tr('Ei kirjattuja maaleja.')}</p>`;
  return `<ol class="goal-list">${goals.map(({event}) => {
    running[event.team] += 1;
    const assists = event.assists.length ? tr('Syöttäjät: {players}', { players:event.assists.map(number => playerName(event.team, number)).join(', ') }) : tr('Ei merkittyjä syöttäjiä');
    return `<li><div class="goal-time"><strong>${formatTime(event.time)}</strong><small>${tr('Erä {period}',{period:event.period})}</small></div><div class="goal-details"><div class="goal-team">${teamDot(event.team)}${escapeHTML(teamName(event.team))}</div><strong>${escapeHTML(playerName(event.team,event.n))}</strong><p>${escapeHTML(assists)}</p></div><span class="goal-score">${running.home}–${running.away}</span></li>`;
  }).join('')}</ol>`;
}
function playerTable(side) {
  const players = playerStats(game,side);
  return `<section class="summary-card player-card"><h3>${teamDot(side)}${escapeHTML(teamName(side))}</h3>${players.length ? `<table class="player-table"><caption class="sr-only">${escapeHTML(teamName(side))} · ${tr('Pelaajatilastot')}</caption><thead><tr><th scope="col">${tr('Pelaaja')}</th>${[['M','Maalit'],['S','Syötöt'],['P','Pisteet'],['T','Torjunnat'],['J','Jäähyminuutit']].map(([short,full])=>`<th scope="col"><abbr title="${tr(full)}">${tr(short)}</abbr></th>`).join('')}</tr></thead><tbody>${players.map(player=>`<tr><th scope="row"><span class="jersey-number">#${player.n}</span>${escapeHTML(player.name)}</th><td>${player.goals}</td><td>${player.assists}</td><td class="player-points">${player.points}</td><td>${player.saves}</td><td>${player.penaltyMinutes}</td></tr>`).join('')}</tbody></table>` : `<p class="empty-copy">${tr('Ei kirjattuja pelaajia.')}</p>`}</section>`;
}
function render() {
  document.documentElement.lang = language;
  $('skip-link').textContent = tr('Siirry sisältöön');
  $('header-caption').textContent = tr('Ottelukooste');
  $('brand-link').setAttribute('aria-label',tr('Avaa Kiekkokirjuri'));
  document.querySelectorAll('[data-language]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.language === language)));
  $('viewer-footer').innerHTML = `<p>${tr('Katselusivu · Ei muuta laitteesi ottelutietoja.')}</p><a href="./" target="_blank" rel="noopener noreferrer">${tr('Avaa Kiekkokirjuri')}${icon('arrow')}</a>`;
  document.title = game ? `${teamName('home')} – ${teamName('away')} · ${tr('Ottelukooste')}` : `${tr('Ottelukooste')} · Kiekkokirjuri`;
  if (errorCode) {
    const text = errorCode === 'SHARE_TOO_LARGE' ? 'Koostelinkki on liian suuri. Pyydä lähettäjältä ottelukuva tai tekstikooste.' : errorCode === 'SHARE_UNSUPPORTED' ? 'Tämä selain tai sovellusversio ei tue koostelinkin muotoa. Avaa linkki ajantasaisessa selaimessa.' : 'Linkistä puuttuu ottelu tai linkki on katkennut. Pyydä lähettäjältä uusi koostelinkki.';
    $('summary').innerHTML = `<section class="message-card"><span class="message-icon">${icon('info')}</span><h1>${tr('Koostetta ei voitu avata')}</h1><p>${tr(text)}</p></section>`;
    $('summary').setAttribute('aria-busy','false');
    return;
  }
  if (!game) { $('summary').innerHTML = `<section class="message-card"><p>${tr('Avataan ottelukoostetta…')}</p></section>`; return; }
  const totals = score(game), stats = teamStats(game);
  const remaining = formatTime(game.periodLength - game.seconds);
  $('summary').innerHTML = `
    <section class="match-hero" aria-labelledby="summary-title">
      <div class="hero-heading"><h1 id="summary-title">${tr('Ottelukooste')}</h1><time>${escapeHTML(matchDate())}</time></div>
      <div class="match-scoreline"><div class="hero-team">${teamDot('home')}<strong>${escapeHTML(teamName('home'))}</strong><small>${tr('Koti')}</small></div><div class="hero-score" data-score-digits="${Math.max(String(totals.home).length,String(totals.away).length)}" aria-label="${totals.home}–${totals.away}"><span>${totals.home}</span><i>:</i><span>${totals.away}</span></div><div class="hero-team">${teamDot('away')}<strong>${escapeHTML(teamName('away'))}</strong><small>${tr('Vieras')}</small></div></div>
      <div class="hero-state"><strong>${tr(game.finished ? 'Lopputulos' : 'Jakamishetken tilanne')}</strong><span>${tr('Erä {period} · Kellossa {time}',{period:game.period,time:remaining})}</span></div>
    </section>
    <p class="snapshot-note">${icon('info')}<span>${tr('Linkki näyttää jakamishetken tiedot. Myöhemmät korjaukset näkyvät uudessa linkissä.')}</span></p>
    <section class="export-tools" aria-label="${tr('Tallenna omalla kielelläsi')}"><button type="button" class="viewer-button primary" data-export="image" ${imageBusy?'disabled':''}>${icon('image')}<span>${tr(imageBusy?'Kuva valmistuu…':'Lataa ottelukuva')}</span></button><button type="button" class="viewer-button" data-export="text">${icon('text')}<span>${tr('Lataa tekstikooste')}</span></button><button type="button" class="viewer-button" data-export="link">${icon('link')}<span>${tr('Kopioi linkki')}</span></button></section>
    <div class="summary-columns">
      <section class="summary-card"><h2>${tr('Joukkuetilastot')}</h2><div class="comparison-teams"><span>${teamDot('home')}${escapeHTML(teamName('home'))}</span><span>${teamDot('away')}${escapeHTML(teamName('away'))}</span></div>${[['goals','Maalit'],['shots','Laukaukset maalia kohti'],['saves','Torjunnat'],['penaltyMinutes','Jäähyminuutit']].map(([key,label])=>`<div class="comparison-row"><strong>${stats.home[key]}</strong><span>${tr(label)}</span><strong>${stats.away[key]}</strong></div>`).join('')}</section>
      <section class="summary-card"><h2>${tr('Erät')}</h2><table class="period-table"><thead><tr><th scope="col">${tr('Erä')}</th><th scope="col">${tr('Koti')}</th><th scope="col">${tr('Vieras')}</th></tr></thead><tbody>${periodStats(game).map(period=>`<tr><th scope="row">${period.period}</th><td>${period.home}</td><td>${period.away}</td></tr>`).join('')}</tbody></table></section>
    </div>
    <section class="summary-card goals-card"><div class="section-title"><h2>${tr('Maalintekijät')}</h2><span class="small-badge">${totals.home+totals.away}</span></div>${goalList()}<p class="section-note">${tr('Tapahtumien ajat ovat kulunutta eräaikaa.')}</p></section>
    <section class="players-section" aria-labelledby="players-title"><h2 id="players-title">${tr('Pelaajatilastot')}</h2><p class="section-note">${tr('M = maalit · S = syötöt · P = pisteet · T = torjunnat · J = jäähyminuutit')}</p><div class="summary-columns">${playerTable('home')}${playerTable('away')}</div></section>
    <details class="summary-card full-report"><summary><span>${tr('Koko ottelukooste ja tapahtumat')}</span><small>${tr('{count} tapahtumaa',{count:game.events.length})}</small></summary><pre id="full-report-text"></pre></details>`;
  $('full-report-text').textContent = textReport(game,language);
  $('summary').setAttribute('aria-busy','false');
}
function notice(message) {
  clearTimeout(noticeTimer);
  $('viewer-notice').textContent = message;
  $('viewer-notice').hidden = false;
  noticeTimer = setTimeout(()=>{$('viewer-notice').hidden=true;},5500);
}
function filename(extension, selectedLanguage) {
  return `${game.home}-${game.away}-${selectedLanguage}.${extension}`.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-zA-Z0-9._-]/g,'-').replace(/-+/g,'-').toLowerCase();
}
function download(blob,name) {
  const url=URL.createObjectURL(blob), anchor=document.createElement('a');
  anchor.href=url;anchor.download=name;document.body.appendChild(anchor);anchor.click();anchor.remove();
  setTimeout(()=>URL.revokeObjectURL(url),60000);
}
document.addEventListener('click',async event=>{
  if (event.target.closest('#skip-link')) {
    // Preserve the data-bearing fragment when keyboard users skip the header.
    event.preventDefault();$('summary').focus({preventScroll:true});$('summary').scrollIntoView({block:'start'});return;
  }
  const languageButton=event.target.closest('[data-language]');
  if (languageButton && LANGUAGES.some(item=>item.code===languageButton.dataset.language)) {
    language=languageButton.dataset.language;exportToken++;imageBusy=false;
    $('viewer-notice').hidden=true;render();return;
  }
  const button=event.target.closest('[data-export]');
  if (!button || !game) return;
  if (button.dataset.export==='link') {
    try { await navigator.clipboard.writeText(location.href);notice(tr('Linkki kopioitu.')); }
    catch { notice(tr('Kopiointi ei onnistunut. Voit kopioida linkin selaimen osoiteriviltä.')); }
  } else if (button.dataset.export==='text') {
    download(new Blob([textReport(game,language)],{type:'text/plain;charset=utf-8'}),filename('txt',language));
  } else if (button.dataset.export==='image' && !imageBusy) {
    const requestedGame=game, requestedLanguage=language, token=++exportToken;
    imageBusy=true;button.disabled=true;button.querySelector('span').textContent=tr('Kuva valmistuu…');
    try {
      const blob=await createPoster(requestedGame,requestedLanguage);
      if (token===exportToken && requestedGame===game) download(blob,filename('png',requestedLanguage));
    } catch { if(token===exportToken)notice(tr('Kuvan luominen ei onnistunut. Yritä uudelleen.')); }
    finally { if(token===exportToken){imageBusy=false;button.disabled=false;button.querySelector('span').textContent=tr('Lataa ottelukuva');} }
  }
});
async function loadMatch() {
  const token=++readToken;
  exportToken++;imageBusy=false;game=null;errorCode=null;
  $('summary').setAttribute('aria-busy','true');render();
  try { const received=await readMatchLink(location.hash);if(token!==readToken)return;game=received; }
  catch(error) { if(token!==readToken)return;errorCode=error.code||'SHARE_INVALID'; }
  render();
}
window.addEventListener('hashchange',loadMatch);
loadMatch();
if ('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js',{updateViaCache:'none'}).catch(()=>{});
