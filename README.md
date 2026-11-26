# Kiekkokirjuri

Offline-ottelukirjuri Kiekko-Espoon väreissä. Julkaistu GitHub Pagesiin:

**https://henkkaha.github.io/kiekkokirjuri/**

Versio **0.6.4**. Ei palvelinta, käyttäjätunnuksia, analytiikkaa tai ulkoisia ajonaikaisia riippuvuuksia. Ottelut pysyvät käyttäjän laitteen selaintallennuksessa.

## Käyttö

1. Avaa sovellus kerran verkkoyhteydellä. Valikon teksti **Valmis myös ilman yhteyttä** kertoo, että koko sovellus on tallennettu offline-käyttöä varten.
2. Valitse **Uusi ottelu**, anna joukkueet ja valitse erän pituus. Voit valita valmiin EKS-kokoonpanon tai aloittaa tyhjillä pelaajalistoilla. Nykyinen ottelu siirtyy arkistoon.
3. Lisää pelaajien numerot ja halutessasi sukunimet **Pelaajat**-välilehdellä. Numeroita ja nimiä voi täydentää myös jälkikäteen. Numero 0 on sallittu, ja sama numero voi kuulua eri joukkueiden pelaajille.
4. Käynnistä erä. Kello laskee alaspäin. Pysäytä se pelikatkoilla; kellon asetuksista voi korjata jäljellä olevan ajan tai valmistella seuraavan erän.
5. Kirjaa **Maali**, **Torjunta** tai **Jäähy**. Valitse ensin joukkue, sitten pelaaja ja lisätiedot. Tapahtuma-aika otetaan ensimmäisestä painalluksesta. Maalille voi valita enintään kaksi syöttäjää.
6. **Tilastot** näyttää joukkue- ja pelaajatilastot sekä tekstin ja PNG-kuvan viennin. **Ottelut** näyttää arkiston ja varmuuskopion viennin/palautuksen.

### Laukaukset ja torjunnat

**Laukaukset maalia kohti = joukkueen maalit + vastustajan maalivahdin torjunnat.**

Torjunta kirjataan torjuneen maalivahdin joukkueelle. Sama tapahtuma lisää vastustajalle laukauksen maalia kohti. Ohi menneitä tai blokattuja yrityksiä ei kirjata. Pelaajakohtaisia laukausmääriä tai maalivahtien torjuntaprosentteja ei päätellä puutteellisista tiedoista.

Vanhojen versioiden `Laukaus`-tapahtumat säilyvät historiassa ja tekstiviennissä, mutta eivät kuulu laukaukset maalia kohti -lukuun. Rangaistukset ovat kirjaustietoja; sovellus ei ratkaise jäähyjen samanaikaisuutta, päättymistä maalista tai sarjakohtaisia sääntötulkintoja.

### Lisää puhelimen aloitusnäyttöön

**iPhone:** avaa sovellus Safarissa ja valitse **Jaa → Lisää Koti-valikkoon**. Ota **Avaa verkkoappina** käyttöön, jos valinta näkyy. Tarkista nimeksi **Kiekkokirjuri** ja paina **Lisää**.

**Android:** avaa sovellus Chromessa ja valitse **⋮ → Asenna ja luo pikakuvake → Asenna**. Joissakin selainversioissa valinta on **Lisää aloitusnäyttöön**.

Avaa uusi **Kiekkokirjuri**-kuvake kerran verkkoyhteydellä. Odota, että sovelluksen asetuksissa lukee **Valmis myös ilman yhteyttä**. Sen jälkeen ottelun kirjaaminen onnistuu ilman verkkoa. Ensimmäinen asennus, uudet kokoonpanot ja sovelluspäivitykset tarvitsevat verkkoyhteyden.

Version 0.6.3 asennusnimi on kokonainen **Kiekkokirjuri**, ja kuvakkeessa on **KK**. Jo lisätty iPhonen kuvake ei välttämättä vaihda nimeään tai kuvaansa itsestään. Vie otteluista JSON-varmuuskopio vanhassa sovelluksessa tai selainikkunassa ennen uuden kuvakkeen lisäämistä. Jos uusi kuvake avaa tyhjän ottelun, palauta varmuuskopio siinä. Säilytä vanha sovellus, kunnes ottelut näkyvät uudessa; sivustotietoja ei tarvitse tyhjentää päivitystä varten.

