/** Bundled help copy. Translation markup is trusted, static app content. */
export const HELP_COPY = {
  "quickLabel": "PIKAOHJE",
  "quickTitle": "Valmiina ensimmäiseen peliin.",
  "steps": [
    {
      "title": "Luo ottelu.",
      "body": "Anna joukkueet, paitavärit ja erän pituus. Valitse EKS-kokoonpano tai lisää pelaajat itse."
    },
    {
      "title": "Käynnistä kello.",
      "body": "Paina Aloita erä ja pysäytä kello pelikatkoilla."
    },
    {
      "title": "Kirjaa tilanne.",
      "body": "Torjunta tallentuu yhdellä painalluksella torjuneen joukkueen värillisestä napista. Maalille ja jäähylle valitse joukkue, täytä tiedot ja tallenna."
    }
  ],
  "feedbackTitle": "Tehdään tästä parempi.",
  "bugTitle": "Ilmoita bugista",
  "bugSubtitle": "Jokin ei toimi oikein",
  "ideaTitle": "Ehdota ominaisuutta",
  "ideaSubtitle": "Mikä helpottaisi kirjaamista?",
  "feedbackNote": "Voit kirjoittaa palautteen myös ilman nettiä. Lähetät sen kehittäjälle omasta sähköpostistasi.",
  "guideTitle": "Käyttöohje",
  "guideNote": "Avaa tarvitsemasi kohta",
  "topics": [
    {
      "title": "Pelaajat ja kokoonpanot",
      "paragraphs": [
        "<strong>Uusi ottelu</strong> -lomakkeessa voit valita valmiin EKS-ryhmän. Tarkista kokoonpanon ottelu ja päivämäärä sekä se, pelaako EKS kotona vai vieraissa. Voit myös aloittaa tyhjillä pelaajalistoilla.",
        "Valitse kummallekin joukkueelle paitaväri <strong>Uusi ottelu</strong> -lomakkeessa tai <strong>Ottelun asetuksissa</strong>. Väri näkyy tulostaulussa, torjuntapainikkeissa ja joukkuevalinnoissa. Joukkueen nimi näkyy aina värin rinnalla, jotta tunnistaminen ei perustu pelkkään väriin.",
        "Valitse <strong>Pelaajat</strong>-välilehdellä ensin joukkue ja lisää pelinumerot. Numero 0 käy myös. Sukunimi on valinnainen, ja sen voi täydentää pelaajaa napauttamalla.",
        "Tapahtumaan kirjoitettu uusi numero lisätään tämän ottelun kokoonpanoon. Molemmilla joukkueilla voi olla sama numero.",
        "Voit asettaa kummankin joukkueen maalivahdin numeron jo <strong>Uusi ottelu</strong> -lomakkeessa tai myöhemmin <strong>Ottelun asetuksissa</strong>. Voit myös valita maalivahdin ottelunäkymän <strong>Maalivahdit</strong>-painikkeesta tai <strong>Pelaajat</strong>-välilehdellä. Valinta säilyy erien välillä ja sovelluksen sulkemisen jälkeen myös ilman nettiä."
      ]
    },
    {
      "title": "Kello, erät ja tapahtuma-aika",
      "paragraphs": [
        "Valitse erän pituus ennen aloitusta. <strong>Aloita erä</strong> käynnistää alaspäin laskevan kellon. Käytä pelikatkoilla <strong>Pysäytä</strong>- ja <strong>Jatka erää</strong> -painikkeita.",
        "Tapahtumapainike ottaa ajan talteen heti painalluksesta. Kello jatkaa kulkuaan, vaikka valitset pelaajaa. Tapahtumissa näkyy <strong>kulunut eräaika</strong>: jos 20 minuutin erässä on jäljellä 17:30, tapahtuma-aika on 02:30.",
        "<strong>Ottelun asetukset → Korjaa kelloa</strong> asettaa jäljellä olevan ajan. Se ei muuta aiempien tapahtumien aikoja. <strong>Seuraava erä</strong> valmistelee uuden erän; käynnistä sen kello erikseen."
      ]
    },
    {
      "title": "Maalit, torjunnat ja jäähyt",
      "paragraphs": [
        "Ottelunäkymässä kello ja kirjauspainikkeet pysyvät paikallaan. Vain <strong>Tapahtumat</strong>-lista vierii, kun selaat aiempia kirjauksia.",
        "<strong>Maali:</strong> valitse maalin tehnyt joukkue, maalintekijä ja halutessasi enintään kaksi syöttäjää. Pelaajan voi jättää avoimeksi ja täydentää myöhemmin.",
        "<strong>Torjunta:</strong> napauta ottelunäkymässä torjuneen joukkueen värillistä <strong>Torjunta</strong>-painiketta. Torjunta ja tapahtuma-aika tallentuvat heti ilman lisäkysymyksiä tai vahvistusta.",
        "Torjunta käyttää joukkueelle valittua maalivahtia. Jos maalivahtia ei ole valittu, torjunta kirjataan heti ilman numeroa joukkueen tilastoihin. Vastustajalle lisätään samalla yksi laukaus maalia kohti.",
        "Paina ottelunäkymässä <strong>Maalivahdit</strong> ja valitse joukkue, jonka maalivahdin haluat asettaa tai vaihtaa. Maalivahdin voi vaihtaa myös <strong>Pelaajat</strong>-välilehdellä tai <strong>Ottelun asetuksissa</strong>. Vaihto ei kirjaa torjuntaa ja vaikuttaa vain seuraaviin torjuntoihin. Täydennä tai korjaa aiempien merkintöjen maalivahdit erikseen tapahtumarivin kynästä.",
        "<div class=\"help-formula\"><strong>Laukaukset maalia kohti</strong><span>omat maalit + vastustajan torjunnat</span></div>",
        "Maali lisää myös laukauksen tehneelle joukkueelle. Ohi menneitä ja blokattuja laukauksia ei kirjata näihin lukuihin.",
        "<strong>Jäähy:</strong> valitse rangaistuksen saanut joukkue ja pelaaja, syy sekä rangaistuksen tyyppi. Tarvittaessa valitse <strong>Muu rangaistus / oma minuuttimäärä</strong>. Sovellus kirjaa rangaistukset, mutta ei laske niiden päättymistä pelitilanteen mukaan."
      ]
    },
    {
      "title": "Virheen korjaaminen",
      "paragraphs": [
        "Napauta tapahtumarivin <strong>kynää</strong>. Voit vaihtaa joukkueen, pelaajan, syöttäjät tai jäähytiedot. <strong>Korjaa tapahtuma-aikaa</strong> avaa erän ja kuluneen eräajan muokkauksen.",
        "Tallennuksen tai poiston jälkeen <strong>Kumoa</strong> näkyy hetken alareunassa. Myöhemmin voit korjata merkinnän kynästä tai poistaa sen muokkausikkunan roskakorilla. Tulos ja tilastot päivittyvät samalla."
      ]
    },
    {
      "title": "Pelin päättäminen ja seuraava ottelu",
      "paragraphs": [
        "Valitse <strong>Ottelun asetukset → Merkitse ottelu päättyneeksi</strong>. Kello pysähtyy ja voit tehdä koosteen. <strong>Jatka ottelua</strong> avaa pelin tarvittaessa uudelleen.",
        "<strong>Uusi ottelu</strong> siirtää nykyisen pelin arkistoon ja aloittaa uuden tuloksesta 0–0. Valitse uudelle pelille kokoonpano ja joukkueiden paitavärit sekä halutessasi maalivahdit.",
        "Vanhat pelit löytyvät <strong>Ottelut</strong>-välilehdeltä. Valitse peli ja <strong>Avaa ottelu</strong>, jos haluat korjata sitä. Nykyinen keskeneräinen peli säilytetään arkistossa."
      ]
    },
    {
      "title": "Tilastot ja ottelukooste",
      "paragraphs": [
        "<strong>Tilastot</strong>-välilehdellä näkyvät joukkueiden ja pelaajien luvut. Pelaajan pisteet ovat maalit ja syötöt yhteensä.",
        "<strong>Jaa ottelu</strong> tekee yhden kuvan ja katselulinkin samaan otteluun. Valitse ensin kuvan kieli: <strong>Suomi, English tai Svenska</strong>. Jaa sitten kuva ja linkki esimerkiksi WhatsApp-ryhmään.",
        "Linkin avaaja valitsee koostesivulla itse <strong>suomen, englannin tai ruotsin</strong>. Tunnusta ei tarvita. Katselu ei muuta vastaanottajan omaa ottelua tai kirjaussovelluksen kielivalintaa.",
        "Linkki näyttää <strong>jakamishetken tilanteen</strong>. Jos korjaat ottelua myöhemmin, jaa uusi linkki. Linkin saanut voi avata koosteen ja välittää linkin edelleen.",
        "<strong>Ottelukuva</strong> tekee erillisen PNG-kuvan. <strong>Tekstikooste</strong> sisältää kaikki tapahtumat ja tilastot; voit kopioida sen tai ladata tekstitiedoston. Kieli kysytään joka kerta, eikä valinta muuta sovelluksen käyttökieltä.",
        "Kuvan, tekstikoosteen ja linkin voi valmistella ilman nettiä. Viestin lähettäminen ja koostesivun ensimmäinen avaaminen tarvitsevat verkkoyhteyden.",
        "Jos jakokohde ei lisää linkkiä kuvan mukaan, käytä <strong>Kopioi linkki</strong> ja liitä linkki viestiin.",
        "Myös arkistoidun ottelun koosteet saa <strong>Ottelut</strong>-välilehdeltä."
      ]
    },
    {
      "title": "Tallennus, varmuuskopio ja toinen puhelin",
      "paragraphs": [
        "Ottelut tallentuvat automaattisesti tähän laitteeseen. Eri toimitsijoiden puhelimet eivät synkronoi kirjauksia keskenään.",
        "<strong>Vie varmuuskopio</strong> tallentaa nykyisen ottelun ja arkiston yhteen JSON-tiedostoon. Säilytä tiedosto puhelimen tiedostoissa tai haluamassasi paikassa.",
        "<strong>Palauta varmuuskopio</strong> avaa tiedoston myös toisessa laitteessa. Palautus <strong>korvaa</strong> siinä jo olevat ottelut, joten vie niistä tarvittaessa ensin oma varmuuskopio.",
        "Selaimen sivustotietojen poistaminen poistaa paikalliset ottelut. Ota varmuuskopio myös ennen vanhan kotikuvakkeen vaihtamista."
      ]
    },
    {
      "title": "Ilman nettiä ja kotinäytön kuvake",
      "paragraphs": [
        "Lisää sovellus puhelimen kotinäytölle ja avaa <strong>uusi kuvake kerran netissä</strong>. Odota, että valikossa lukee <strong>Valmis myös ilman yhteyttä</strong>. Sen jälkeen voit avata sovelluksen, kirjata ottelun ja tehdä koosteet myös hallissa ilman nettiä.",
        "Ensimmäinen asennus, uudet kokoonpanot, sovelluspäivitykset ja sähköpostin lähetys tarvitsevat yhteyden. Asennettu ohje ja palauteluonnos toimivat ilman verkkoa."
      ],
      "installButton": true
    },
    {
      "title": "Kielen vaihtaminen",
      "paragraphs": [
        "Valitse yläpalkin kielipainikkeesta <strong>Suomi, English tai Svenska</strong>. Kielivalinta löytyy myös asetuksista. Valinta tallentuu tähän laitteeseen ja toimii ilman nettiä.",
        "Käyttöohje ja palautelomake käyttävät sovelluksen kieltä. Koosteen ja kuvan kieli valitaan erikseen, ja jaetun linkin avaaja valitsee oman katselukielensä. Joukkueiden ja pelaajien nimiä tai itse kirjoitettuja tietoja ei käännetä."
      ]
    }
  ],
  "installButton": "Asennusohje: iPhone ja Android",
  "question": "Jäikö jokin epäselväksi? Kysy kehittäjältä.",
  "footer": "Kiekkokirjuri {version} · Ohje toimii myös ilman nettiä."
};

