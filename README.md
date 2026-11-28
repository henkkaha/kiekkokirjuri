# Kiekkokirjuri

Offline-ottelukirjuri Kiekko-Espoon väreissä. Julkaistu GitHub Pagesiin:

**https://henkkaha.github.io/kiekkokirjuri/**

Versio **0.8.0**. Ei palvelinta, käyttäjätunnuksia, analytiikkaa tai ulkoisia ajonaikaisia riippuvuuksia. Ottelut pysyvät käyttäjän laitteen selaintallennuksessa.

### Päivitys 0.8.0: torjunta yhdellä painalluksella ja joukkuevärit

Ottelunäkymässä on kummallekin joukkueelle oma suuri, valitun paitavärin mukainen **Torjunta**-painike. Yksi painallus tallentaa heti yhden torjunnan sekä vastustajalle laukauksen maalia kohti. Tapahtuma-aika tulee samasta painalluksesta. Maalivahdin puuttuminen ei avaa lisälomaketta: tapahtuma kirjataan silloin ilman pelaajanumeroa joukkueen tilastoihin. **Kumoa** poistaa viimeksi lisätyn merkinnän.

Molempien joukkueiden paitaväri ja valinnainen maalivahdin numero asetetaan **Uusi ottelu**-lomakkeessa tai **Ottelun asetuksissa**. Värivaihtoehtoja on yhdeksän. Joukkueen nimi ja koti/vieras-teksti säilyvät värin rinnalla. Samat värit näkyvät tulostaulussa, tapahtumien joukkuevalinnoissa ja Pelaajat/Tilastot-välilehtien valinnoissa. Blue-, White- ja Yellow-esivalinnat ehdottavat vastaavaa väriä; käyttäjä voi vaihtaa sen.

Maalivahdin voi myös valita tai vaihtaa torjuntapainikkeen alla olevasta erillisestä painikkeesta tai Pelaajat-näkymästä. Vaihto ei lisää tapahtumaa eikä muuta aiempien torjuntojen pelaajatietoja. Maali ja jäähy kirjataan edelleen tapahtumapainikkeesta, värillisestä joukkuevalinnasta ja tietolomakkeesta. Värit ja maalivahtivalinnat säilyvät offline-käytössä, varmuuskopiossa sekä otteluarkistossa.

Varmennus: kaikki 79 automaattista testiä läpäistiin. Selaimessa testattiin ensimmäinen suora torjunta ilman maalivahtia, torjunta valitulle maalivahdille, molempien joukkueiden laukaus- ja torjuntamäärät, kumoaminen ja maalivahdin vaihto ilman ylimääräistä tapahtumaa. Ennen peliä asetettu numero 0 ja esivalinnan sukunimi toimivat. Koti/vieras-puolen vaihto siirsi numerot ja värit oikean joukkueen mukana; ryhmän vaihto poisti aiemman ryhmän maalivahtinumeron. Värit tarkistettiin maalin joukkuevalinnassa. FI/EN/SV sekä 320 px:n näkymä ja iPhonen simuloidut turva-alueet tarkistettiin. Palvelin pysäytettiin, sovellus avattiin uudelleen, värit ja maalivahdit säilyivät, ja torjunta sekä kumoaminen toimivat. Fyysistä iPhonea ei testattu.

Puhekirjaus on tässä vaiheessa [tutkittu ja suunniteltu](docs/puhekirjaus-suunnitelma.md), ei käytössä oleva toiminto.

### Päivitys 0.7.3: GrIFK–EKS-kokoonpanot 28.11.2026

Blue-, White- ja Yellow-esivalinnoissa on kussakin kuusi kenttäpelaajaa sekä nimetty maalivahti: Kopiloff, Koponen ja Hannonen. Maalivahtien numeroita ei annettu, joten ne säilyvät puuttuvina. Maalivahti näkyy esivalinnan esikatselussa ja valitun joukkueen Pelaajat-näkymässä erillään torjunnoille valitusta maalivahdista. Torjuntoihin valitaan numero tai jatketaan ilman numeroa kuten aiemminkin.

Sekä julkinen kokoonpanotiedosto että sovellukseen sisältyvä offline-kopio on päivitetty. Valinta tehdään kohdasta **Uusi ottelu → EKS:n kokoonpano**. Valittu kokoonpano tallentuu kyseiseen otteluun; päivitys ei muuta aiemmin luotuja otteluita.

Varmennus: 72 automaattista testiä läpäistiin. Selaimessa tarkistettiin kaikkien kolmen ryhmän esikatselut, Yellow vierasjoukkueena ja White kotijoukkueena sekä maalivahtitiedon säilyminen uudelleenavauksessa. Uusi ottelu luotiin myös testipalvelimen ollessa pysäytettynä. Maalivahtitiedon näkymä tarkistettiin 320 px:n leveydellä.

