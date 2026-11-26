/** Local help content. No network, game state or personal data is needed. */
export function renderHelp({ icon, escapeHTML, version }) {
  const topic = (title, body) => `<details class="help-topic"><summary>${title}<span class="help-chevron" aria-hidden="true">${icon('arrow')}</span></summary><div class="help-topic-body">${body}</div></details>`;
  return `<div class="help-center">
    <section class="help-start" aria-labelledby="help-start-title">
      <div class="help-section-label">PIKAOHJE</div>
      <h3 id="help-start-title">Valmiina ensimmäiseen peliin.</h3>
      <ol class="help-steps">
        <li><strong>Luo ottelu.</strong> Anna joukkueet ja erän pituus. Valitse EKS-kokoonpano tai lisää pelaajat itse.</li>
        <li><strong>Käynnistä kello.</strong> Paina Aloita erä ja pysäytä kello pelikatkoilla.</li>
        <li><strong>Kirjaa tilanne.</strong> Valitse Maali, Torjunta tai Jäähy, sitten joukkue ja pelaaja. Tallenna.</li>
      </ol>
    </section>

    <section class="help-feedback" aria-labelledby="help-feedback-title">
      <h3 id="help-feedback-title">Tehdään tästä parempi.</h3>
      <div class="help-feedback-grid">
        <button class="help-feedback-card" type="button" data-action="feedback-open" data-kind="bug">${icon('info')}<span><strong>Ilmoita bugista</strong><small>Jokin ei toimi oikein</small></span>${icon('arrow')}</button>
        <button class="help-feedback-card help-feedback-idea" type="button" data-action="feedback-open" data-kind="idea">${icon('new')}<span><strong>Ehdota ominaisuutta</strong><small>Mikä helpottaisi kirjaamista?</small></span>${icon('arrow')}</button>
      </div>
      <p class="help-feedback-note">Voit kirjoittaa palautteen myös ilman nettiä. Lähetät sen kehittäjälle omasta sähköpostistasi.</p>
    </section>

    <section class="help-guide" aria-labelledby="help-guide-title">
      <div class="help-guide-heading"><h3 id="help-guide-title">Käyttöohje</h3><span>Avaa tarvitsemasi kohta</span></div>
      ${topic('Pelaajat ja kokoonpanot', `
        <p><strong>Uusi ottelu</strong> -lomakkeessa voit valita valmiin EKS-ryhmän. Tarkista kokoonpanon ottelu ja päivämäärä sekä se, pelaako EKS kotona vai vieraissa. Voit myös aloittaa tyhjillä pelaajalistoilla.</p>
        <p><strong>Pelaajat</strong>-välilehdellä valitaan ensin joukkue ja lisätään pelinumerot. Numero 0 käy myös. Sukunimi on valinnainen, ja sen voi täydentää pelaajaa napauttamalla.</p>
        <p>Tapahtumaan kirjoitettu uusi numero lisätään tämän ottelun kokoonpanoon. Molemmilla joukkueilla voi olla sama numero.</p>`)}
      ${topic('Kello, erät ja tapahtuma-aika', `
        <p>Valitse erän pituus ennen aloitusta. <strong>Aloita erä</strong> käynnistää alaspäin laskevan kellon. Käytä pelikatkoilla <strong>Pysäytä</strong>- ja <strong>Jatka erää</strong> -painikkeita.</p>
        <p>Tapahtumapainike ottaa ajan talteen heti painalluksesta. Kello jatkaa kulkuaan, vaikka valitset pelaajaa. Tapahtumissa näkyy <strong>kulunut eräaika</strong>: jos 20 minuutin erässä on jäljellä 17:30, tapahtuma-aika on 02:30.</p>
        <p><strong>Ottelun asetukset → Korjaa kelloa</strong> asettaa jäljellä olevan ajan. Se ei muuta aiempien tapahtumien aikoja. <strong>Seuraava erä</strong> valmistelee uuden erän; käynnistä sen kello erikseen.</p>`)}
      ${topic('Maalit, torjunnat ja jäähyt', `
        <p><strong>Maali:</strong> valitse maalin tehnyt joukkue, maalintekijä ja halutessasi enintään kaksi syöttäjää. Pelaajan voi jättää avoimeksi ja täydentää myöhemmin.</p>
        <p><strong>Torjunta:</strong> valitse torjuneen maalivahdin joukkue ja maalivahti. Vastustajalle lisätään samalla yksi laukaus maalia kohti.</p>
        <div class="help-formula"><strong>Laukaukset maalia kohti</strong><span>omat maalit + vastustajan torjunnat</span></div>
        <p>Maali lisää myös laukauksen tehneelle joukkueelle. Ohi menneitä ja blokattuja laukauksia ei kirjata näihin lukuihin.</p>
        <p><strong>Jäähy:</strong> valitse rangaistuksen saanut joukkue ja pelaaja, syy sekä rangaistuksen tyyppi. Tarvittaessa valitse <strong>Muu rangaistus / oma minuuttimäärä</strong>. Sovellus kirjaa rangaistukset, mutta ei laske niiden päättymistä pelitilanteen mukaan.</p>`)}
      ${topic('Virheen korjaaminen', `
        <p>Napauta tapahtumarivin <strong>kynää</strong>. Voit vaihtaa joukkueen, pelaajan, syöttäjät tai jäähytiedot. <strong>Korjaa tapahtuma-aikaa</strong> avaa erän ja kuluneen eräajan muokkauksen.</p>
        <p>Tallennuksen tai poiston jälkeen <strong>Kumoa</strong> näkyy hetken alareunassa. Myöhemmin voit korjata merkinnän kynästä tai poistaa sen muokkausikkunan roskakorilla. Tulos ja tilastot päivittyvät samalla.</p>`)}
      ${topic('Pelin päättäminen ja seuraava ottelu', `
        <p>Valitse <strong>Ottelun asetukset → Merkitse ottelu päättyneeksi</strong>. Kello pysähtyy ja voit tehdä koosteen. <strong>Jatka ottelua</strong> avaa pelin tarvittaessa uudelleen.</p>
        <p><strong>Uusi ottelu</strong> siirtää nykyisen pelin arkistoon ja aloittaa uuden tuloksesta 0–0. Uudelle pelille valitaan oma kokoonpano.</p>
        <p>Vanhat pelit löytyvät <strong>Ottelut</strong>-välilehdeltä. Valitse peli ja <strong>Avaa ottelu</strong>, jos haluat korjata sitä. Nykyinen keskeneräinen peli säilytetään arkistossa.</p>`)}
      ${topic('Tilastot ja ottelukooste', `
        <p><strong>Tilastot</strong>-välilehdellä näkyvät joukkueiden ja pelaajien luvut. Pelaajan pisteet ovat maalit ja syötöt yhteensä.</p>
        <p><strong>Ottelukuva</strong> tekee jaettavan PNG-kuvan. <strong>Tekstikooste</strong> sisältää kaikki tapahtumat ja tilastot; voit kopioida sen tai ladata tekstitiedoston. Koosteet syntyvät myös ilman verkkoyhteyttä.</p>
        <p>Myös arkistoidun ottelun koosteet saa <strong>Ottelut</strong>-välilehdeltä.</p>`)}
      ${topic('Tallennus, varmuuskopio ja toinen puhelin', `
        <p>Ottelut tallentuvat automaattisesti tähän laitteeseen. Eri toimitsijoiden puhelimet eivät synkronoi kirjauksia keskenään.</p>
        <p><strong>Vie varmuuskopio</strong> tallentaa nykyisen ottelun ja arkiston yhteen JSON-tiedostoon. Säilytä tiedosto puhelimen tiedostoissa tai haluamassasi paikassa.</p>
        <p><strong>Palauta varmuuskopio</strong> avaa tiedoston myös toisessa laitteessa. Palautus <strong>korvaa</strong> siinä jo olevat ottelut, joten vie niistä tarvittaessa ensin oma varmuuskopio.</p>
        <p>Selaimen sivustotietojen poistaminen poistaa paikalliset ottelut. Ota varmuuskopio myös ennen vanhan kotikuvakkeen vaihtamista.</p>`)}
      ${topic('Ilman nettiä ja kotinäytön kuvake', `
        <p>Lisää sovellus puhelimen kotinäytölle ja avaa <strong>uusi kuvake kerran netissä</strong>. Odota, että valikossa lukee <strong>Valmis myös ilman yhteyttä</strong>. Sen jälkeen voit avata sovelluksen, kirjata ottelun ja tehdä koosteet myös hallissa ilman nettiä.</p>
        <p>Ensimmäinen asennus, uudet kokoonpanot, sovelluspäivitykset ja sähköpostin lähetys tarvitsevat yhteyden. Asennettu ohje ja palauteluonnos toimivat ilman verkkoa.</p>
        <button class="help-inline-button" type="button" data-action="install-help">${icon('share')}Asennusohje: iPhone ja Android${icon('arrow')}</button>`)}
    </section>

    <div class="help-footer">
      <button class="help-question" type="button" data-action="feedback-open" data-kind="question">${icon('text')}Jäikö jokin epäselväksi? Kysy kehittäjältä.</button>
      <p>Kiekkokirjuri ${escapeHTML(version)} · Ohje toimii myös ilman nettiä.</p>
    </div>
  </div>`;
}
