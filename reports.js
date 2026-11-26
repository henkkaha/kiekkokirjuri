import { elapsed, formatTime, score, teamStats, playerStats, periodStats } from './model.js?v=0.6.1';

const NAVY = '#000032';
const ROYAL = '#003DA5';
const YELLOW = '#FEDD00';
const WHITE = '#FFFFFF';
const PALE = '#BFCBE5';
const FONT = 'Arial, Helvetica, sans-serif';
const TEAMS = ['home', 'away'];

function teamName(game, team) {
  return String(game[team] || (team === 'home' ? 'Kiekko-Espoo' : 'Vastustaja'));
}

function playerName(game, team, number, unknown = 'Pelaaja kirjaamatta') {
  if (number === '' || number === undefined || number === null) return unknown;
  const n = String(Number(number));
  const player = (game.roster || []).find(entry => (entry.team || 'home') === team && String(Number(entry.n)) === n);
  return `#${n}${player?.name ? ` ${player.name}` : ''}`;
}

function gameDate(game) {
  if (game.date === undefined || game.date === null || game.date === '') return '';
  const date = new Date(game.date);
  if (Number.isNaN(date.valueOf())) return '';
  return new Intl.DateTimeFormat('fi-FI', { day: 'numeric', month: 'numeric', year: 'numeric', timeZone: 'Europe/Helsinki' }).format(date);
}

function eventsWithScore(game) {
  const running = { home: 0, away: 0 };
  return (game.events || []).map((event, index) => ({ event, index }))
    .sort((a, b) => Number(a.event.period || 1) - Number(b.event.period || 1)
      || Number(a.event.time || 0) - Number(b.event.time || 0) || a.index - b.index)
    .map(({ event }) => {
      if (event.type === 'Maali' && TEAMS.includes(event.team)) running[event.team] += 1;
      return { event, home: running.home, away: running.away };
    });
}

function eventLine(game, { event, home, away }) {
  const parts = [`${event.period || 1}. erä ${formatTime(event.time)}`, String(event.type), teamName(game, event.team)];
  if (event.type === 'Maali') {
    parts.push(playerName(game, event.team, event.n, 'Maalintekijä kirjaamatta'));
    if (event.assists?.length) parts.push(`Syöttäjät: ${event.assists.map(n => playerName(game, event.team, n)).join(', ')}`);
    parts.push(`Tilanne ${home}–${away}`);
  } else if (event.type === 'Torjunta') {
    parts.push(playerName(game, event.team, event.n, 'Maalivahti kirjaamatta'));
  } else if (event.type === 'Jäähy') {
    if (event.n !== '' && event.n !== undefined && event.n !== null) parts.push(playerName(game, event.team, event.n));
    parts.push(event.penaltyLabel || `${event.minutes ?? 2} min`);
    if (event.reason) parts.push(String(event.reason));
  } else if (event.n !== '' && event.n !== undefined && event.n !== null) {
    parts.push(playerName(game, event.team, event.n));
  }
  if (event.detail) parts.push(String(event.detail));
  return parts.join(' · ');
}

/** Complete, plain-text export; it includes every saved event and every player row. */
export function textReport(game) {
  const totals = score(game);
  const stats = teamStats(game);
  const date = gameDate(game);
  const currentElapsed = elapsed(game);
  const length = Number(game.periodLength) || 1200;
  const lines = [
    'KIEKKOKIRJURI · OTTELUKOOSTE',
    `${teamName(game, 'home')} – ${teamName(game, 'away')}`,
    `Tilanne: ${totals.home}–${totals.away}`
  ];
  if (date) lines.push(`Päivämäärä: ${date}`);
  lines.push(`Erän pituus: ${formatTime(length)}`, `Erä: ${game.period || 1} · Kellossa: ${formatTime(length - currentElapsed)}`, '', 'ERÄT');
  for (const period of periodStats(game)) lines.push(`${period.period}. erä: ${period.home}–${period.away}`);
  lines.push('', 'JOUKKUETILASTOT');
  for (const team of TEAMS) {
    const row = stats[team];
    lines.push(`${teamName(game, team)} (${team === 'home' ? 'koti' : 'vieras'})`,
      `Maalit: ${row.goals}`, `Laukaukset maalia kohti: ${row.shots}`,
      `Torjunnat: ${row.saves}`, `Jäähyminuutit: ${row.penaltyMinutes}`, '');
  }
  lines.push('Laukaukset maalia kohti = joukkueen maalit + vastustajan torjunnat.');
  if (game.events.some(event => event.type === 'Laukaus')) {
    lines.push('Vanhat Laukaus-merkinnät ovat mukana tapahtumissa. Niitä ei lasketa laukauksiksi maalia kohti.');
  }
  lines.push('', 'PELAAJATILASTOT', 'M = maalit, S = syötöt, P = pisteet. Torjunnat kirjataan maalivahdille.');
  for (const team of TEAMS) {
    lines.push('', teamName(game, team));
    const players = playerStats(game, team);
    if (!players.length) lines.push('Ei kirjattuja pelaajia.');
    for (const player of players) {
      lines.push(`#${player.n}${player.name ? ` ${player.name}` : ''} · M ${player.goals} · S ${player.assists} · P ${player.points} · Torjunnat ${player.saves} · Jäähyt ${player.penaltyMinutes} min`);
    }
  }
  lines.push('', `TAPAHTUMAT (${game.events.length})`, 'Ajat ovat kulunutta eräaikaa.');
  const events = eventsWithScore(game);
  if (!events.length) lines.push('Ei kirjattuja tapahtumia.');
  for (const entry of events) lines.push(eventLine(game, entry));
  if (game.notes) lines.push('', 'MUISTIINPANOT', String(game.notes));
  return lines.join('\n');
}