Asennusohjeiden lähteet: [Apple: sivuston muuttaminen apiksi iPhonessa](https://support.apple.com/fi-fi/guide/iphone/iphea86e5236/ios) ja [Google: verkkoappien käyttö Androidissa](https://support.google.com/chrome/answer/9658361?co=GENIE.Platform%3DAndroid&hl=fi).

### Jaettavat kuvat

Version 0.6.3 kolme kuvaa on luotu erillisillä kuvanluontipyynnöillä. Kuvakkeen lähtökohtana on seuran tunnus; **KK** erottaa tämän epävirallisen työkalun seuran omista sovelluksista.

- [WhatsApp-ohjekuva](media/kiekkokirjuri-whatsapp-ohje.png): käyttö, asennus molempiin puhelimiin ja valmistelu offline-käyttöön.
- [Neliömainos](media/kiekkokirjuri-neliomainos.png): lyhyt esittely ja sovelluksen osoite.
- [KK-kuvakkeen alkuperäinen kuva](media/kiekkokirjuri-kk-master.png): sama kuva on viety sovelluksen tarvitsemiin 180, 192 ja 512 pikselin kokoihin.

Mainoskuvat eivät kuulu sovelluksen offline-lataukseen, joten ne eivät kasvata puhelimeen asennettavaa sovelluspakettia.

### Ohje ja palaute

Avaa yläpalkin **?** tai valikon **Ohje ja palaute**. Käyttöohje kattaa ottelun luomisen, kokoonpanot, kellon, tapahtumien kirjaamisen ja korjaamisen, koosteet, varmuuskopiot ja offline-käytön. Ohje on mukana asennetussa sovelluksessa ja avautuu ilman verkkoyhteyttä.

Valitse **Ilmoita bugista**, **Ehdota ominaisuutta** tai ohjeen lopusta **Kysy kehittäjältä**. Kirjoita aihe ja kuvaus; bugiin voi lisätä toistamisen vaiheet. Luonnos säilyy laitteessa erillään otteluista, avaimella `kiekkokirjuri-feedback-v1`. Sitä voi jatkaa myöhemmin ja sen voi tyhjentää erikseen.

Palaute valmistellaan osoitteeseen **henri.haho@gmail.com**. Esikatselun jälkeen sähköpostilinkki avaa käyttäjän oman sähköpostisovelluksen valmiilla vastaanottajalla, aiheella ja lyhyen viestin sisällöllä. Käyttäjä lähettää viestin siinä. Sovellus ei lähetä palautetta automaattisesti, saa toimitusvahvistusta eikä väitä viestiä lähetetyksi sähköpostilinkin avaamisen perusteella. Sähköpostin lähettäminen tarvitsee verkkoyhteyden; palautteen kirjoittaminen ja luonnoksen säilyttäminen eivät.

Viestin voi myös kopioida. Tämä toimii varatapana, jos laitteella ei ole sähköpostilinkkejä avaavaa sovellusta tai viesti on pitkä. Pitkän viestin avaaminen täyttää vastaanottajan ja aiheen; koko teksti kopioidaan tai ladataan erikseen. Sovellus ei tyhjennä luonnosta sähköpostin avaamisen tai kopioinnin jälkeen.

Käyttäjä voi valita mukaan sovelluksen version ja laitteen/selaimen perustiedot sekä verkko- ja offline-valmiuden. Automaattiset lisätiedot eivät sisällä otteluita, pelaajien nimiä, kokoonpanoja tai varmuuskopioita. Lähetettävä teksti on nähtävissä ennen sähköpostin avaamista.

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
| `help.js`, `help.css` | Offline-käyttöohje ja palautteen aloitusvalinnat |
| `feedback.js` | Palauteluonnoksen validointi, viestin muodostus ja sähköpostilinkin koodaus |
| `pwa.js`, `sw.js` | Offline-valmius, versioidut resurssit ja hallittu päivitys |
| `assets/`, `manifest.json` | Paikalliset tunnukset ja asennuskuvakkeet |

### Tarkistukset

```sh
node --test tests/*.test.mjs
node --check app.js
```

Versiolle 0.6.3 ajettiin 25 automaattista testiä hyväksytysti sekä JavaScriptin syntaksitarkistukset. Testit kattavat laukauslaskennan, pelaajan numeron 0, syöttäjät, vanhat varmuuskopiot, arkistojen eristyksen, kellon toistuvien pysäytysten tarkkuuden, raportit sekä offline-välimuistin ja päivityksen eheystarkistukset.

Versiolle 0.6.4 ajettiin kaikki 33 automaattista testiä hyväksytysti. Kahdeksan uutta palautetestiä kattavat luonnoksen validoinnin, ääkköset ja erikoismerkit, vastaanottajan ja sähköpostilinkin turvallisen muodostamisen, pitkän tekstin säilymisen sekä teknisten tietojen rajauksen ja pois jättämisen. Offline-tarkistuksiin lisättiin käyttöohjeen, palautemoduulin ja ohjeen tyylien välimuistitus sekä tarkan version käyttö verkkoyhteyden puuttuessa. Puuttuva ohje- tai palautemoduuli estää keskeneräisen päivityksen käyttöönoton.

Version 0.6.4 palaute testattiin Chromiumissa myös 320 px:n levyisessä selainkehyksessä: ohje ja palautelomake mahtuivat näkymään, bugiraportin vastaanottaja ja sisältö täsmäsivät, tekstin kopiointi onnistui, kehitysidean valinta poisti bugikohtaiset lisätiedot viestistä ja tekniset tiedot sai jätettyä pois. Pitkän viestin kopiointivaihtoehto säilytti koko tekstin. Esikatselupalvelin pysäytettiin ja asennettu sovellus ladattiin uudelleen: ohje ja tallennettu palauteluonnos toimivat edelleen. Luonnoksen tyhjentäminen testattiin erikseen. Testiviestiä ei lähetetty sähköpostilla; varsinainen lähetys tehdään käyttäjän omassa sähköpostisovelluksessa.

Aiemman version 0.6.0 käyttö tarkistettiin Chromium-selaimessa: maalit ja kaksi syöttäjää, torjunnat, jäähyt, tilastot, kellon korjaus ja nollaraja, seuraava erä, uuden ottelun tyhjät kokoonpanot, arkiston säilyminen, kahden ikkunan ristiriidan esto, PNG-kuvakoosteen renderöinti ja JSON-vienti. Sen responsiivinen ulkoasu tarkistettiin 390 px:n ja 320 px:n levyisissä selainkehyksissä sekä työpöytäkoossa. Nämä historialliset tarkistukset eivät ole uuden version selaintestituloksia. Fyysistä iPhonea ei testattu. Tiedostovalitsimen päästä päähän -palautustesti jäi testiselaimen työkaluaikakatkaisun vuoksi vahvistamatta; varmuuskopion validointi testattiin automaattisesti.

`tests/pwa-browser.mjs` on erillinen, valinnainen Playwright-integraatiotesti versiosta 0.5 siirtymiseen ja verkkoyhteyden katkaisuun. Se tarvitsee Playwrightin ja Chromiumin. Tätä testiä ei ajettu kehitysympäristössä, jossa paikallista selainbinääriä ei ollut saatavilla.

Seuraavassa julkaisussa päivitä versionumero yhtenäisesti HTML-metatietoon, moduulien URL-parametreihin, malliin, PWA-ohjaimeen ja service workeriin. Julkaise kaikki resurssit yhdessä commitissa.

## Visuaalisten aineistojen lähteet

Kiekko-Espoon virallinen tunnus ja väripaletti ovat seuran omalta sivustolta. SVG ja PNG säilytetään paikallisina offline-käyttöä varten. Sovellus on epävirallinen ottelutyökalu.

- [Virallinen SVG-tunnus](https://kiekko-espoo.fi/wp-content/themes/uudesti-syntynyt/img/favicon/favicon.svg)
- [Virallinen PNG-tunnus](https://kiekko-espoo.fi/wp-content/themes/uudesti-syntynyt/img/logos/1368624751.png)
- [Visuaalisen ilmeen uudistus](https://kiekko-espoo.fi/uudesti-syntyneena-liigaan/)
- [IIHF:n tilastoraportti: SOG = G + SSG](https://stats.iihf.com/Hydra/415/IHM415000_85A_23_0.pdf)

### EKS-kokoonpanot

`rosters.json` sisältää vain sukunimet ja pelinumerot sekä ottelun ja ryhmän tiedot. Se on julkinen. Päivitä vain tätä tiedostoa seuraavan ottelutapahtuman yhteydessä. Sovellus hakee uudemman tiedoston taustalla verkkoyhteyden aikana ja käyttää offline-tilassa viimeisintä onnistuneesti ladattua kopiota päivämäärineen tai sovellukseen sisältyvää kokoonpanoa. Uuden ottelun lomake ei odota verkkohakua. Valittu kokoonpano kopioidaan otteluun; vanhoja otteluita ei muuteta. Sama numero eri ryhmissä on sallittu, ryhmän sisällä ei. Älä lisää etunimiä tai muita henkilötietoja.

### Offline ensin (0.6.2)
Sovelluksen avaus käyttää asennettua versiota heti. Kokoonpano on mukana myös sovelluksen asennetussa varakopiossa; uudempi onnistuneesti haettu JSON säilytetään paikallisesti. Uuden ottelun lomake ei odota verkkoa eikä muuta valintaa taustapäivityksen aikana. Päivitykset vaativat verkon, ottelun kirjaaminen ei. Käyttäjä hyväksyy sovelluspäivityksen erikseen.
