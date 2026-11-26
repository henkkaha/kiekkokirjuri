# Kiekkokirjuri

Offline-ottelukirjuri Kiekko-Espoon väreissä. Julkaistu GitHub Pagesiin:

**https://henkkaha.github.io/kiekkokirjuri/**

Versio **0.6.1**. Ei palvelinta, käyttäjätunnuksia, analytiikkaa tai ulkoisia ajonaikaisia riippuvuuksia. Ottelut pysyvät käyttäjän laitteen selaintallennuksessa.

## Käyttö

1. Avaa sovellus kerran verkkoyhteydellä. Valikon teksti **Valmis myös ilman yhteyttä** kertoo, että koko sovellus on tallennettu offline-käyttöä varten.
2. Valitse **Uusi ottelu**, anna joukkueet ja valitse erän pituus. Nykyinen ottelu siirtyy arkistoon. Molempien joukkueiden kokoonpanot alkavat tyhjistä.
3. Lisää pelaajien numerot ja halutessasi sukunimet **Pelaajat**-välilehdellä. Numeroita ja nimiä voi täydentää myös jälkikäteen. Numero 0 on sallittu, ja sama numero voi kuulua eri joukkueiden pelaajille.
4. Käynnistä erä. Kello laskee alaspäin. Pysäytä se pelikatkoilla; kellon asetuksista voi korjata jäljellä olevan ajan tai valmistella seuraavan erän.
5. Kirjaa **Maali**, **Torjunta** tai **Jäähy**. Valitse ensin joukkue, sitten pelaaja ja lisätiedot. Tapahtuma-aika otetaan ensimmäisestä painalluksesta. Maalille voi valita enintään kaksi syöttäjää.
6. **Tilastot** näyttää joukkue- ja pelaajatilastot sekä tekstin ja PNG-kuvan viennin. **Ottelut** näyttää arkiston ja varmuuskopion viennin/palautuksen.

### Laukaukset ja torjunnat

**Laukaukset maalia kohti = joukkueen maalit + vastustajan maalivahdin torjunnat.**

Torjunta kirjataan torjuneen maalivahdin joukkueelle. Sama tapahtuma lisää vastustajalle laukauksen maalia kohti. Ohi menneitä tai blokattuja yrityksiä ei kirjata. Pelaajakohtaisia laukausmääriä tai maalivahtien torjuntaprosentteja ei päätellä puutteellisista tiedoista.

Vanhojen versioiden `Laukaus`-tapahtumat säilyvät historiassa ja tekstiviennissä, mutta eivät kuulu laukaukset maalia kohti -lukuun. Rangaistukset ovat kirjaustietoja; sovellus ei ratkaise jäähyjen samanaikaisuutta, päättymistä maalista tai sarjakohtaisia sääntötulkintoja.

### iPhone

Avaa sovellus Safarissa ja valitse **Jaa → Lisää Koti-valikkoon**. Avaa sitten Kirjuri-kuvake verkkoyhteydellä ja tarkista offline-valmius. Jos Koti-valikon sovellus käyttää eri tallennustilaa kuin aiempi selainikkuna, siirrä ottelut JSON-varmuuskopiolla.

### Tallennus ja päivitykset

- Tallennusavain pysyy samana: `ke-match-v1`. Vanhojen versioiden ottelut ja arkistot normalisoidaan niitä poistamatta.
- Ottelut eivät synkronoidu automaattisesti laitteiden välillä. Vie säännöllisesti JSON-varmuuskopio. Selaimen sivustotietojen tyhjentäminen poistaa myös paikalliset ottelut.
- Kirjausta ei merkitä tallennetuksi, jos selaintallennus epäonnistuu. Virheellinen aiempi tallennus jätetään koskemattomaksi ja sen voi viedä alkuperäisenä tiedostona.
- Toisen selainikkunan uudempi tallennus estää vanhan lomakkeen ylikirjoituksen. Sulje lomake tai lataa uudemmat tiedot ilmoituksen painikkeesta.
- Päivitys lataa koko sovellusversion ennen sen käyttöönottoa. Avoin ottelu ei lataudu automaattisesti uudelleen. Päivityspainike odottaa pysäytettyä kelloa ja tallennettua/suljettua lomaketta.
- Versiosta 0.5 siirtyminen tarvitsee normaalin sivun päivityksen verkkoyhteydellä. Sivustotietoja ei tarvitse tyhjentää.

