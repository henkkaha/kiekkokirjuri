/** Bundled help copy. Translation markup is trusted, static app content. */
export const HELP_COPY = {
  "quickLabel": "PIKAOHJE",
  "quickTitle": "Valmiina ensimmäiseen peliin.",
  "steps": [
    {
      "title": "Luo ottelu.",
      "body": "Anna joukkueet ja erän pituus. Valitse EKS-kokoonpano tai lisää pelaajat itse."
    },
    {
      "title": "Käynnistä kello.",
      "body": "Paina Aloita erä ja pysäytä kello pelikatkoilla."
    },
    {
      "title": "Kirjaa tilanne.",
      "body": "Valitse Maali, Torjunta tai Jäähy, sitten joukkue ja pelaaja. Tallenna."
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
        "Valitse <strong>Pelaajat</strong>-välilehdellä ensin joukkue ja lisää pelinumerot. Numero 0 käy myös. Sukunimi on valinnainen, ja sen voi täydentää pelaajaa napauttamalla.",
        "Tapahtumaan kirjoitettu uusi numero lisätään tämän ottelun kokoonpanoon. Molemmilla joukkueilla voi olla sama numero."
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
        "<strong>Maali:</strong> valitse maalin tehnyt joukkue, maalintekijä ja halutessasi enintään kaksi syöttäjää. Pelaajan voi jättää avoimeksi ja täydentää myöhemmin.",
        "<strong>Torjunta:</strong> valitse torjuneen maalivahdin joukkue ja maalivahti. Vastustajalle lisätään samalla yksi laukaus maalia kohti.",
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
        "<strong>Uusi ottelu</strong> siirtää nykyisen pelin arkistoon ja aloittaa uuden tuloksesta 0–0. Uudelle pelille valitaan oma kokoonpano.",
        "Vanhat pelit löytyvät <strong>Ottelut</strong>-välilehdeltä. Valitse peli ja <strong>Avaa ottelu</strong>, jos haluat korjata sitä. Nykyinen keskeneräinen peli säilytetään arkistossa."
      ]
    },
    {
      "title": "Tilastot ja ottelukooste",
      "paragraphs": [
        "<strong>Tilastot</strong>-välilehdellä näkyvät joukkueiden ja pelaajien luvut. Pelaajan pisteet ovat maalit ja syötöt yhteensä.",
        "<strong>Ottelukuva</strong> tekee jaettavan PNG-kuvan. <strong>Tekstikooste</strong> sisältää kaikki tapahtumat ja tilastot; voit kopioida sen tai ladata tekstitiedoston. Koosteet syntyvät myös ilman verkkoyhteyttä.",
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
        "Käyttöohje, palautelomake ja ottelukoosteet käyttävät valittua kieltä. Joukkueiden ja pelaajien nimiä tai itse kirjoitettuja tietoja ei käännetä."
      ]
    }
  ],
  "installButton": "Asennusohje: iPhone ja Android",
  "question": "Jäikö jokin epäselväksi? Kysy kehittäjältä.",
  "footer": "Kiekkokirjuri {version} · Ohje toimii myös ilman nettiä."
};

export const HELP_MESSAGES = {
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
  "Anna joukkueet ja erän pituus. Valitse EKS-kokoonpano tai lisää pelaajat itse.": {
    "en": "Enter the teams and period length. Choose an EKS line-up or add the players yourself.",
    "sv": "Ange lagen och periodlängden. Välj en EKS-laguppställning eller lägg till spelarna själv."
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
  "Valitse Maali, Torjunta tai Jäähy, sitten joukkue ja pelaaja. Tallenna.": {
    "en": "Choose Goal, Save or Penalty, then the team and player. Save the entry.",
    "sv": "Välj Mål, Räddning eller Utvisning, sedan lag och spelare. Spara händelsen."
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
  "<strong>Torjunta:</strong> valitse torjuneen maalivahdin joukkue ja maalivahti. Vastustajalle lisätään samalla yksi laukaus maalia kohti.": {
    "en": "<strong>Save:</strong> choose the team whose goalkeeper made the save, then the goalkeeper. One shot on goal is also added to the opposing team.",
    "sv": "<strong>Räddning:</strong> välj laget vars målvakt gjorde räddningen och sedan målvakten. Motståndarlaget får samtidigt ett skott på mål."
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
  "<strong>Uusi ottelu</strong> siirtää nykyisen pelin arkistoon ja aloittaa uuden tuloksesta 0–0. Uudelle pelille valitaan oma kokoonpano.": {
    "en": "<strong>New match</strong> moves the current match to the archive and starts a new one at 0–0. Choose a separate line-up for each new match.",
    "sv": "<strong>Ny match</strong> flyttar den nuvarande matchen till arkivet och startar en ny från 0–0. Välj en egen laguppställning för den nya matchen."
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
  "<strong>Ottelukuva</strong> tekee jaettavan PNG-kuvan. <strong>Tekstikooste</strong> sisältää kaikki tapahtumat ja tilastot; voit kopioida sen tai ladata tekstitiedoston. Koosteet syntyvät myös ilman verkkoyhteyttä.": {
    "en": "<strong>Match image</strong> creates a PNG image to share. <strong>Text summary</strong> includes all events and statistics; copy it or download a text file. Both work offline too.",
    "sv": "<strong>Matchbild</strong> skapar en PNG-bild som du kan dela. <strong>Textsammanfattning</strong> innehåller alla händelser och all statistik; kopiera den eller ladda ned en textfil. Båda fungerar också utan internet."
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
  "Käyttöohje, palautelomake ja ottelukoosteet käyttävät valittua kieltä. Joukkueiden ja pelaajien nimiä tai itse kirjoitettuja tietoja ei käännetä.": {
    "en": "The guide, feedback form and match summaries use your selected language. Team and player names and your own notes are not translated.",
    "sv": "Bruksanvisningen, responsformuläret och matchsammanfattningarna använder det valda språket. Lag- och spelarnamn samt egen text översätts inte."
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
  }
};