### Päivitys 0.7.2: torjunnat kahdella painalluksella

Torjunta kirjataan valitsemalla **Torjunta → torjunut joukkue**. Maalivahti valitaan vain ensimmäisellä kerralla erikseen kummallekin joukkueelle. Valinta näkyy joukkueen painikkeessa ja säilyy ottelun ajan myös offline-käytössä. Sen voi vaihtaa erillisestä **Vaihda maalivahti** -painikkeesta tai **Pelaajat**-näkymästä. Uusi ottelu aloittaa valinnat tyhjistä. Vanhoja tapahtumia voi edelleen korjata yksittäin.

Varmennus: kaikki 67 automaattista testiä läpäistiin. Selaimessa testattiin ensimmäinen valinta numerolle 0, seuraava torjunta ilman lisälomaketta, kumoaminen, maalivahdin vaihto ilman ylimääräistä tapahtumaa, vanhan kirjauksen korjaaminen, tuntematon maalivahti ja uuden ottelun nollaus. Alkuperäinen aikaleima säilyi, vaikka kello jatkoi käyntiä ensimmäisen maalivahtivalinnan aikana. Keskeneräinen pelaajarivi säilyi maalivahtia vaihdettaessa. Arkistosta avattu ottelu palautti molemmat valinnat. Suomen-, englannin- ja ruotsinkielinen käyttöliittymä tarkistettiin, mukaan lukien 320 px:n näkymä ja iPhonen simuloidut turva-alueet. Testipalvelin pysäytettiin, sovellus ladattiin uudelleen ja torjunta kirjattiin sekä kumottiin onnistuneesti ilman palvelinta. Fyysistä iPhonea ei testattu.

### Korjaus 0.7.1: iPhonen yläreuna

Yläpalkki varaa tilan iPhonen tilapalkille ja Dynamic Islandille ja pysyy näkyvissä sivua vieritettäessä. Myös pitkien valikoiden ja lomakkeiden yläreuna sekä vaaka-asennon sivureunat huomioivat laitteen turva-alueet. Päivitys säilyttää ottelut, kokoonpanot, kielivalinnan ja palauteluonnokset.

Varmennus: kaikki 57 automaattista testiä läpäistiin. Chrome-selaimessa tarkistettiin käyttöliittymä simuloiduilla iPhonen turva-alueilla: 440 × 956 px (ylä 62 px, ala 34 px), 320 × 568 px (ylä 20 px) ja vaaka-asento 956 × 440 px (vasen 62 px, oikea ja ala 21 px). Lisäksi tarkistettiin 390 × 844 px ilman turva-alueita. Yläpalkin kaikki kolme painiketta säilyivät näkyvissä myös sivun lopussa. Pitkän ohjeen sulkemispainike pysyi näkyvissä ja alapainike turva-alueen yläpuolella sekä vierityksen keskellä että lopussa. Vaaka-asennossa tarkistettiin uuden ottelun lomakkeen kenttiin siirtyminen ja toimintopainikkeet. Vaakasuoraa ylivuotoa ei havaittu, ja olemassa oleva testipeli säilyi. Fyysistä iPhonea ei ole testattu tässä ympäristössä.