## Kehittäminen

Buildless HTML/CSS/JavaScript. Käynnistä esimerkiksi projektin yläkansiosta:

```sh
python -m http.server 4173
```

Avaa `/kiekkokirjuri/` localhost-osoitteessa. Service worker toimii localhostissa tai HTTPS-yhteydellä. Julkaisu säilyttää alihakemistopolut.

| Tiedosto | Vastuu |
| --- | --- |
| `index.html`, `styles.css` | Rakenne, responsiivinen ulkoasu ja saavutettavat kontrollit |
| `app.js` | Kirjausnäkymät, lomakkeet, paikallinen tallennus ja viennit |
| `model.js` | Ajanlaskenta, tilastot, validointi ja vanhojen tietojen siirto |
| `reports.js` | Täydellinen tekstiraportti ja paikallisesti luotu PNG-kooste |
| `pwa.js`, `sw.js` | Offline-valmius, versioidut resurssit ja hallittu päivitys |
| `assets/`, `manifest.json` | Paikalliset tunnukset ja asennuskuvakkeet |

### Tarkistukset

```sh
node --test tests/*.test.mjs
node --check app.js
```

25 automaattista testiä kattavat laukauslaskennan, pelaajan numeron 0, syöttäjät, vanhat varmuuskopiot, arkistojen eristyksen, kellon toistuvien pysäytysten tarkkuuden, raportit sekä offline-välimuistin ja päivityksen eheystarkistukset.

Versio 0.6.1 tarkistettiin myös oikeassa Chromium-selaimessa: maalit ja kaksi syöttäjää, torjunnat, jäähyt, tilastot, kellon korjaus ja nollaraja, seuraava erä, uuden ottelun tyhjät kokoonpanot, arkiston säilyminen, kahden ikkunan ristiriidan esto, PNG-kuvakoosteen renderöinti ja JSON-vienti. Responsiivinen ulkoasu tarkistettiin 390 px:n ja 320 px:n levyisissä selainkehyksissä sekä työpöytäkoossa. Fyysistä iPhonea ei testattu. Tiedostovalitsimen päästä päähän -palautustesti jäi testiselaimen työkaluaikakatkaisun vuoksi vahvistamatta; varmuuskopion validointi testattiin automaattisesti.

`tests/pwa-browser.mjs` on erillinen, valinnainen Playwright-integraatiotesti versiosta 0.5 siirtymiseen ja verkkoyhteyden katkaisuun. Se tarvitsee Playwrightin ja Chromiumin. Tätä testiä ei ajettu kehitysympäristössä, jossa paikallista selainbinääriä ei ollut saatavilla.

Seuraavassa julkaisussa päivitä versionumero yhtenäisesti HTML-metatietoon, moduulien URL-parametreihin, malliin, PWA-ohjaimeen ja service workeriin. Julkaise kaikki resurssit yhdessä commitissa.

## Visuaalisten aineistojen lähteet

Kiekko-Espoon virallinen tunnus ja väripaletti ovat seuran omalta sivustolta. SVG ja PNG säilytetään paikallisina offline-käyttöä varten. Sovellus on epävirallinen ottelutyökalu.

- [Virallinen SVG-tunnus](https://kiekko-espoo.fi/wp-content/themes/uudesti-syntynyt/img/favicon/favicon.svg)
- [Virallinen PNG-tunnus](https://kiekko-espoo.fi/wp-content/themes/uudesti-syntynyt/img/logos/1368624751.png)
- [Visuaalisen ilmeen uudistus](https://kiekko-espoo.fi/uudesti-syntyneena-liigaan/)
- [IIHF:n tilastoraportti: SOG = G + SSG](https://stats.iihf.com/Hydra/415/IHM415000_85A_23_0.pdf)

### EKS-kokoonpanot

`rosters.json` sisältää vain sukunimet ja pelinumerot sekä ottelun ja ryhmän tiedot. Se on julkinen. Päivitä vain tätä tiedostoa seuraavan ottelutapahtuman yhteydessä. Uuden ottelun lomake hakee tiedoston verkosta ja käyttää offline-tilassa viimeisintä onnistuneesti ladattua kopiota päivämäärineen. Valittu kokoonpano kopioidaan otteluun; vanhoja otteluita ei muuteta. Sama numero eri ryhmissä on sallittu, ryhmän sisällä ei. Älä lisää etunimiä tai muita henkilötietoja.