let logoPromise;
function loadLogo() {
  if (!logoPromise) {
    const load = path => new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = new URL(path, import.meta.url).href;
    });
    logoPromise = load('./assets/club-logo.svg').catch(() => load('./assets/club-logo.png')).catch(() => null);
  }
  return logoPromise;
}

/** Shareable image summary. The full play-by-play remains available via textReport. */
export async function createPoster(game) {
  if (typeof document === 'undefined') throw new Error('Kuvakoosteen luominen vaatii selaimen.');
  const totals = score(game);
  const stats = teamStats(game);
  const periods = periodStats(game);
  const visiblePeriods = periods.slice(0, 6);
  const allGoals = eventsWithScore(game).filter(({ event }) => event.type === 'Maali');
  const goals = allGoals.slice(-8);
  const rankings = Object.fromEntries(TEAMS.map(team => [team, playerStats(game, team).filter(player => player.points > 0)]));
  const goalHeaderY = 1100;
  const goalRowsY = goalHeaderY + 86;
  const goalAreaHeight = goals.length ? goals.length * 146 : 110;
  const pointsY = goalRowsY + goalAreaHeight + 38;
  const pointsCardY = pointsY + 56;
  const height = pointsCardY + 274 + 100;
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = height;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Kuvakoostetta ei voitu luoda tällä laitteella.');
  const logo = await loadLogo();

  function font(size, weight = 600) { context.font = `${weight} ${size}px ${FONT}`; }
  function label(value, x, y, size = 24, color = WHITE, align = 'left', weight = 600) {
    context.fillStyle = color;
    context.textAlign = align;
    context.textBaseline = 'alphabetic';
    font(size, weight);
    context.fillText(String(value), x, y);
  }
  function rounded(x, y, width, boxHeight, radius, fill) {
    context.beginPath();
    context.moveTo(x + radius, y);
    context.arcTo(x + width, y, x + width, y + boxHeight, radius);
    context.arcTo(x + width, y + boxHeight, x, y + boxHeight, radius);
    context.arcTo(x, y + boxHeight, x, y, radius);
    context.arcTo(x, y, x + width, y, radius);
    context.closePath();
    context.fillStyle = fill;
    context.fill();
  }
  function fitted(value, x, y, maxWidth, size, color = WHITE, align = 'left', min = 18, weight = 600) {
    let text = String(value);
    let fittedSize = size;
    font(fittedSize, weight);
    while (context.measureText(text).width > maxWidth && fittedSize > min) font(--fittedSize, weight);
    if (context.measureText(text).width > maxWidth) {
      while (text.length && context.measureText(`${text}…`).width > maxWidth) text = text.slice(0, -1);
      text += '…';
    }
    label(text, x, y, fittedSize, color, align, weight);
  }
  function linesFor(value, maxWidth) {
    const words = String(value).trim().split(/\s+/);
    const lines = [];
    let line = '';
    for (const word of words) {
      const candidate = line ? `${line} ${word}` : word;
      if (context.measureText(candidate).width <= maxWidth) {
        line = candidate;
        continue;
      }
      if (line) { lines.push(line); line = ''; }
      for (const character of word) {
        if (context.measureText(line + character).width > maxWidth && line) { lines.push(line); line = ''; }
        line += character;
      }
    }
    if (line) lines.push(line);
    return lines.length ? lines : [''];
  }
  function wrapped(value, x, top, maxWidth, size, maxLines = 2, color = WHITE, align = 'left', min = 22, weight = 700) {
    let adjusted = size;
    font(adjusted, weight);
    let lines = linesFor(value, maxWidth);
    while (lines.length > maxLines && adjusted > min) {
      font(--adjusted, weight);
      lines = linesFor(value, maxWidth);
    }
    if (lines.length > maxLines) {
      lines = lines.slice(0, maxLines);
      let last = lines[maxLines - 1];
      while (last && context.measureText(`${last}…`).width > maxWidth) last = last.slice(0, -1);
      lines[maxLines - 1] = `${last}…`;
    }
    lines.forEach((line, index) => label(line, x, top + adjusted + index * (adjusted + 4), adjusted, color, align, weight));
  }
  function tracking(value, x, y, size, color, spacing = 3) {
    font(size, 700);
    context.fillStyle = color;
    context.textAlign = 'left';
    for (const character of String(value)) {
      context.fillText(character, x, y);
      x += context.measureText(character).width + spacing;
    }
  }

  context.fillStyle = NAVY;
  context.fillRect(0, 0, 1080, height);
  const glow = context.createRadialGradient(850, 260, 20, 850, 260, 950);
  glow.addColorStop(0, '#063A8D');
  glow.addColorStop(1, NAVY);
  context.fillStyle = glow;
  context.fillRect(0, 0, 1080, 1100);
  // Restrained rink geometry gives the image a hockey identity without competing with scores.
  context.save();
  context.strokeStyle = 'rgba(255,255,255,0.045)';
  context.lineWidth = 2;
  context.beginPath();
  context.arc(1040, 510, 420, 0, Math.PI * 2);
  context.moveTo(880, 0);
  context.lineTo(880, 1080);
  context.stroke();
  context.restore();
  context.fillStyle = YELLOW;
  context.fillRect(48, 48, 48, 5);
  tracking('KIEKKO-ESPOO', 48, 90, 20, YELLOW, 4);
  label('OTTELUKOOSTE', 44, 151, 58, WHITE, 'left', 900);
  const date = gameDate(game);
  if (date) label(date, 50, 180, 22, PALE, 'left', 500);
  rounded(880, 44, 152, 152, 76, WHITE);
  if (logo) context.drawImage(logo, 900, 64, 112, 112);
  else {
    label('KIEKKO', 956, 109, 24, NAVY, 'center', 900);
    label('ESPOO', 956, 139, 24, NAVY, 'center', 900);
  }

  const hero = context.createLinearGradient(48, 218, 1032, 550);
  hero.addColorStop(0, '#0849B7');
  hero.addColorStop(1, '#03205B');
  rounded(48, 218, 984, 332, 28, hero);
  label('KOTI', 286, 259, 18, '#D7E5FF', 'center', 700);
  label('VIERAS', 794, 259, 18, '#D7E5FF', 'center', 700);
  wrapped(teamName(game, 'home'), 286, 280, 402, 34, 2, WHITE, 'center', 25, 700);
  wrapped(teamName(game, 'away'), 794, 280, 402, 34, 2, WHITE, 'center', 25, 700);
  fitted(totals.home, 286, 488, 358, 144, WHITE, 'center', 80, 900);
  fitted(totals.away, 794, 488, 358, 144, WHITE, 'center', 80, 900);
  label('–', 540, 467, 80, YELLOW, 'center', 500);
  label('OTTELUTILANNE', 540, 526, 16, '#D7E5FF', 'center', 700);

  rounded(48, 570, 984, 108, 20, 'rgba(255,255,255,0.065)');
  visiblePeriods.forEach((period, index) => {
    const center = 48 + (984 / visiblePeriods.length) * (index + 0.5);
    label(`${period.period}. ERÄ`, center, 602, 17, PALE, 'center');
    fitted(`${period.home}–${period.away}`, center, 642, 984 / visiblePeriods.length - 24, 33, WHITE, 'center', 20, 700);
  });
  if (periods.length > visiblePeriods.length) {
    label(`Erät 1–${visiblePeriods.length} / ${periods.length}. Kaikki erät tekstikoosteessa.`, 540, 669, 15, PALE, 'center', 500);
  }

  rounded(48, 704, 984, 368, 24, WHITE);
  tracking('OTTELUN NUMEROT', 80, 751, 20, NAVY, 2);
  const statRows = [
    ['Laukaukset maalia kohti', 'shots'],
    ['Torjunnat', 'saves'],
    ['Jäähyminuutit', 'penaltyMinutes']
  ];
  statRows.forEach(([name, key], index) => {
    const baseline = 815 + index * 94;
    const homeValue = stats.home[key];
    const awayValue = stats.away[key];
    fitted(homeValue, 84, baseline, 150, 47, NAVY, 'left', 32, 800);
    fitted(awayValue, 996, baseline, 150, 47, NAVY, 'right', 32, 800);
    label(name, 540, baseline - 8, 23, NAVY, 'center', 600);
    const total = homeValue + awayValue;
    const leftWidth = total ? 520 * homeValue / total : 260;
    rounded(280, baseline + 8, 520, 7, 3.5, '#E4E9F2');
    if (total) {
      if (leftWidth > 0) rounded(280, baseline + 8, leftWidth, 7, Math.min(3.5, leftWidth / 2), ROYAL);
      if (520 - leftWidth > 0) rounded(280 + leftWidth, baseline + 8, 520 - leftWidth, 7, Math.min(3.5, (520 - leftWidth) / 2), '#9BA9C2');
    }
  });

  tracking('MAALIT', 48, goalHeaderY + 27, 24, YELLOW, 3);
  label(allGoals.length > goals.length ? `Viimeisimmät ${goals.length} / ${allGoals.length} maalia` : `Ottelun kaikki ${allGoals.length} maalia`, 48, goalHeaderY + 61, 21, PALE, 'left', 500);
  if (!goals.length) {
    rounded(48, goalRowsY, 984, 100, 18, 'rgba(255,255,255,0.055)');
    label('Maalimerkintöjä ei ole vielä kirjattu.', 80, goalRowsY + 59, 26, PALE, 'left', 500);
  }
  goals.forEach(({ event, home, away }, index) => {
    const top = goalRowsY + index * 146;
    rounded(48, top, 984, 136, 18, '#0B1645');
    rounded(48, top + 17, 5, 102, 2.5, event.team === 'home' ? YELLOW : '#9BA9C2');
    fitted(`${home}–${away}`, 132, top + 59, 130, 38, WHITE, 'center', 24, 800);
    label(`${event.period || 1}. ERÄ`, 132, top + 88, 16, PALE, 'center');
    label(formatTime(event.time), 132, top + 112, 21, PALE, 'center', 500);
    fitted(teamName(game, event.team), 234, top + 26, 758, 17, PALE, 'left', 15, 600);
    wrapped(playerName(game, event.team, event.n, 'Maalintekijä kirjaamatta'), 234, top + 34, 758, 29, 2, WHITE, 'left', 23, 700);
    const assists = event.assists?.length
      ? `Syötöt: ${event.assists.map(n => playerName(game, event.team, n)).join('  ·  ')}`
      : 'Ei merkittyjä syöttäjiä';
    fitted(assists, 234, top + 119, 758, 20, PALE, 'left', 17, 500);
  });

  const limitedRankings = rankings.home.length > 3 || rankings.away.length > 3;
  tracking(limitedRankings ? 'PISTEET · TOP 3 / JOUKKUE' : 'PELAAJAPISTEET', 48, pointsY + 25, 22, YELLOW, 2.2);
  label('Maalit + syötöt', 1032, pointsY + 25, 19, PALE, 'right', 500);
  TEAMS.forEach((team, index) => {
    const x = index === 0 ? 48 : 552;
    rounded(x, pointsCardY, 480, 274, 20, WHITE);
    fitted(teamName(game, team), x + 28, pointsCardY + 43, 424, 25, NAVY, 'left', 20, 700);
    const rows = rankings[team].slice(0, 3);
    if (!rows.length) {
      label('Ei kirjattuja pisteitä.', x + 28, pointsCardY + 130, 24, '#65718A', 'left', 500);
    }
    rows.forEach((player, playerIndex) => {
      const baseline = pointsCardY + 97 + playerIndex * 63;
      fitted(`#${player.n}${player.name ? ` ${player.name}` : ''}`, x + 28, baseline, 310, 25, NAVY, 'left', 19, 600);
      fitted(`${player.points} P`, x + 452, baseline, 92, 29, ROYAL, 'right', 22, 800);
      label(`${player.goals} + ${player.assists}`, x + 452, baseline + 24, 17, '#65718A', 'right', 500);
      if (playerIndex < 2) {
        context.fillStyle = '#E9EDF3';
        context.fillRect(x + 28, baseline + 33, 424, 1);
      }
    });
  });

  label('KIEKKO-ESPOO · KIEKKOKIRJURI', 540, height - 49, 19, '#D0D8EA', 'center', 700);
  label('Tapahtumien ajat ovat kulunutta eräaikaa.', 540, height - 22, 17, PALE, 'center', 500);
  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('Kuvakoosteen tallentaminen epäonnistui.')), 'image/png');
  });
}