export const HELP_MESSAGES = {
  "Ottelunäkymässä kello ja kirjauspainikkeet pysyvät paikallaan. Vain <strong>Tapahtumat</strong>-lista vierii, kun selaat aiempia kirjauksia.": {
    "en": "The clock and recording buttons stay in place in the match view. Only the <strong>Events</strong> list scrolls when you review earlier entries.",
    "sv": "Klockan och registreringsknapparna ligger kvar på samma plats i matchvyn. Bara listan <strong>Händelser</strong> rullar när du bläddrar bland tidigare registreringar."
  },
  "PIKAOHJE": {
    "en": "QUICK START",
    "sv": "KOM IGÅNG"
  },
  "Valmiina ensimmäiseen peliin.": {
    "en": "Ready for your first match.",
    "sv": "Redo för första matchen."
  },
  "Luo ottelu.": {
    "en": "Create a match.",
    "sv": "Skapa en match."
  },
  "Käynnistä kello.": {
    "en": "Start the clock.",
    "sv": "Starta klockan."
  },
  "Paina Aloita erä ja pysäytä kello pelikatkoilla.": {
    "en": "Tap Start period and pause the clock during stoppages.",
    "sv": "Tryck på Starta perioden och pausa klockan vid spelavbrott."
  },
  "Kirjaa tilanne.": {
    "en": "Record the play.",
    "sv": "Registrera händelsen."
  },
  "Tehdään tästä parempi.": {
    "en": "Help make it better.",
    "sv": "Hjälp oss att förbättra appen."
  },
  "Ilmoita bugista": {
    "en": "Report a bug",
    "sv": "Rapportera ett fel"
  },
  "Jokin ei toimi oikein": {
    "en": "Something is not working",
    "sv": "Något fungerar inte"
  },
  "Ehdota ominaisuutta": {
    "en": "Suggest a feature",
    "sv": "Föreslå en funktion"
  },
  "Mikä helpottaisi kirjaamista?": {
    "en": "What would make recording easier?",
    "sv": "Vad skulle göra registreringen enklare?"
  },
  "Voit kirjoittaa palautteen myös ilman nettiä. Lähetät sen kehittäjälle omasta sähköpostistasi.": {
    "en": "You can write feedback offline. Send it to the developer from your own email app.",
    "sv": "Du kan skriva respons utan internet. Skicka den till utvecklaren från din egen e-postapp."
  },
  "Käyttöohje": {
    "en": "User guide",
    "sv": "Bruksanvisning"
  },
  "Avaa tarvitsemasi kohta": {
    "en": "Open the section you need",
    "sv": "Öppna det avsnitt du behöver"
  },
  "Pelaajat ja kokoonpanot": {
    "en": "Players and line-ups",
    "sv": "Spelare och laguppställningar"
  },
  "<strong>Uusi ottelu</strong> -lomakkeessa voit valita valmiin EKS-ryhmän. Tarkista kokoonpanon ottelu ja päivämäärä sekä se, pelaako EKS kotona vai vieraissa. Voit myös aloittaa tyhjillä pelaajalistoilla.": {
    "en": "In <strong>New match</strong>, you can choose a prepared EKS group. Check the match and date shown for the line-up, and whether EKS is the home or away team. You can also start with empty player lists.",
    "sv": "Under <strong>Ny match</strong> kan du välja en färdig EKS-grupp. Kontrollera laguppställningens match och datum samt om EKS är hemma- eller bortalag. Du kan också börja med tomma spelarlistor."
  },
  "Valitse <strong>Pelaajat</strong>-välilehdellä ensin joukkue ja lisää pelinumerot. Numero 0 käy myös. Sukunimi on valinnainen, ja sen voi täydentää pelaajaa napauttamalla.": {
    "en": "On the <strong>Players</strong> tab, choose a team and add jersey numbers. Number 0 is valid too. A surname is optional; tap a player to add it later.",
    "sv": "Välj först lag på fliken <strong>Spelare</strong> och lägg till tröjnumren. Nummer 0 fungerar också. Efternamnet är valfritt och kan läggas till senare genom att trycka på spelaren."
  },
  "Tapahtumaan kirjoitettu uusi numero lisätään tämän ottelun kokoonpanoon. Molemmilla joukkueilla voi olla sama numero.": {
    "en": "A new number entered for an event is added to this match’s line-up. Both teams can have a player with the same number.",
    "sv": "Ett nytt nummer som anges för en händelse läggs till i matchens laguppställning. Båda lagen kan ha en spelare med samma nummer."
  },
  "Kello, erät ja tapahtuma-aika": {
    "en": "Clock, periods and event times",
    "sv": "Klocka, perioder och händelsetider"
  },
  "Valitse erän pituus ennen aloitusta. <strong>Aloita erä</strong> käynnistää alaspäin laskevan kellon. Käytä pelikatkoilla <strong>Pysäytä</strong>- ja <strong>Jatka erää</strong> -painikkeita.": {
    "en": "Choose the period length before starting. <strong>Start period</strong> starts the countdown. Use <strong>Pause</strong> and <strong>Resume period</strong> at stoppages.",
    "sv": "Välj periodlängd innan matchen börjar. <strong>Starta perioden</strong> startar nedräkningen. Använd <strong>Pausa</strong> och <strong>Fortsätt perioden</strong> vid spelavbrott."
  },
  "Tapahtumapainike ottaa ajan talteen heti painalluksesta. Kello jatkaa kulkuaan, vaikka valitset pelaajaa. Tapahtumissa näkyy <strong>kulunut eräaika</strong>: jos 20 minuutin erässä on jäljellä 17:30, tapahtuma-aika on 02:30.": {
    "en": "Tapping an event button captures the time immediately. The clock keeps running while you select a player. Events show <strong>elapsed period time</strong>: with 17:30 remaining in a 20-minute period, the event time is 02:30.",
    "sv": "Tiden registreras direkt när du trycker på en händelseknapp. Klockan fortsätter gå medan du väljer spelare. Händelser visar <strong>spelad tid i perioden</strong>: när 17:30 återstår av en 20-minutersperiod är händelsetiden 02:30."
  },
  "<strong>Ottelun asetukset → Korjaa kelloa</strong> asettaa jäljellä olevan ajan. Se ei muuta aiempien tapahtumien aikoja. <strong>Seuraava erä</strong> valmistelee uuden erän; käynnistä sen kello erikseen.": {
    "en": "<strong>Match settings → Adjust clock</strong> sets the time remaining. It does not change earlier event times. <strong>Next period</strong> prepares a new period; start its clock separately.",
    "sv": "<strong>Matchinställningar → Justera klockan</strong> ställer in återstående tid. Tidigare händelsetider ändras inte. <strong>Nästa period</strong> förbereder en ny period; starta dess klocka separat."
  },
  "Maalit, torjunnat ja jäähyt": {
    "en": "Goals, saves and penalties",
    "sv": "Mål, räddningar och utvisningar"
  },
  "<strong>Maali:</strong> valitse maalin tehnyt joukkue, maalintekijä ja halutessasi enintään kaksi syöttäjää. Pelaajan voi jättää avoimeksi ja täydentää myöhemmin.": {
    "en": "<strong>Goal:</strong> choose the scoring team, scorer and up to two assisting players. You can leave the player unassigned and add them later.",
    "sv": "<strong>Mål:</strong> välj laget som gjorde mål, målskytten och upp till två spelare som fick assist. Du kan lämna spelaren tom och komplettera senare."
  },
  "<div class=\"help-formula\"><strong>Laukaukset maalia kohti</strong><span>omat maalit + vastustajan torjunnat</span></div>": {
    "en": "<div class=\"help-formula\"><strong>Shots on goal</strong><span>your team’s goals + the opponents’ saves</span></div>",
    "sv": "<div class=\"help-formula\"><strong>Skott på mål</strong><span>egna mål + motståndarnas räddningar</span></div>"
  },
  "Maali lisää myös laukauksen tehneelle joukkueelle. Ohi menneitä ja blokattuja laukauksia ei kirjata näihin lukuihin.": {
    "en": "A goal also adds a shot on goal for the scoring team. Missed and blocked shots are not included in these figures.",
    "sv": "Ett mål ger också laget ett skott på mål. Skott utanför och blockerade skott räknas inte med i dessa siffror."
  },
  "<strong>Jäähy:</strong> valitse rangaistuksen saanut joukkue ja pelaaja, syy sekä rangaistuksen tyyppi. Tarvittaessa valitse <strong>Muu rangaistus / oma minuuttimäärä</strong>. Sovellus kirjaa rangaistukset, mutta ei laske niiden päättymistä pelitilanteen mukaan.": {
    "en": "<strong>Penalty:</strong> choose the penalised team and player, the offence and penalty type. If needed, choose <strong>Other penalty / custom duration</strong>. The app records penalties but does not calculate when they expire based on the game situation.",
    "sv": "<strong>Utvisning:</strong> välj laget och spelaren som får utvisningen, förseelsen och strafftypen. Välj vid behov <strong>Annan utvisning / egen strafftid</strong>. Appen registrerar utvisningar men beräknar inte när de upphör utifrån matchsituationen."
  },
  "Virheen korjaaminen": {
    "en": "Correcting an entry",
    "sv": "Korrigera en händelse"
  },
  "Napauta tapahtumarivin <strong>kynää</strong>. Voit vaihtaa joukkueen, pelaajan, syöttäjät tai jäähytiedot. <strong>Korjaa tapahtuma-aikaa</strong> avaa erän ja kuluneen eräajan muokkauksen.": {
    "en": "Tap the <strong>pencil</strong> on an event row. You can change the team, player, assists or penalty details. <strong>Adjust event time</strong> lets you edit the period and elapsed time.",
    "sv": "Tryck på <strong>pennan</strong> på händelseraden. Du kan ändra lag, spelare, assist eller utvisningsuppgifter. <strong>Justera händelsens tid</strong> låter dig ändra period och spelad tid."
  },
  "Tallennuksen tai poiston jälkeen <strong>Kumoa</strong> näkyy hetken alareunassa. Myöhemmin voit korjata merkinnän kynästä tai poistaa sen muokkausikkunan roskakorilla. Tulos ja tilastot päivittyvät samalla.": {
    "en": "After saving or deleting, <strong>Undo</strong> appears briefly at the bottom. Later, use the pencil to edit an entry or the bin in the edit window to delete it. The score and statistics update too.",
    "sv": "Efter att du sparat eller tagit bort något visas <strong>Ångra</strong> en kort stund längst ned. Senare kan du redigera med pennan eller ta bort händelsen med papperskorgen i redigeringsfönstret. Resultatet och statistiken uppdateras samtidigt."
  },
  "Pelin päättäminen ja seuraava ottelu": {
    "en": "Finishing a match and starting the next",
    "sv": "Avsluta matchen och starta nästa"
  },
  "Valitse <strong>Ottelun asetukset → Merkitse ottelu päättyneeksi</strong>. Kello pysähtyy ja voit tehdä koosteen. <strong>Jatka ottelua</strong> avaa pelin tarvittaessa uudelleen.": {
    "en": "Choose <strong>Match settings → Mark match as finished</strong>. The clock stops and you can create a summary. <strong>Resume match</strong> reopens the match if needed.",
    "sv": "Välj <strong>Matchinställningar → Markera matchen som avslutad</strong>. Klockan stannar och du kan skapa en sammanfattning. <strong>Fortsätt matchen</strong> öppnar matchen igen vid behov."
  },
  "Vanhat pelit löytyvät <strong>Ottelut</strong>-välilehdeltä. Valitse peli ja <strong>Avaa ottelu</strong>, jos haluat korjata sitä. Nykyinen keskeneräinen peli säilytetään arkistossa.": {
    "en": "Previous matches are on the <strong>Matches</strong> tab. Choose a match and <strong>Open match</strong> to make corrections. The current unfinished match is kept in the archive.",
    "sv": "Tidigare matcher finns på fliken <strong>Matcher</strong>. Välj en match och <strong>Öppna match</strong> för att göra ändringar. Den pågående matchen sparas i arkivet."
  },
  "Tilastot ja ottelukooste": {
    "en": "Statistics and match summaries",
    "sv": "Statistik och matchsammanfattningar"
  },
  "<strong>Tilastot</strong>-välilehdellä näkyvät joukkueiden ja pelaajien luvut. Pelaajan pisteet ovat maalit ja syötöt yhteensä.": {
    "en": "The <strong>Statistics</strong> tab shows team and player figures. A player’s points are their goals plus assists.",
    "sv": "Fliken <strong>Statistik</strong> visar lagens och spelarnas siffror. En spelares poäng är mål och assist tillsammans."
  },
  "<strong>Jaa ottelu</strong> tekee yhden kuvan ja katselulinkin samaan otteluun. Valitse ensin kuvan kieli: <strong>Suomi, English tai Svenska</strong>. Jaa sitten kuva ja linkki esimerkiksi WhatsApp-ryhmään.": {
    "en": "<strong>Share match</strong> creates one image and a viewing link for the same match. First choose the image language: <strong>Suomi, English or Svenska</strong>. Then share the image and link, for example in a WhatsApp group.",
    "sv": "<strong>Dela match</strong> skapar en bild och en visningslänk till samma match. Välj först bildens språk: <strong>Suomi, English eller Svenska</strong>. Dela sedan bilden och länken, till exempel i en WhatsApp-grupp."
  },
  "Linkin avaaja valitsee koostesivulla itse <strong>suomen, englannin tai ruotsin</strong>. Tunnusta ei tarvita. Katselu ei muuta vastaanottajan omaa ottelua tai kirjaussovelluksen kielivalintaa.": {
    "en": "Anyone opening the link can choose <strong>Finnish, English or Swedish</strong> on the summary page. No account is needed. Viewing does not change the recipient’s own match or the recorder’s language setting.",
    "sv": "Den som öppnar länken väljer själv <strong>finska, engelska eller svenska</strong> på sammanfattningssidan. Inget konto behövs. Visningen ändrar inte mottagarens egen match eller språkval i registreringsappen."
  },
  "Linkki näyttää <strong>jakamishetken tilanteen</strong>. Jos korjaat ottelua myöhemmin, jaa uusi linkki. Linkin saanut voi avata koosteen ja välittää linkin edelleen.": {
    "en": "The link shows <strong>the match as it was when shared</strong>. If you correct the match later, share a new link. Anyone with the link can view the summary and forward the link.",
    "sv": "Länken visar <strong>matchens läge när den delades</strong>. Om du rättar matchen senare behöver du dela en ny länk. Den som har länken kan se sammanfattningen och skicka länken vidare."
  },
  "<strong>Ottelukuva</strong> tekee erillisen PNG-kuvan. <strong>Tekstikooste</strong> sisältää kaikki tapahtumat ja tilastot; voit kopioida sen tai ladata tekstitiedoston. Kieli kysytään joka kerta, eikä valinta muuta sovelluksen käyttökieltä.": {
    "en": "<strong>Match image</strong> creates a separate PNG image. <strong>Text summary</strong> includes all events and statistics; copy it or download a text file. You choose the language each time, without changing the app’s language.",
    "sv": "<strong>Matchbild</strong> skapar en separat PNG-bild. <strong>Textsammanfattning</strong> innehåller alla händelser och all statistik; kopiera den eller ladda ned en textfil. Du väljer språk varje gång utan att ändra appens språk."
  },
  "Kuvan, tekstikoosteen ja linkin voi valmistella ilman nettiä. Viestin lähettäminen ja koostesivun ensimmäinen avaaminen tarvitsevat verkkoyhteyden.": {
    "en": "You can prepare the image, text summary and link offline. Sending the message and opening the summary page for the first time need an internet connection.",
    "sv": "Du kan förbereda bilden, textsammanfattningen och länken utan internet. För att skicka meddelandet och öppna sammanfattningssidan första gången behövs en internetanslutning."
  },
  "Jos jakokohde ei lisää linkkiä kuvan mukaan, käytä <strong>Kopioi linkki</strong> ja liitä linkki viestiin.": {
    "en": "If the sharing app does not include the link with the image, use <strong>Copy link</strong> and paste the link into the message.",
    "sv": "Om appen du delar till inte tar med länken tillsammans med bilden använder du <strong>Kopiera länk</strong> och klistrar in länken i meddelandet."
  },
  "Myös arkistoidun ottelun koosteet saa <strong>Ottelut</strong>-välilehdeltä.": {
    "en": "You can also create summaries of archived matches from the <strong>Matches</strong> tab.",
    "sv": "Du kan också skapa sammanfattningar av arkiverade matcher på fliken <strong>Matcher</strong>."
  },
  "Tallennus, varmuuskopio ja toinen puhelin": {
    "en": "Storage, backups and another phone",
    "sv": "Lagring, säkerhetskopior och en annan telefon"
  },
  "Ottelut tallentuvat automaattisesti tähän laitteeseen. Eri toimitsijoiden puhelimet eivät synkronoi kirjauksia keskenään.": {
    "en": "Matches are saved automatically on this device. Different officials’ phones do not sync entries with each other.",
    "sv": "Matcher sparas automatiskt på den här enheten. Funktionärernas telefoner synkroniserar inte registreringar med varandra."
  },
  "<strong>Vie varmuuskopio</strong> tallentaa nykyisen ottelun ja arkiston yhteen JSON-tiedostoon. Säilytä tiedosto puhelimen tiedostoissa tai haluamassasi paikassa.": {
    "en": "<strong>Export backup</strong> saves the current match and archive in one JSON file. Keep it in your phone’s files or another location you choose.",
    "sv": "<strong>Exportera säkerhetskopia</strong> sparar den nuvarande matchen och arkivet i en JSON-fil. Spara filen bland telefonens filer eller på en annan plats du väljer."
  },
  "<strong>Palauta varmuuskopio</strong> avaa tiedoston myös toisessa laitteessa. Palautus <strong>korvaa</strong> siinä jo olevat ottelut, joten vie niistä tarvittaessa ensin oma varmuuskopio.": {
    "en": "<strong>Restore backup</strong> can open the file on another device too. Restoring <strong>replaces</strong> the matches already on that device, so export a backup of them first if needed.",
    "sv": "<strong>Återställ säkerhetskopia</strong> kan öppna filen även på en annan enhet. Återställningen <strong>ersätter</strong> matcherna som redan finns där, så exportera vid behov en säkerhetskopia av dem först."
  },
  "Selaimen sivustotietojen poistaminen poistaa paikalliset ottelut. Ota varmuuskopio myös ennen vanhan kotikuvakkeen vaihtamista.": {
    "en": "Clearing the browser’s site data deletes local matches. Also make a backup before replacing an old home screen icon.",
    "sv": "Om du raderar webbplatsdata i webbläsaren försvinner de lokala matcherna. Gör också en säkerhetskopia innan du byter ut en gammal hemskärmsikon."
  },
  "Ilman nettiä ja kotinäytön kuvake": {
    "en": "Offline use and the home screen icon",
    "sv": "Utan internet och ikonen på hemskärmen"
  },
  "Lisää sovellus puhelimen kotinäytölle ja avaa <strong>uusi kuvake kerran netissä</strong>. Odota, että valikossa lukee <strong>Valmis myös ilman yhteyttä</strong>. Sen jälkeen voit avata sovelluksen, kirjata ottelun ja tehdä koosteet myös hallissa ilman nettiä.": {
    "en": "Add the app to your phone’s home screen and <strong>open the new icon once while online</strong>. Wait until the menu says <strong>Ready to use offline</strong>. You can then open the app, record a match and create summaries at the rink without internet.",
    "sv": "Lägg till appen på telefonens hemskärm och <strong>öppna den nya ikonen en gång med internetanslutning</strong>. Vänta tills menyn visar <strong>Klar att använda offline</strong>. Sedan kan du öppna appen, registrera en match och skapa sammanfattningar i hallen utan internet."
  },
  "Ensimmäinen asennus, uudet kokoonpanot, sovelluspäivitykset ja sähköpostin lähetys tarvitsevat yhteyden. Asennettu ohje ja palauteluonnos toimivat ilman verkkoa.": {
    "en": "The initial installation, new line-ups, app updates and sending email require a connection. The installed guide and saved feedback draft work offline.",
    "sv": "Den första installationen, nya laguppställningar, appuppdateringar och e-postsändning kräver internet. Den installerade bruksanvisningen och sparad respons fungerar utan internet."
  },
  "Kielen vaihtaminen": {
    "en": "Changing the language",
    "sv": "Byta språk"
  },
  "Valitse yläpalkin kielipainikkeesta <strong>Suomi, English tai Svenska</strong>. Kielivalinta löytyy myös asetuksista. Valinta tallentuu tähän laitteeseen ja toimii ilman nettiä.": {
    "en": "Use the language button in the header to choose <strong>Suomi, English or Svenska</strong>. You can also change the language in settings. Your choice is saved on this device and works offline.",
    "sv": "Välj <strong>Suomi, English eller Svenska</strong> med språkknappen högst upp. Språkvalet finns också i inställningarna. Ditt val sparas på den här enheten och fungerar utan internet."
  },
  "Käyttöohje ja palautelomake käyttävät sovelluksen kieltä. Koosteen ja kuvan kieli valitaan erikseen, ja jaetun linkin avaaja valitsee oman katselukielensä. Joukkueiden ja pelaajien nimiä tai itse kirjoitettuja tietoja ei käännetä.": {
    "en": "The guide and feedback form use the app’s language. Choose the summary and image language separately; anyone opening a shared link chooses their own viewing language. Team and player names and your own text are not translated.",
    "sv": "Bruksanvisningen och responsformuläret använder appens språk. Sammanfattningens och bildens språk väljs separat, och den som öppnar en delad länk väljer sitt eget visningsspråk. Lag- och spelarnamn samt egen text översätts inte."
  },
  "Asennusohje: iPhone ja Android": {
    "en": "Installation: iPhone and Android",
    "sv": "Installation: iPhone och Android"
  },
  "Jäikö jokin epäselväksi? Kysy kehittäjältä.": {
    "en": "Still have a question? Ask the developer.",
    "sv": "Är något fortfarande oklart? Fråga utvecklaren."
  },
  "Kiekkokirjuri {version} · Ohje toimii myös ilman nettiä.": {
    "en": "Kiekkokirjuri {version} · This guide works offline too.",
    "sv": "Kiekkokirjuri {version} · Bruksanvisningen fungerar även utan internet."
  },
  "Anna joukkueet, paitavärit ja erän pituus. Valitse EKS-kokoonpano tai lisää pelaajat itse.": {
    "en": "Enter the teams, shirt colours and period length. Choose an EKS line-up or add the players yourself.",
    "sv": "Ange lagen, tröjfärgerna och periodlängden. Välj en EKS-laguppställning eller lägg till spelarna själv."
  },
  "Torjunta tallentuu yhdellä painalluksella torjuneen joukkueen värillisestä napista. Maalille ja jäähylle valitse joukkue, täytä tiedot ja tallenna.": {
    "en": "Record a save with one tap on the coloured button for the team that made the save. For goals and penalties, choose the team, add the details and save.",
    "sv": "Registrera en räddning med ett tryck på den färgade knappen för laget som räddade. För mål och utvisningar väljer du lag, fyller i uppgifterna och sparar."
  },
  "Voit asettaa kummankin joukkueen maalivahdin numeron jo <strong>Uusi ottelu</strong> -lomakkeessa tai myöhemmin <strong>Ottelun asetuksissa</strong>. Voit myös valita maalivahdin ottelunäkymän <strong>Maalivahdit</strong>-painikkeesta tai <strong>Pelaajat</strong>-välilehdellä. Valinta säilyy erien välillä ja sovelluksen sulkemisen jälkeen myös ilman nettiä.": {
    "en": "Set each team’s goalkeeper number in the <strong>New match</strong> form or later in <strong>Match settings</strong>. You can also choose a goalkeeper using <strong>Goalkeepers</strong> in the match view or on the <strong>Players</strong> tab. The selection is retained between periods and after closing the app, including offline.",
    "sv": "Ange målvaktens nummer för varje lag redan i formuläret <strong>Ny match</strong> eller senare i <strong>Matchinställningar</strong>. Du kan också välja målvakt via <strong>Målvakter</strong> i matchvyn eller på fliken <strong>Spelare</strong>. Valet finns kvar mellan perioderna och när du stänger appen, även utan internet."
  },
  "<strong>Torjunta:</strong> napauta ottelunäkymässä torjuneen joukkueen värillistä <strong>Torjunta</strong>-painiketta. Torjunta ja tapahtuma-aika tallentuvat heti ilman lisäkysymyksiä tai vahvistusta.": {
    "en": "<strong>Save:</strong> tap the coloured <strong>Save</strong> button for the team that made the save on the match screen. The save and event time are recorded immediately, without extra questions or confirmation.",
    "sv": "<strong>Räddning:</strong> tryck på den färgade <strong>Räddning</strong>-knappen för laget som räddade i matchvyn. Räddningen och händelsetiden sparas direkt, utan extra frågor eller bekräftelse."
  },
  "Torjunta käyttää joukkueelle valittua maalivahtia. Jos maalivahtia ei ole valittu, torjunta kirjataan heti ilman numeroa joukkueen tilastoihin. Vastustajalle lisätään samalla yksi laukaus maalia kohti.": {
    "en": "The save uses the goalkeeper selected for that team. If no goalkeeper is selected, the save is recorded immediately without a number in the team totals. One shot on goal is also added to the opposing team.",
    "sv": "Räddningen registreras på lagets valda målvakt. Om ingen målvakt har valts registreras räddningen direkt utan nummer i lagets statistik. Motståndarlaget får samtidigt ett skott på mål."
  },
  "Paina ottelunäkymässä <strong>Maalivahdit</strong> ja valitse joukkue, jonka maalivahdin haluat asettaa tai vaihtaa. Maalivahdin voi vaihtaa myös <strong>Pelaajat</strong>-välilehdellä tai <strong>Ottelun asetuksissa</strong>. Vaihto ei kirjaa torjuntaa ja vaikuttaa vain seuraaviin torjuntoihin. Täydennä tai korjaa aiempien merkintöjen maalivahdit erikseen tapahtumarivin kynästä.": {
    "en": "Tap <strong>Goalkeepers</strong> in the match view and choose the team whose goalkeeper you want to select or change. You can also change the goalkeeper on the <strong>Players</strong> tab or in <strong>Match settings</strong>. Changing the goalkeeper does not record a save and only affects future saves. Add or correct goalkeepers on earlier entries individually using the pencil on the event row.",
    "sv": "Tryck på <strong>Målvakter</strong> i matchvyn och välj laget vars målvakt du vill ange eller byta. Du kan också byta målvakt på fliken <strong>Spelare</strong> eller i <strong>Matchinställningar</strong>. Bytet registrerar ingen räddning och gäller bara kommande räddningar. Komplettera eller korrigera målvakter för tidigare registreringar separat med pennan på händelseraden."
  },
  "<strong>Uusi ottelu</strong> siirtää nykyisen pelin arkistoon ja aloittaa uuden tuloksesta 0–0. Valitse uudelle pelille kokoonpano ja joukkueiden paitavärit sekä halutessasi maalivahdit.": {
    "en": "<strong>New match</strong> moves the current match to the archive and starts a new one at 0–0. Choose the line-up and team shirt colours for the new match, and optionally the goalkeepers.",
    "sv": "<strong>Ny match</strong> flyttar den nuvarande matchen till arkivet och startar en ny från 0–0. Välj laguppställning och lagens tröjfärger för den nya matchen, och målvakter om du vill."
  },
  "Valitse kummallekin joukkueelle paitaväri <strong>Uusi ottelu</strong> -lomakkeessa tai <strong>Ottelun asetuksissa</strong>. Väri näkyy tulostaulussa, torjuntapainikkeissa ja joukkuevalinnoissa. Joukkueen nimi näkyy aina värin rinnalla, jotta tunnistaminen ei perustu pelkkään väriin.": {
    "en": "Choose a shirt colour for each team in the <strong>New match</strong> form or <strong>Match settings</strong>. The colour appears on the scoreboard, save buttons and team selections. The team name always appears alongside the colour, so identification does not rely on colour alone.",
    "sv": "Välj tröjfärg för varje lag i formuläret <strong>Ny match</strong> eller i <strong>Matchinställningar</strong>. Färgen visas på resultattavlan, räddningsknapparna och i lagvalen. Lagets namn visas alltid tillsammans med färgen, så att igenkänning inte bygger enbart på färgen."
  }
};