Turva-alueiden toteutus noudattaa [WebKitin ohjetta](https://webkit.org/blog/7929/designing-websites-for-iphone-x/): koko näytön täyttävässä näkymässä käyttöliittymän sisältö sijoitetaan `env(safe-area-inset-*)`-reunojen sisäpuolelle.

## Käyttö

1. Avaa sovellus kerran verkkoyhteydellä. Valikon teksti **Valmis myös ilman yhteyttä** kertoo, että koko sovellus on tallennettu offline-käyttöä varten.
2. Valitse **Uusi ottelu**, anna joukkueet, paitavärit ja erän pituus. Voit asettaa maalivahtien numerot jo tässä. Voit valita valmiin EKS-kokoonpanon tai aloittaa tyhjillä pelaajalistoilla. Nykyinen ottelu siirtyy arkistoon.
3. Lisää pelaajien numerot ja halutessasi sukunimet **Pelaajat**-välilehdellä. Numeroita ja nimiä voi täydentää myös jälkikäteen. Numero 0 on sallittu, ja sama numero voi kuulua eri joukkueiden pelaajille.
4. Käynnistä erä. Kello laskee alaspäin. Pysäytä se pelikatkoilla; kellon asetuksista voi korjata jäljellä olevan ajan tai valmistella seuraavan erän.
5. Kirjaa torjunta suoraan torjuneen joukkueen värillisestä **Torjunta**-painikkeesta. Maalille ja jäähylle valitaan tapahtuma, joukkue ja lisätiedot; maalille voi valita enintään kaksi syöttäjää. Tapahtuma-aika otetaan ensimmäisestä painalluksesta.
6. **Tilastot** näyttää joukkue- ja pelaajatilastot sekä tekstin ja PNG-kuvan viennin. **Ottelut** näyttää arkiston ja varmuuskopion viennin/palautuksen.

### Kieli: Suomi, English tai Svenska

Version 0.7.0 käyttöliittymä, käyttöohje, palautteen esikatselu, tekstikooste ja PNG-ottelukooste toimivat suomeksi, englanniksi ja ruotsiksi. Vaihda kieli yläpalkin kielipainikkeesta tai asetusten kielivalinnasta. Valinta tallentuu laitteeseen erilliseen avaimeen `kiekkokirjuri-language-v1`; se ei muuta otteluiden, pelaajien, joukkueiden eikä muistiinpanojen tietoja.

Ensimmäisellä avauksella sovellus käyttää laitteen ensisijaista tuettua kieltä. Jos laitteen kielistä mikään ei ole suomi, englanti tai ruotsi, oletuskieli on englanti. Oma tallennettu valinta ohittaa laitteen kielen. Kaikki kolme kieliversiota sisältyvät samaan offline-asennukseen, joten kielen vaihtaminen ei tarvitse verkkoyhteyttä tai uutta sovelluspäivitystä.

Ottelutiedostojen tapahtumatyypit ja valmiit jäähytiedot säilyvät alkuperäisessä muodossa. Niiden näyttöteksti käännetään valitulle kielelle; omia kuvauksia ja nimiä ei konekäännetä. Saman ottelun voi viedä eri kielillä vaihtamalla sovelluksen kielen ennen koosteen avaamista. Sovelluksen nimi pysyy kaikilla kielillä **Kiekkokirjuri**.

### Torjunta yhdellä painalluksella

Paina ottelunäkymässä torjuneen joukkueen värillistä **Torjunta**-painiketta. Torjunta tallentuu heti, ja vastustajalle kertyy yksi laukaus maalia kohti. Aikaleima otetaan painalluksesta. Myös ensimmäinen torjunta toimii näin ilman erillistä joukkuevalintaa tai tallennuspainiketta.

Maalivahdin numero voidaan antaa ennen peliä **Uusi ottelu**-lomakkeessa tai **Ottelun asetuksissa**. Sen voi valita tai vaihtaa myös torjuntapainikkeen alla olevasta painikkeesta tai **Pelaajat**-välilehdellä. Kummallakin joukkueella on oma valinta. Jos numero puuttuu, torjunta kirjataan joukkueelle ilman pelaajanumeroa.

Maalivahdin vaihto koskee seuraavia torjuntoja. Aikaisemmin ilman numeroa kirjatut tapahtumat eivät siirry automaattisesti myöhemmin valitulle maalivahdille; niitä voi korjata tapahtumarivin kynästä. Viimeisimmän torjunnan voi perua **Kumoa**-painikkeella. Uusi ottelu aloitetaan omilla kokoonpanoilla, väreillä ja maalivahtivalinnoilla.

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
| `i18n.js`, `*-messages.js` | Kielivalinta ja paikalliset suomi–englanti–ruotsi-käännökset |
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

Versiolle 0.7.0 ajettiin kaikki 57 automaattista testiä hyväksytysti. Tarkistukset kattavat lisäksi kielivalinnan, käännetyt virheilmoitukset, muuttumattomat ottelutiedot, kielikohtaiset koosteet sekä kaikkien käännöstiedostojen offline-välimuistituksen. Puuttuva käännöstiedosto estää keskeneräisen päivityksen asentamisen. PWA-tilan kieli vaihtuu ilman verkkohakua tai sivun uudelleenlatausta. Selaintestissä tarkistettiin englanninkielinen aloitus, kielivalinta kaikilla kolmella kielellä, kielivalinnan säilyminen uudelleenlatauksessa, keskeneräisen pelaajarivin ja palauteluonnoksen säilyminen sekä käynnissä olevan kellon jatkuminen kielenvaihdossa. Ruotsiksi kirjattiin maali numerolle 0, syöttö, 2 + 2 minuutin jäähy ja vastustajan torjunta. Koosteen tilastot olivat oikein ja rangaistuksen tallennusarvo säilyi suomenkielisenä näyttötekstin vaihtuessa. Tekstikooste ja PNG-kooste avattiin ruotsiksi ja palautteen esikatselu englanniksi. 320 px:n näkymässä korjattiin tilastosivun leveyttä; sivu ja dialogit mahtuvat leveyteen myös pitkillä ruotsinkielisillä teksteillä. Esikatselupalvelin pysäytettiin, sovellus ladattiin uudelleen ja kieli vaihdettiin ruotsista englantiin: tallennettu ottelu, kielivalinta ja englanninkielinen ohje toimivat palvelimen ollessa pois käytöstä. Fyysistä iPhonea tai Android-laitetta ei testattu.

Aiemman version 0.6.0 käyttö tarkistettiin Chromium-selaimessa: maalit ja kaksi syöttäjää, torjunnat, jäähyt, tilastot, kellon korjaus ja nollaraja, seuraava erä, uuden ottelun tyhjät kokoonpanot, arkiston säilyminen, kahden ikkunan ristiriidan esto, PNG-kuvakoosteen renderöinti ja JSON-vienti. Sen responsiivinen ulkoasu tarkistettiin 390 px:n ja 320 px:n levyisissä selainkehyksissä sekä työpöytäkoossa. Nämä historialliset tarkistukset eivät ole uuden version selaintestituloksia. Fyysistä iPhonea ei testattu. Tiedostovalitsimen päästä päähän -palautustesti jäi testiselaimen työkaluaikakatkaisun vuoksi vahvistamatta; varmuuskopion validointi testattiin automaattisesti.

`tests/pwa-browser.mjs` on erillinen, valinnainen Playwright-integraatiotesti versiosta 0.5 siirtymiseen ja verkkoyhteyden katkaisuun. Se tarvitsee Playwrightin ja Chromiumin. Tätä testiä ei ajettu kehitysympäristössä, jossa paikallista selainbinääriä ei ollut saatavilla.

Seuraavassa julkaisussa päivitä versionumero yhtenäisesti HTML-metatietoon, moduulien URL-parametreihin, malliin, PWA-ohjaimeen ja service workeriin. Julkaise kaikki resurssit yhdessä commitissa.

## Visuaalisten aineistojen lähteet

Kiekko-Espoon virallinen tunnus ja väripaletti ovat seuran omalta sivustolta. SVG ja PNG säilytetään paikallisina offline-käyttöä varten. Sovellus on epävirallinen ottelutyökalu.

- [Virallinen SVG-tunnus](https://kiekko-espoo.fi/wp-content/themes/uudesti-syntynyt/img/favicon/favicon.svg)
- [Virallinen PNG-tunnus](https://kiekko-espoo.fi/wp-content/themes/uudesti-syntynyt/img/logos/1368624751.png)
- [Visuaalisen ilmeen uudistus](https://kiekko-espoo.fi/uudesti-syntyneena-liigaan/)
- [IIHF:n tilastoraportti: SOG = G + SSG](https://stats.iihf.com/Hydra/415/IHM415000_85A_23_0.pdf)
- [IIHF Official Rule Book 2026/27](https://blob.iihf.com/iihf-media/iihfmvc/media/downloads/rule%20book/2026-27_iihf_rule_book.pdf): englanninkielinen rangaistussanasto.
- [Svenska Ishockeyförbundet: Spelregler för ishockey 2025/26](https://www.swehockey.se/media/abxoat2y/spelregler-foer-ishockey-2025-2026-1.pdf): ruotsinkielisen rangaistussanaston vertailu. Kielipäivitys ei muuta rangaistusten sääntöjä tai tilastointia.

### EKS-kokoonpanot

`rosters.json` sisältää vain sukunimet, annetut pelinumerot ja maalivahdin roolin sekä ottelun ja ryhmän tiedot. Se on julkinen. Ryhmän valinnainen `goalkeeper`-kenttä sisältää `name`-sukunimen ja `number`-numeron; puuttuva numero on `null`. Kenttäpelaajat säilyvät `players`-listassa. Päivitä tiedosto ja sen `updated`-päivämäärä seuraavan ottelutapahtuman yhteydessä. Sovellusjulkaisussa päivitä myös `app.js`:n sisäinen kokoonpano, jotta uusi asennus sisältää saman offline-kopion. Sovellus hakee uudemman tiedoston taustalla verkkoyhteyden aikana ja käyttää offline-tilassa viimeisintä onnistuneesti ladattua kopiota päivämäärineen tai sovellukseen sisältyvää kokoonpanoa. Uuden ottelun lomake ei odota verkkohakua. Valittu kokoonpano kopioidaan otteluun; vanhoja otteluita ei muuteta. Sama numero eri ryhmissä on sallittu, ryhmän sisällä ei. Älä lisää etunimiä tai muita henkilötietoja.

### Offline ensin (0.6.2)
Sovelluksen avaus käyttää asennettua versiota heti. Kokoonpano on mukana myös sovelluksen asennetussa varakopiossa; uudempi onnistuneesti haettu JSON säilytetään paikallisesti. Uuden ottelun lomake ei odota verkkoa eikä muuta valintaa taustapäivityksen aikana. Päivitykset vaativat verkon, ottelun kirjaaminen ei. Käyttäjä hyväksyy sovelluspäivityksen erikseen.
