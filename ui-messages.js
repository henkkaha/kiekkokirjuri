import { createTranslator } from './i18n.js?v=0.8.2';

export const UI_MESSAGES = {
  "Maalivahdit": {"en": "Goalkeepers", "sv": "Målvakter"},
  "Laukaukset": {"en": "Shots", "sv": "Skott"},
  "Kaikki": {"en": "All", "sv": "Alla"},
  "Viimeisimmät": {"en": "Latest", "sv": "Senaste"},
  "Sininen": {"en": "Blue", "sv": "Blå"},
  "Valkoinen": {"en": "White", "sv": "Vit"},
  "Keltainen": {"en": "Yellow", "sv": "Gul"},
  "Punainen": {"en": "Red", "sv": "Röd"},
  "Vihreä": {"en": "Green", "sv": "Grön"},
  "Musta": {"en": "Black", "sv": "Svart"},
  "Oranssi": {"en": "Orange", "sv": "Orange"},
  "Violetti": {"en": "Purple", "sv": "Lila"},
  "Harmaa": {"en": "Gray", "sv": "Grå"},
  "Paitaväri": {"en": "Shirt color", "sv": "Tröjfärg"},
  "Maalivahti · numero": {"en": "Goalkeeper · number", "sv": "Målvakt · nummer"},
  "Maalivahdin voi valita myöhemmin. Ilman numeroa torjunta kirjataan joukkueelle.": {"en": "You can choose the goalkeeper later. Saves without a number count toward the team total.", "sv": "Du kan välja målvakt senare. Räddningar utan nummer räknas till lagets total."},
  "Torjuntoja: {count}": {"en": "Saves: {count}", "sv": "Räddningar: {count}"},
  "Yksi painallus": {"en": "One tap", "sv": "Ett tryck"},
  "MV": {"en": "GK", "sv": "MV"},
  "Kokoonpanon maalivahti": {"en": "Goalkeeper listed in the lineup", "sv": "Målvakt i laguppställningen"},
  "Numeroa ei ole ilmoitettu.": {"en": "No jersey number supplied.", "sv": "Tröjnummer saknas."},
  "Virheellinen maalivahtitieto": {"en": "Invalid goalkeeper details", "sv": "Ogiltiga målvaktsuppgifter"},
  "Kotijoukkue": {
    "en": "Home team",
    "sv": "Hemmalag"
  },
  "Vierasjoukkue": {
    "en": "Away team",
    "sv": "Bortalag"
  },
  "Selaimen tallennustila ei ole käytettävissä.": {
    "en": "Browser storage is unavailable.",
    "sv": "Webbläsarens lagring är inte tillgänglig."
  },
  "Ottelu muuttui toisessa ikkunassa. Tätä lomaketta ei tallennettu. Sulje lomake, jotta uudemmat tiedot ladataan.": {
    "en": "The match changed in another window. This form was not saved. Close it to load the latest data.",
    "sv": "Matchen ändrades i ett annat fönster. Formuläret sparades inte. Stäng det för att läsa in de senaste uppgifterna."
  },
  "Ottelua muutettiin toisessa ikkunassa. Lataa uudemmat tiedot ennen seuraavaa kirjausta.": {
    "en": "The match changed in another window. Load the latest data before recording another event.",
    "sv": "Matchen ändrades i ett annat fönster. Läs in de senaste uppgifterna innan du registrerar nästa händelse."
  },
  "Lataa uudemmat tiedot": {
    "en": "Load latest data",
    "sv": "Läs in senaste uppgifter"
  },
  "Uudemmat ottelutiedot ladattu.": {
    "en": "Latest match data loaded.",
    "sv": "De senaste matchuppgifterna har lästs in."
  },
  "Toisen ikkunan tallennusta ei voitu lukea. Alkuperäiset tiedot voi viedä valikon varmuuskopiolla.": {
    "en": "The other window's data could not be read. Export the original data using the backup option in the menu.",
    "sv": "Uppgifterna från det andra fönstret kunde inte läsas. Exportera originaluppgifterna med säkerhetskopieringen i menyn."
  },
  "Aiemman tallennuksen lukeminen epäonnistui. Alkuperäiset tiedot ovat tallella. Vie ne valikon varmuuskopiolla ennen tietojen palautusta.": {
    "en": "The previous save could not be read. The original data is still safe. Export a backup from the menu before restoring data.",
    "sv": "Den tidigare sparningen kunde inte läsas. Originaluppgifterna finns kvar. Exportera en säkerhetskopia via menyn innan du återställer uppgifter."
  },
  "Tallennus ei onnistunut. Kirjausta ei lisätty. Tarkista laitteen vapaa tila ja vie otteluista varmuuskopio.": {
    "en": "Saving failed. The event was not added. Check your device's free space and export a backup of your matches.",
    "sv": "Det gick inte att spara. Händelsen lades inte till. Kontrollera enhetens lediga utrymme och exportera en säkerhetskopia av matcherna."
  },
  "Ottelupäivä puuttuu": {
    "en": "Match date missing",
    "sv": "Matchdatum saknas"
  },
  "Ottelu": {
    "en": "Match",
    "sv": "Match"
  },
  "Pelaajat": {
    "en": "Players",
    "sv": "Spelare"
  },
  "Tilastot": {
    "en": "Statistics",
    "sv": "Statistik"
  },
  "Ottelut": {
    "en": "Matches",
    "sv": "Matcher"
  },
  "Ottelu päättynyt": {
    "en": "Match finished",
    "sv": "Matchen avslutad"
  },
  "Peli käynnissä": {
    "en": "Match in progress",
    "sv": "Matchen pågår"
  },
  "Erä päättynyt": {
    "en": "Period finished",
    "sv": "Perioden slut"
  },
  "Kello pysäytetty": {
    "en": "Clock paused",
    "sv": "Klockan pausad"
  },
  "Valmiina peliin": {
    "en": "Ready to play",
    "sv": "Redo för match"
  },
  "Jatka ottelua": {
    "en": "Resume match",
    "sv": "Fortsätt matchen"
  },
  "Seuraava erä": {
    "en": "Next period",
    "sv": "Nästa period"
  },
  "Pysäytä": {
    "en": "Pause",
    "sv": "Pausa"
  },
  "Jatka erää": {
    "en": "Resume period",
    "sv": "Fortsätt perioden"
  },
  "Aloita erä": {
    "en": "Start period",
    "sv": "Starta perioden"
  },
  "Tästä se alkaa.": {
    "en": "It starts here.",
    "sv": "Här börjar det."
  },
  "Aloita kello ja kirjaa kentän tapahtumat. Ottelun tarina rakentuu tähän.": {
    "en": "Start the clock and record the action. Your match timeline will appear here.",
    "sv": "Starta klockan och registrera det som händer på isen. Matchens händelser visas här."
  },
  "Näytä viimeisimmät": {
    "en": "Show latest",
    "sv": "Visa senaste"
  },
  "Näytä kaikki {count} tapahtumaa": {
    "en": "Show all events ({count})",
    "sv": "Visa alla händelser ({count})"
  },
  "Laukausyritys": {
    "en": "Shot attempt",
    "sv": "Skottförsök"
  },
  "Syötöt: {players}": {
    "en": "Assists: {players}",
    "sv": "Assist: {players}"
  },
  "Tämän ottelun kokoonpano": {
    "en": "Line-up for this match",
    "sv": "Laguppställning för den här matchen"
  },
  "Lisää nimi": {
    "en": "Add name",
    "sv": "Lägg till namn"
  },
  "Pelaaja": {
    "en": "Player",
    "sv": "Spelare"
  },
  "Nimi puuttuu": {
    "en": "Name missing",
    "sv": "Namn saknas"
  },
  "Ketkä pelaavat tänään?": {
    "en": "Who's playing today?",
    "sv": "Vilka spelar i dag?"
  },
  "Lisää joukkueen pelaajanumerot. Saat niistä nopeat valintapainikkeet tapahtumiin.": {
    "en": "Add the team's jersey numbers for quick player selection when recording events.",
    "sv": "Lägg till lagets tröjnummer så kan du snabbt välja spelare när du registrerar händelser."
  },
  "Jokainen kirjaus näkyy tässä.": {
    "en": "Every event counts.",
    "sv": "Varje händelse räknas."
  },
  "Maalit": {
    "en": "Goals",
    "sv": "Mål"
  },
  "Laukaukset maalia kohti": {
    "en": "Shots on goal",
    "sv": "Skott på mål"
  },
  "Torjunnat": {
    "en": "Saves",
    "sv": "Räddningar"
  },
  "Rangaistusminuutit": {
    "en": "Penalty minutes",
    "sv": "Utvisningsminuter"
  },
  "Numerot kertovat pelistä.": {
    "en": "The match in numbers.",
    "sv": "Matchen i siffror."
  },
  "Lisää pelaajat kokoonpanoon tai merkitse numero tapahtuman yhteydessä. Tilastot kertyvät automaattisesti.": {
    "en": "Add players to the line-up or enter a number when recording an event. Statistics update automatically.",
    "sv": "Lägg till spelare i laguppställningen eller ange ett nummer när du registrerar en händelse. Statistiken uppdateras automatiskt."
  },
  "Nykyinen ottelu": {
    "en": "Current match",
    "sv": "Aktuell match"
  },
  "Pelit vaihtuvat. Muistot säilyvät.": {
    "en": "New matches. Lasting memories.",
    "sv": "Nya matcher. Minnen som består."
  },
  "Ensimmäinen peli odottaa vielä.": {
    "en": "Your first match is waiting.",
    "sv": "Din första match väntar."
  },
  "Kun aloitat uuden ottelun, nykyinen siirtyy tänne automaattisesti.": {
    "en": "When you start a new match, the current one moves here automatically.",
    "sv": "När du startar en ny match flyttas den aktuella matchen hit automatiskt."
  },
  "Vahvista": {
    "en": "Confirm",
    "sv": "Bekräfta"
  },
  "Kumpi joukkue torjui?": {
    "en": "Which team made the save?",
    "sv": "Vilket lag gjorde räddningen?"
  },
  "Kumpi joukkue teki maalin?": {
    "en": "Which team scored?",
    "sv": "Vilket lag gjorde mål?"
  },
  "Kummalle joukkueelle jäähy?": {
    "en": "Which team received the penalty?",
    "sv": "Vilket lag fick utvisningen?"
  },
  "Maalintekijä": {
    "en": "Goal scorer",
    "sv": "Målskytt"
  },
  "Maalivahti": {
    "en": "Goalie",
    "sv": "Målvakt"
  },
  "Numero": {
    "en": "Number",
    "sv": "Nummer"
  },
  "Muu numero": {
    "en": "Other number",
    "sv": "Annat nummer"
  },
  "Pelaajan numero, 0–99": {
    "en": "Player number, 0–99",
    "sv": "Spelarens nummer, 0–99"
  },
  "Valittu: {players}": {
    "en": "Selected: {players}",
    "sv": "Valda: {players}"
  },
  "Jätä tyhjäksi, jos maali syntyi ilman syöttöä.": {
    "en": "Leave blank for an unassisted goal.",
    "sv": "Lämna tomt om målet gjordes utan assist."
  },
  "Muokkaa: {event}": {
    "en": "Edit: {event}",
    "sv": "Redigera: {event}"
  },
  "Tallenna muutokset": {
    "en": "Save changes",
    "sv": "Spara ändringar"
  },
  "Tallenna {event}": {
    "en": "Record {event}",
    "sv": "Spara {event}"
  },
  "Anna pelaajan numero väliltä 0–99.": {
    "en": "Enter a player number from 0 to 99.",
    "sv": "Ange spelarens nummer mellan 0 och 99."
  },
  "Anna syöttäjän numero väliltä 0–99.": {
    "en": "Enter the assisting player's number from 0 to 99.",
    "sv": "Ange den assisterande spelarens nummer mellan 0 och 99."
  },
  "Maalintekijä ei voi olla myös syöttäjä.": {
    "en": "The goal scorer cannot also have an assist.",
    "sv": "Målskytten kan inte också få en assist."
  },
  "Maalille voi valita enintään kaksi syöttäjää.": {
    "en": "A goal can have up to two assists.",
    "sv": "Ett mål kan ha högst två assist."
  },
  "Anna aika muodossa mm:ss, esimerkiksi 12:30.": {
    "en": "Enter time as mm:ss, for example 12:30.",
    "sv": "Ange tiden som mm:ss, till exempel 12:30."
  },
  "Kirjausta ei voitu tallentaa. Tarkista ilmoitus sivun yläreunassa.": {
    "en": "The event could not be saved. Check the message at the top of the page.",
    "sv": "Händelsen kunde inte sparas. Kontrollera meddelandet högst upp på sidan."
  },
  "Kirjaus päivitetty · {team}": {
    "en": "Event updated · {team}",
    "sv": "Händelsen uppdaterad · {team}"
  },
  "Kirjaus tallennettu · {team}": {
    "en": "Event saved · {team}",
    "sv": "Händelsen sparad · {team}"
  },
  "Ottelu vaihtui. Muokkaa kirjausta otteluarkiston kautta.": {
    "en": "The match has changed. Open the archived match to edit this event.",
    "sv": "Matchen har ändrats. Öppna matchen i arkivet för att redigera händelsen."
  },
  "Virheellinen kokoonpanotiedosto": {
    "en": "Invalid line-up file",
    "sv": "Ogiltig laguppställningsfil"
  },
  "Virheellinen ryhmä": {
    "en": "Invalid group",
    "sv": "Ogiltig grupp"
  },
  "Virheellinen tai toistuva pelaajanumero": {
    "en": "Invalid or duplicate player number",
    "sv": "Ogiltigt eller dubbelt spelarnummer"
  },
  "Asennettu offline-kokoonpano": {
    "en": "Included offline line-up",
    "sv": "Förinstallerad laguppställning för offlinebruk"
  },
  "Tallennettu kopio": {
    "en": "Saved copy",
    "sv": "Sparad kopia"
  },
  "Kokoonpano ei saatavilla": {
    "en": "Line-up unavailable",
    "sv": "Laguppställningen är inte tillgänglig"
  },
  "Verkosta tarkistettu": {
    "en": "Checked online",
    "sv": "Kontrollerad online"
  },
  "Tallennettu kopio · tarkista ajantasaisuus": {
    "en": "Saved copy · check that it is up to date",
    "sv": "Sparad kopia · kontrollera att den är aktuell"
  },
  "Kokoonpanoa ei saatu ladattua": {
    "en": "Could not load the line-up",
    "sv": "Kunde inte läsa in laguppställningen"
  },
  "Tarkistetaan kokoonpanoja…": {
    "en": "Checking line-ups…",
    "sv": "Kontrollerar laguppställningar…"
  },
  "Uusi ottelu": {
    "en": "New match",
    "sv": "Ny match"
  },
  "Uusi peli, puhdas tulostaulu.": {
    "en": "A new match. A fresh scoreboard.",
    "sv": "En ny match. En tom resultattavla."
  },
  "Valitse erän pituus väliltä 1–60 minuuttia.": {
    "en": "Choose a period length from 1 to 60 minutes.",
    "sv": "Välj en periodlängd mellan 1 och 60 minuter."
  },
  "Vastustaja": {
    "en": "Opponent",
    "sv": "Motståndare"
  },
  "Valitse kokoonpano uudelleen.": {
    "en": "Please select the line-up again.",
    "sv": "Välj laguppställningen igen."
  },
  "Uutta ottelua ei voitu tallentaa.": {
    "en": "The new match could not be saved.",
    "sv": "Den nya matchen kunde inte sparas."
  },
  "Uusi ottelu ja EKS-kokoonpano valmis.": {
    "en": "New match and EKS line-up ready.",
    "sv": "Den nya matchen och EKS-laguppställningen är klara."
  },
  "Uusi ottelu valmis. Lisää kokoonpano Pelaajat-välilehdellä.": {
    "en": "New match ready. Add your line-up in Players.",
    "sv": "Den nya matchen är klar. Lägg till laguppställningen under Spelare."
  },
  "Valmiina aloitukseen?": {
    "en": "Ready for face-off?",
    "sv": "Redo för nedsläpp?"
  },
  "Ottelun asetukset": {
    "en": "Match settings",
    "sv": "Matchinställningar"
  },
  "Valitse erän pituus ennen kellon käynnistämistä.": {
    "en": "Choose the period length before starting the clock.",
    "sv": "Välj periodlängd innan du startar klockan."
  },
  "Joukkueet ja peliaika.": {
    "en": "Teams and playing time.",
    "sv": "Lag och speltid."
  },
  "Merkitse ottelu päättyneeksi": {
    "en": "Mark match as finished",
    "sv": "Markera matchen som avslutad"
  },
  "Aloita 1. erä": {
    "en": "Start period 1",
    "sv": "Starta period 1"
  },
  "Tallenna asetukset": {
    "en": "Save settings",
    "sv": "Spara inställningar"
  },
  "Asetuksia ei voitu tallentaa.": {
    "en": "Settings could not be saved.",
    "sv": "Inställningarna kunde inte sparas."
  },
  "Erä käynnissä.": {
    "en": "Period started.",
    "sv": "Perioden har startat."
  },
  "Ottelun asetukset tallennettu.": {
    "en": "Match settings saved.",
    "sv": "Matchinställningarna har sparats."
  },
  "Korjaa kelloa": {
    "en": "Adjust clock",
    "sv": "Justera klockan"
  },
  "Siirry seuraavaan erään?": {
    "en": "Go to the next period?",
    "sv": "Gå till nästa period?"
  },
  "Valmistele seuraava erä": {
    "en": "Prepare next period",
    "sv": "Förbered nästa period"
  },
  "Merkitäänkö ottelu päättyneeksi?": {
    "en": "Mark the match as finished?",
    "sv": "Markera matchen som avslutad?"
  },
  "Kello pysähtyy. Voit tehdä ottelukoosteen ja jatkaa muokkaamista tarvittaessa.": {
    "en": "The clock will stop. You can create a summary and continue editing if needed.",
    "sv": "Klockan stannar. Du kan skapa en sammanfattning och fortsätta redigera vid behov."
  },
  "Ottelu merkitty päättyneeksi.": {
    "en": "Match marked as finished.",
    "sv": "Matchen har markerats som avslutad."
  },
  "Päätä ottelu": {
    "en": "Finish match",
    "sv": "Avsluta matchen"
  },
  "Poistetaanko tapahtuma?": {
    "en": "Delete this event?",
    "sv": "Ta bort händelsen?"
  },
  "Tapahtuma poistettu.": {
    "en": "Event deleted.",
    "sv": "Händelsen har tagits bort."
  },
  "Poista tapahtuma": {
    "en": "Delete event",
    "sv": "Ta bort händelse"
  },
  "Vanha tapahtuma": {
    "en": "Legacy event",
    "sv": "Äldre händelse"
  },
  "Säilytetty aiemmasta versiosta.": {
    "en": "Kept from an earlier version.",
    "sv": "Bevarad från en tidigare version."
  },
  "Tallennettu ottelu": {
    "en": "Saved match",
    "sv": "Sparad match"
  },
  "Peli hallussa.": {
    "en": "You're in control.",
    "sv": "Ha koll på matchen."
  },
  "Asetukset ja tiedot.": {
    "en": "Settings and information.",
    "sv": "Inställningar och information."
  },
  "Joukkueet, kello ja erät": {
    "en": "Teams, clock and periods",
    "sv": "Lag, klocka och perioder"
  },
  "Nykyinen peli talteen, uusi tilalle": {
    "en": "Archive this match and start a new one",
    "sv": "Arkivera matchen och starta en ny"
  },
  "Vie varmuuskopio": {
    "en": "Export backup",
    "sv": "Exportera säkerhetskopia"
  },
  "Kaikki ottelut yhdessä tiedostossa": {
    "en": "All matches in one file",
    "sv": "Alla matcher i en fil"
  },
  "Palauta varmuuskopio": {
    "en": "Restore backup",
    "sv": "Återställ säkerhetskopia"
  },
  "Avaa aiemmin viety JSON-tiedosto": {
    "en": "Open a previously exported JSON file",
    "sv": "Öppna en tidigare exporterad JSON-fil"
  },
  "Lisää kotivalikkoon": {
    "en": "Add to Home Screen",
    "sv": "Lägg till på hemskärmen"
  },
  "Oma kuvake iPhonen tai Androidin aloitusnäyttöön": {
    "en": "An app icon on your iPhone or Android home screen",
    "sv": "En appikon på din iPhone- eller Android-hemskärm"
  },
  "Tarkistetaan offline-valmiutta…": {
    "en": "Checking offline availability…",
    "sv": "Kontrollerar offlinefunktion…"
  },
  "Ohje ja palaute": {
    "en": "Help & feedback",
    "sv": "Hjälp och feedback"
  },
  "Käyttöohje, bugit ja kehitysideat": {
    "en": "User guide, bugs and feature ideas",
    "sv": "Användarguide, fel och förbättringsförslag"
  },
  "Aiemman palauteluonnoksen lukeminen epäonnistui. Uutta tekstiä ei tallenneta sen päälle. Voit silti valmistella ja kopioida viestin.": {
    "en": "The previous feedback draft could not be read. New text will not overwrite it. You can still prepare and copy your message.",
    "sv": "Det tidigare feedbackutkastet kunde inte läsas. Ny text skrivs inte över det. Du kan ändå förbereda och kopiera ditt meddelande."
  },
  "Luonnoksen tallennustila ei ole käytettävissä. Kopioi viesti talteen ennen sovelluksen sulkemista.": {
    "en": "Draft storage is unavailable. Copy your message before closing the app.",
    "sv": "Lagring av utkast är inte tillgänglig. Kopiera meddelandet innan du stänger appen."
  },
  "Luonnos tallennettu tähän laitteeseen.": {
    "en": "Draft saved on this device.",
    "sv": "Utkastet har sparats på den här enheten."
  },
  "Luonnos tallentuu automaattisesti tähän laitteeseen.": {
    "en": "Your draft is saved automatically on this device.",
    "sv": "Utkastet sparas automatiskt på den här enheten."
  },
  "Luonnosta ei saatu tallennettua. Teksti on vielä tässä ikkunassa. Kopioi tai lataa se talteen ennen sulkemista.": {
    "en": "The draft could not be saved. Your text is still in this window. Copy or download it before closing.",
    "sv": "Utkastet kunde inte sparas. Texten finns kvar i fönstret. Kopiera eller ladda ner den innan du stänger."
  },
  "Mitä tapahtui?": {
    "en": "What happened?",
    "sv": "Vad hände?"
  },
  "Mitä toivoisit?": {
    "en": "What would you like?",
    "sv": "Vad önskar du?"
  },
  "Mikä mietityttää?": {
    "en": "What would you like to ask?",
    "sv": "Vad undrar du över?"
  },
  "Muu laite": {
    "en": "Other device",
    "sv": "Annan enhet"
  },
  "Muu selain": {
    "en": "Other browser",
    "sv": "Annan webbläsare"
  },
  "Apua peliin. Ideat talteen.": {
    "en": "Help for the match. A place for your ideas.",
    "sv": "Hjälp under matchen. Plats för dina idéer."
  },
  "Palaute kehittäjälle": {
    "en": "Feedback to the developer",
    "sv": "Feedback till utvecklaren"
  },
  "Bugi, kehitysidea tai kysymys.": {
    "en": "A bug, a feature idea or a question.",
    "sv": "Ett fel, ett förbättringsförslag eller en fråga."
  },
  "Tarkista palautteen tiedot.": {
    "en": "Please check your feedback.",
    "sv": "Kontrollera uppgifterna i din feedback."
  },
  "Valmis sähköpostiin": {
    "en": "Ready to email",
    "sv": "Klart att mejla"
  },
  "Tarkista viesti ennen lähettämistä.": {
    "en": "Review your message before sending.",
    "sv": "Granska meddelandet innan du skickar det."
  },
  "Sähköpostiosoite kopioitu.": {
    "en": "Email address copied.",
    "sv": "E-postadressen har kopierats."
  },
  "Palaute kopioitu. Liitä se sähköpostiisi.": {
    "en": "Feedback copied. Paste it into your email.",
    "sv": "Feedbacken har kopierats. Klistra in den i ditt mejl."
  },
  "Kopioi osoite käsin: {email}": {
    "en": "Copy the address manually: {email}",
    "sv": "Kopiera adressen manuellt: {email}"
  },
  "Selain ei sallinut kopiointia. Kopioi valittu teksti käsin tai lataa se tiedostona.": {
    "en": "The browser blocked copying. Copy the selected text manually or download it as a file.",
    "sv": "Webbläsaren tillät inte kopiering. Kopiera den markerade texten manuellt eller ladda ner den som en fil."
  },
  "Tyhjennetäänkö palauteluonnos?": {
    "en": "Clear your feedback draft?",
    "sv": "Töm feedbackutkastet?"
  },
  "Vain tämän palautteen teksti poistetaan. Ottelut säilyvät.": {
    "en": "Only this feedback text will be removed. Your matches will be kept.",
    "sv": "Bara texten i den här feedbacken tas bort. Dina matcher finns kvar."
  },
  "Luonnosta ei voitu poistaa laitteen tallennustilasta.": {
    "en": "The draft could not be removed from device storage.",
    "sv": "Utkastet kunde inte tas bort från enhetens lagring."
  },
  "Palauteluonnos tyhjennetty.": {
    "en": "Feedback draft cleared.",
    "sv": "Feedbackutkastet har tömts."
  },
  "Tyhjennä": {
    "en": "Clear",
    "sv": "Töm"
  },
  "Kiekkokirjuri kotivalikkoon": {
    "en": "Kiekkokirjuri on your Home Screen",
    "sv": "Kiekkokirjuri på hemskärmen"
  },
  "iPhone ja Android": {
    "en": "iPhone and Android",
    "sv": "iPhone och Android"
  },
  "Alkuperäinen tallennus vietiin tiedostoksi.": {
    "en": "The original save was exported to a file.",
    "sv": "Den ursprungliga sparningen har exporterats till en fil."
  },
  "Varmuuskopio sisältää nykyisen ottelun ja koko arkiston.": {
    "en": "The backup contains the current match and the full archive.",
    "sv": "Säkerhetskopian innehåller den aktuella matchen och hela arkivet."
  },
  "Varmuuskopio on liian suuri. Enimmäiskoko on 25 Mt.": {
    "en": "The backup is too large. The maximum size is 25 MB.",
    "sv": "Säkerhetskopian är för stor. Maximal storlek är 25 MB."
  },
  "Palautetaanko varmuuskopio?": {
    "en": "Restore this backup?",
    "sv": "Återställa säkerhetskopian?"
  },
  "Varmuuskopiota ei voitu tallentaa.": {
    "en": "The backup could not be saved.",
    "sv": "Säkerhetskopian kunde inte sparas."
  },
  "Varmuuskopio palautettu. Kello on pysäytetty.": {
    "en": "Backup restored. The clock is paused.",
    "sv": "Säkerhetskopian har återställts. Klockan är pausad."
  },
  "Palauta ottelut": {
    "en": "Restore matches",
    "sv": "Återställ matcher"
  },
  "Ottelukooste": {
    "en": "Match summary",
    "sv": "Matchsammanfattning"
  },
  "Koko ottelu tekstinä.": {
    "en": "The full match in text.",
    "sv": "Hela matchen som text."
  },
  "Ottelukuva": {
    "en": "Match image",
    "sv": "Matchbild"
  },
  "Valmistellaan jaettavaa koostetta…": {
    "en": "Preparing your shareable summary…",
    "sv": "Förbereder en sammanfattning att dela…"
  },
  "Hetki, kuva valmistuu.": {
    "en": "Your image is on its way.",
    "sv": "Din bild är snart klar."
  },
  "Kuva luodaan tällä laitteella. Myös ilman verkkoyhteyttä.": {
    "en": "The image is created on this device, even without an internet connection.",
    "sv": "Bilden skapas på den här enheten, även utan internetanslutning."
  },
  "Valmis jaettavaksi.": {
    "en": "Ready to share.",
    "sv": "Klar att dela."
  },
  "Jakaminen ei onnistunut. Voit ladata kuvan PNG-tiedostona.": {
    "en": "Sharing failed. You can download the image as a PNG file.",
    "sv": "Det gick inte att dela. Du kan ladda ner bilden som en PNG-fil."
  },
  "Kuva ladattu. Voit jakaa sen laitteen tiedostoista.": {
    "en": "Image downloaded. You can share it from your device's files.",
    "sv": "Bilden har laddats ner. Du kan dela den från enhetens filer."
  },
  "Viesti on valmisteltu. Lähetä se sähköpostisovelluksessasi.": {
    "en": "Your message is ready. Send it from your email app.",
    "sv": "Meddelandet är klart. Skicka det från din e-postapp."
  },
  "Vastaanottaja: {email}": {
    "en": "To: {email}",
    "sv": "Till: {email}"
  },
  "Aihe: {subject}": {
    "en": "Subject: {subject}",
    "sv": "Ämne: {subject}"
  },
  "Jatka ottelua ennen uuden tapahtuman kirjaamista.": {
    "en": "Resume the match before recording a new event.",
    "sv": "Fortsätt matchen innan du registrerar en ny händelse."
  },
  "Ottelu avattu muokattavaksi. Kello on pysäytetty.": {
    "en": "Match reopened for editing. The clock is paused.",
    "sv": "Matchen har öppnats för redigering. Klockan är pausad."
  },
  "Poistetaanko pelaaja kokoonpanosta?": {
    "en": "Remove this player from the line-up?",
    "sv": "Ta bort spelaren från laguppställningen?"
  },
  "Pelaaja poistettu kokoonpanosta.": {
    "en": "Player removed from the line-up.",
    "sv": "Spelaren har tagits bort från laguppställningen."
  },
  "Poista pelaaja": {
    "en": "Remove player",
    "sv": "Ta bort spelare"
  },
  "Tallennettu ottelu avattu.": {
    "en": "Saved match opened.",
    "sv": "Den sparade matchen har öppnats."
  },
  "Ottelukooste kopioitu.": {
    "en": "Match summary copied.",
    "sv": "Matchsammanfattningen har kopierats."
  },
  "Valitse ja kopioi teksti käsin. Selain ei sallinut automaattista kopiointia.": {
    "en": "Select and copy the text manually. The browser blocked automatic copying.",
    "sv": "Markera och kopiera texten manuellt. Webbläsaren tillät inte automatisk kopiering."
  },
  "Uusi versio on valmis ladattavaksi.": {
    "en": "A new version is ready.",
    "sv": "En ny version är klar."
  },
  "Päivityksen tarkistaminen vaatii verkkoyhteyden.": {
    "en": "An internet connection is needed to check for updates.",
    "sv": "Internetanslutning krävs för att söka efter uppdateringar."
  },
  "Käytössä on uusin versio {version}.": {
    "en": "You have the latest version, {version}.",
    "sv": "Du har den senaste versionen, {version}."
  },
  "Pysäytä kello ja tallenna tai sulje avoin lomake ennen päivitystä.": {
    "en": "Pause the clock and save or close the open form before updating.",
    "sv": "Pausa klockan och spara eller stäng det öppna formuläret innan du uppdaterar."
  },
  "Toiminto epäonnistui.": {
    "en": "The action failed.",
    "sv": "Åtgärden misslyckades."
  },
  "Aika ei voi ylittää erän pituutta.": {
    "en": "The time cannot exceed the period length.",
    "sv": "Tiden får inte överskrida periodlängden."
  },
  "Kello korjattu. Käynnistä se, kun peli jatkuu.": {
    "en": "Clock adjusted. Start it when play resumes.",
    "sv": "Klockan har justerats. Starta den när spelet fortsätter."
  },
  "Pelaajan nimi tallennettu.": {
    "en": "Player name saved.",
    "sv": "Spelarens namn har sparats."
  },
  "Tarkista lomakkeen tiedot.": {
    "en": "Please check the form.",
    "sv": "Kontrollera uppgifterna i formuläret."
  },
  "Varmuuskopiota ei palautettu. {error}": {
    "en": "The backup was not restored. {error}",
    "sv": "Säkerhetskopian återställdes inte. {error}"
  },
  "Aiemman tallennuksen lukeminen epäonnistui. Alkuperäiset tiedot ovat tallella. Vie varmuuskopio valikosta. {error}": {
    "en": "The previous save could not be read. The original data is still safe. Export a backup from the menu. {error}",
    "sv": "Den tidigare sparningen kunde inte läsas. Originaluppgifterna finns kvar. Exportera en säkerhetskopia via menyn. {error}"
  },
  "Valmis myös offlineen": {
    "en": "Ready offline",
    "sv": "Klar för offlinebruk"
  },
  "Offline · tallennus laitteelle": {
    "en": "Offline · saved on device",
    "sv": "Offline · sparas på enheten"
  },
  "Tallennus laitteelle": {
    "en": "Saved on device",
    "sv": "Sparas på enheten"
  },
  "{period}. erä · kellossa {time}": {
    "en": "Period {period} · clock {time}",
    "sv": "Period {period} · klockan {time}"
  },
  "Muokkaus": {
    "en": "Editing",
    "sv": "Redigering"
  },
  "{period}. erä · kello on pysäytetty": {
    "en": "Period {period} · clock paused",
    "sv": "Period {period} · klockan pausad"
  },
  "{period}. erä alkaa ajasta {time}. Käynnistät kellon erikseen Aloita erä -painikkeesta.": {
    "en": "Period {period} starts at {time}. Start the clock separately using Start period.",
    "sv": "Period {period} börjar på {time}. Starta klockan separat med Starta perioden."
  },
  "{period}. erä valmiina aloitukseen.": {
    "en": "Period {period} is ready to start.",
    "sv": "Period {period} är klar att starta."
  },
  "Pelaaja #{number} päivitetty.": {
    "en": "Player #{number} updated.",
    "sv": "Spelare #{number} har uppdaterats."
  },
  "Pelaaja #{number} lisätty.": {
    "en": "Player #{number} added.",
    "sv": "Spelare #{number} har lagts till."
  },
  "Pelaaja #{number}": {
    "en": "Player #{number}",
    "sv": "Spelare #{number}"
  },
  "Pelaajan #{number} tapahtumat ja tilastot säilyvät numerolla.": {
    "en": "Events and statistics for player #{number} will stay linked to the number.",
    "sv": "Händelser och statistik för spelare #{number} finns kvar under numret."
  },
  "Tiedostossa on nykyinen ottelu ja {count} arkistoitua ottelua. Palautus korvaa tällä laitteella olevat ottelut. Vie tarvittaessa ensin nykyinen varmuuskopio.": {
    "en": "The file contains the current match and {count} archived matches. Restoring replaces the matches on this device. Export your current backup first if needed.",
    "sv": "Filen innehåller den aktuella matchen och {count} arkiverade matcher. Återställningen ersätter matcherna på den här enheten. Exportera först en aktuell säkerhetskopia vid behov."
  },
  "{period}. erä päättynyt.": {
    "en": "Period {period} has ended.",
    "sv": "Period {period} är slut."
  },
  "Kieli": {
    "en": "Language",
    "sv": "Språk"
  },
  "Valitse sovelluksen kieli.": {
    "en": "Choose your app language.",
    "sv": "Välj språk för appen."
  },
  "Kielivalinta tallentuu vain tähän laitteeseen. Kaikki kielet toimivat myös ilman nettiä.": {
    "en": "Your language choice is saved on this device. All languages work offline too.",
    "sv": "Språkvalet sparas på den här enheten. Alla språk fungerar också offline."
  },
  "Kieli vaihdettu.": {
    "en": "Language changed.",
    "sv": "Språket har ändrats."
  },
  "Kieli vaihtui, mutta valintaa ei voitu tallentaa. Valitse kieli tarvittaessa uudelleen seuraavalla avauksella.": {
    "en": "Language changed, but your choice could not be saved. You may need to select it again next time.",
    "sv": "Språket ändrades, men valet kunde inte sparas. Du kan behöva välja det igen nästa gång."
  },
  "Siirry sisältöön": {
    "en": "Skip to content",
    "sv": "Hoppa till innehållet"
  },
  "Kiekkokirjuri, ottelunäkymä": {
    "en": "Kiekkokirjuri, match view",
    "sv": "Kiekkokirjuri, matchvy"
  },
  "Asetukset ja varmuuskopio": {
    "en": "Settings and backup",
    "sv": "Inställningar och säkerhetskopia"
  },
  "Päänavigaatio": {
    "en": "Main navigation",
    "sv": "Huvudnavigation"
  },
  "Kiekkokirjuri – ottelun maalit, torjunnat ja jäähyt helposti, myös ilman verkkoyhteyttä.": {
    "en": "Kiekkokirjuri – easily record goals, saves and penalties, even offline.",
    "sv": "Kiekkokirjuri – registrera enkelt mål, räddningar och utvisningar, även offline."
  },
  "Kumoa": {
    "en": "Undo",
    "sv": "Ångra"
  },
  "Tulostaulu": {
    "en": "Scoreboard",
    "sv": "Resultattavla"
  },
  "Ottelun ja kellon asetukset": {
    "en": "Match and clock settings",
    "sv": "Match- och klockinställningar"
  },
  "Koti": {
    "en": "Home",
    "sv": "Hemma"
  },
  "Vieras": {
    "en": "Away",
    "sv": "Borta"
  },
  "Aikaa jäljellä": {
    "en": "Time remaining",
    "sv": "Tid kvar"
  },
  "Kirjaa tapahtuma": {
    "en": "Record an event",
    "sv": "Registrera en händelse"
  },
  "Yksi tilanne, yksi kirjaus": {
    "en": "One play, one entry",
    "sv": "En situation, en registrering"
  },
  "Maali ja torjunta päivittävät laukaukset automaattisesti.": {
    "en": "Goals and saves update shots on goal automatically.",
    "sv": "Mål och räddningar uppdaterar skotten på mål automatiskt."
  },
  "Numerolla nopeasti, nimellä myöhemminkin.": {
    "en": "Use a number now. Add a name later.",
    "sv": "Ange numret nu. Lägg till namnet senare."
  },
  "Lisää kokoonpano Pelaajat-välilehdellä. Voit kirjata tapahtuman myös ilman pelaajatietoja.": {
    "en": "Add your line-up in Players. You can also record an event without player details.",
    "sv": "Lägg till laguppställningen under Spelare. Du kan också registrera en händelse utan spelaruppgifter."
  },
  "Tapahtumat": {
    "en": "Events",
    "sv": "Händelser"
  },
  "Tallennetaan tälle laitteelle": {
    "en": "Saved on this device",
    "sv": "Sparas på den här enheten"
  },
  "Tapahtumissa kulunut peliaika": {
    "en": "Event times show elapsed time",
    "sv": "Händelser visar spelad tid"
  },
  "Vanha kirjaus · ei sisälly laukauksiin maalia kohti": {
    "en": "Legacy entry · not counted as a shot on goal",
    "sv": "Äldre registrering · räknas inte som skott på mål"
  },
  "Joukkue": {
    "en": "Team",
    "sv": "Lag"
  },
  "Sukunimi": {
    "en": "Surname",
    "sv": "Efternamn"
  },
  "Lisää": {
    "en": "Add",
    "sv": "Lägg till"
  },
  "Pelkkä numero riittää. Nimen voi lisätä nyt tai myöhemmin pelaajaa napauttamalla.": {
    "en": "A number is enough. Add a name now or tap the player to add it later.",
    "sv": "Ett nummer räcker. Lägg till namnet nu eller tryck på spelaren för att göra det senare."
  },
  "Valinnainen": {
    "en": "Optional",
    "sv": "Valfritt"
  },
  "Valmiina ennen aloitusta": {
    "en": "Ready for face-off",
    "sv": "Redo för nedsläpp"
  },
  "Molempien joukkueiden pelaajat": {
    "en": "Players on both teams",
    "sv": "Spelare i båda lagen"
  },
  "Vaihda joukkuetta yläreunan valinnasta. Sama numero voi olla kummassakin joukkueessa.": {
    "en": "Switch teams using the tabs above. Both teams can have a player with the same number.",
    "sv": "Byt lag med flikarna ovan. Samma nummer kan finnas i båda lagen."
  },
  "Voit täydentää myös pelin aikana": {
    "en": "Add details during the match too",
    "sv": "Du kan även fylla i uppgifter under matchen"
  },
  "Tapahtumaan kirjoitettu uusi numero lisätään tämän ottelun kokoonpanoon automaattisesti.": {
    "en": "A new number entered for an event is added to this match's line-up automatically.",
    "sv": "Ett nytt nummer som anges vid en händelse läggs automatiskt till i matchens laguppställning."
  },
  "Uusi peli, uusi kokoonpano": {
    "en": "New match, new line-up",
    "sv": "Ny match, ny laguppställning"
  },
  "Valitse uudelle ottelulle EKS-kokoonpano tai aloita tyhjillä pelaajalistoilla. Aiempien ottelujen tiedot säilyvät arkistossa.": {
    "en": "Choose an EKS line-up for the new match or start with empty player lists. Previous matches remain in the archive.",
    "sv": "Välj en EKS-laguppställning för den nya matchen eller börja med tomma spelarlistor. Tidigare matcher finns kvar i arkivet."
  },
  "M": {
    "en": "G",
    "sv": "M"
  },
  "S": {
    "en": "A",
    "sv": "A"
  },
  "P": {
    "en": "P",
    "sv": "P"
  },
  "T": {
    "en": "SV",
    "sv": "R"
  },
  "JM": {
    "en": "PIM",
    "sv": "UTV"
  },
  "Syötöt": {
    "en": "Assists",
    "sv": "Assist"
  },
  "Pisteet": {
    "en": "Points",
    "sv": "Poäng"
  },
  "Jäähyminuutit": {
    "en": "Penalty minutes",
    "sv": "Utvisningsminuter"
  },
  "M = maalit · S = syötöt · P = pisteet": {
    "en": "G = goals · A = assists · P = points",
    "sv": "M = mål · A = assist · P = poäng"
  },
  "T = torjunnat · JM = jäähyminuutit": {
    "en": "SV = saves · PIM = penalty minutes",
    "sv": "R = räddningar · UTV = utvisningsminuter"
  },
  "Maalit erissä": {
    "en": "Goals by period",
    "sv": "Mål per period"
  },
  "Erä": {
    "en": "Period",
    "sv": "Period"
  },
  "Laukaukset maalia kohti = omat maalit + vastustajan torjunnat. Ohi menneitä tai blokattuja yrityksiä ei lasketa mukaan.": {
    "en": "Shots on goal = goals scored + saves by the opposing team. Missed and blocked shots are not included.",
    "sv": "Skott på mål = egna mål + motståndarnas räddningar. Skott utanför mål och blockerade skott räknas inte med."
  },
  "Ottelun tarina talteen.": {
    "en": "Keep the story of the match.",
    "sv": "Spara berättelsen om matchen."
  },
  "Jaa siisti ottelukuva tai vie koko tapahtumalista tekstinä.": {
    "en": "Share a match image or export the full event list as text.",
    "sv": "Dela en matchbild eller exportera hela händelselistan som text."
  },
  "Tekstikooste": {
    "en": "Text summary",
    "sv": "Textsammanfattning"
  },
  "Pelaajatilastot": {
    "en": "Player statistics",
    "sv": "Spelarstatistik"
  },
  "Otteluarkisto": {
    "en": "Match archive",
    "sv": "Matcharkiv"
  },
  "Ota pelit talteen": {
    "en": "Keep your matches safe",
    "sv": "Spara dina matcher"
  },
  "Ottelut tallentuvat tämän laitteen selaimeen. Varmuuskopiolla voit siirtää kaikki ottelut toiseen laitteeseen tai palauttaa ne myöhemmin.": {
    "en": "Matches are saved in this device's browser. A backup lets you transfer all matches to another device or restore them later.",
    "sv": "Matcherna sparas i webbläsaren på den här enheten. Med en säkerhetskopia kan du flytta alla matcher till en annan enhet eller återställa dem senare."
  },
  "Vie kaikkien ottelujen varmuuskopio": {
    "en": "Back up all matches",
    "sv": "Säkerhetskopiera alla matcher"
  },
  "Selaimen sivustotietojen poistaminen poistaa myös paikalliset ottelut. Tallennetut varmuuskopiot säilyvät erillisinä tiedostoina.": {
    "en": "Clearing the browser's site data also deletes locally saved matches. Exported backups remain as separate files.",
    "sv": "Om du raderar webbläsarens webbplatsdata tas även de lokalt sparade matcherna bort. Exporterade säkerhetskopior finns kvar som separata filer."
  },
  "Sulje": {
    "en": "Close",
    "sv": "Stäng"
  },
  "Peruuta": {
    "en": "Cancel",
    "sv": "Avbryt"
  },
  "Valitse torjuneen maalivahdin joukkue. Vastustajalle lisätään samalla laukaus maalia kohti.": {
    "en": "Choose the team whose goalkeeper made the save. A shot on goal is added to the opposing team's statistics.",
    "sv": "Välj laget vars målvakt gjorde räddningen. Samtidigt läggs ett skott på mål till för motståndarlaget."
  },
  "01 Joukkue": {
    "en": "01 Team",
    "sv": "01 Lag"
  },
  "02 Pelaaja ja tiedot": {
    "en": "02 Player and details",
    "sv": "02 Spelare och uppgifter"
  },
  "Poista pelaajavalinta": {
    "en": "Clear player selection",
    "sv": "Ta bort spelarval"
  },
  "Numeron voi täydentää myöhemmin tapahtumaa muokkaamalla.": {
    "en": "You can add the number later by editing the event.",
    "sv": "Du kan lägga till numret senare genom att redigera händelsen."
  },
  "Vaihda joukkuetta": {
    "en": "Change team",
    "sv": "Byt lag"
  },
  "Valitse": {
    "en": "Select",
    "sv": "Välj"
  },
  "Syöttäjät": {
    "en": "Assisting players",
    "sv": "Assisterande spelare"
  },
  "Syöttäjän numero": {
    "en": "Assisting player's number",
    "sv": "Assisterande spelares nummer"
  },
  "Minuutit": {
    "en": "Minutes",
    "sv": "Minuter"
  },
  "Rangaistuksen nimi": {
    "en": "Penalty name",
    "sv": "Utvisningens namn"
  },
  "Jäähyn syy": {
    "en": "Reason for penalty",
    "sv": "Orsak till utvisning"
  },
  "Valitse rike": {
    "en": "Select an offence",
    "sv": "Välj förseelse"
  },
  "Rangaistus": {
    "en": "Penalty",
    "sv": "Utvisning"
  },
  "Tarkennus": {
    "en": "Details",
    "sv": "Precisering"
  },
  "Esim. jäähyn kärsivä pelaaja": {
    "en": "E.g. the player serving the penalty",
    "sv": "T.ex. spelaren som avtjänar utvisningen"
  },
  "Korjaa tapahtuma-aikaa": {
    "en": "Adjust event time",
    "sv": "Justera händelsens tid"
  },
  "Kulunut eräaika": {
    "en": "Elapsed period time",
    "sv": "Spelad tid i perioden"
  },
  "Aikaleima otetaan tapahtumapainikkeen painalluksesta. Tässä näkyy kulunut eräaika; tulostaulun kello laskee alaspäin.": {
    "en": "The time is captured when you tap the event button. This shows elapsed period time; the scoreboard clock counts down.",
    "sv": "Tiden registreras när du trycker på händelseknappen. Här visas spelad tid i perioden; klockan på resultattavlan räknar ned."
  },
  "Tyhjä kokoonpano / käsin": {
    "en": "Empty line-up / add manually",
    "sv": "Tom laguppställning / fyll i själv"
  },
  "EKS:n kokoonpano": {
    "en": "EKS line-up",
    "sv": "EKS laguppställning"
  },
  "EKS pelaa": {
    "en": "EKS plays",
    "sv": "EKS spelar"
  },
  "Kotijoukkueena": {
    "en": "As the home team",
    "sv": "Som hemmalag"
  },
  "Vierasjoukkueena": {
    "en": "As the away team",
    "sv": "Som bortalag"
  },
  "Erän pituus, min": {
    "en": "Period length, min",
    "sv": "Periodlängd, min"
  },
  "Vastustajan nimi": {
    "en": "Opponent's name",
    "sv": "Motståndarlagets namn"
  },
  "Ottelupäivä": {
    "en": "Match date",
    "sv": "Matchdatum"
  },
  "Nykyinen ottelu siirtyy arkistoon.": {
    "en": "The current match will move to the archive.",
    "sv": "Den aktuella matchen flyttas till arkivet."
  },
  "Uuden ottelun tulos ja tapahtumat nollautuvat. Valittu EKS-kokoonpano kopioidaan uuteen otteluun; vastustajan pelaajat lisätään tarvittaessa käsin.": {
    "en": "The new match starts at 0–0 with no events. The selected EKS line-up is copied into it; add the opposing players manually if needed.",
    "sv": "Den nya matchen börjar på 0–0 utan händelser. Den valda EKS-laguppställningen kopieras till matchen. Lägg till motståndarnas spelare manuellt vid behov."
  },
  "Luo ottelu": {
    "en": "Create match",
    "sv": "Skapa match"
  },
  "Erän pituus on lukittu tämän ottelun alkamisen jälkeen.": {
    "en": "The period length is locked once this match has started.",
    "sv": "Periodlängden är låst efter att matchen har startat."
  },
  "Jäljellä oleva aika": {
    "en": "Time remaining",
    "sv": "Tid kvar"
  },
  "Syötä hallin kellossa näkyvä aika. Aiemmin kirjattujen tapahtumien ajat säilyvät ennallaan.": {
    "en": "Enter the time shown on the rink's clock. Times of previously recorded events stay unchanged.",
    "sv": "Ange tiden som visas på hallens klocka. Tiderna för tidigare registrerade händelser ändras inte."
  },
  "Aseta aika": {
    "en": "Set time",
    "sv": "Ställ in tid"
  },
  "Nimi päivittyy myös tämän ottelun aiempiin tapahtumiin ja koosteeseen.": {
    "en": "The name is also updated in this match's earlier events and summary.",
    "sv": "Namnet uppdateras även i matchens tidigare händelser och sammanfattning."
  },
  "Pelaajan sukunimi": {
    "en": "Player's surname",
    "sv": "Spelarens efternamn"
  },
  "Poista pelaaja kokoonpanosta": {
    "en": "Remove player from line-up",
    "sv": "Ta bort spelare ur laguppställningen"
  },
  "Tallenna pelaaja": {
    "en": "Save player",
    "sv": "Spara spelare"
  },
  "Vanha laukausyritys säilyy historiassa, mutta sitä ei lasketa laukauksiin maalia kohti. Korjaa virheellinen kirjaus poistamalla se ja kirjaamalla tarvittaessa maali tai torjunta.": {
    "en": "This legacy shot attempt remains in the history but does not count as a shot on goal. To correct it, delete the entry and record a goal or save if appropriate.",
    "sv": "Det här äldre skottförsöket finns kvar i historiken men räknas inte som ett skott på mål. Rätta en felaktig registrering genom att ta bort den och vid behov registrera ett mål eller en räddning."
  },
  "Valmis": {
    "en": "Done",
    "sv": "Klart"
  },
  "Avaaminen siirtää nykyisen ottelun arkistoon. Voit sen jälkeen tarkastella ja korjata tämän pelin tapahtumia.": {
    "en": "Opening this match moves the current one to the archive. You can then review and edit this match's events.",
    "sv": "När du öppnar matchen flyttas den aktuella matchen till arkivet. Sedan kan du granska och rätta händelserna i den här matchen."
  },
  "Avaa ottelu": {
    "en": "Open match",
    "sv": "Öppna match"
  },
  "Tarkista päivitys": {
    "en": "Check for updates",
    "sv": "Sök efter uppdateringar"
  },
  "Epävirallinen ottelutyökalu Kiekko-Espoon väreissä.": {
    "en": "An unofficial match tool in Kiekko-Espoo colours.",
    "sv": "Ett inofficiellt matchverktyg i Kiekko-Espoos färger."
  },
  "Jatka palauteluonnosta": {
    "en": "Continue feedback draft",
    "sv": "Fortsätt med feedbackutkastet"
  },
  "Palaute Henrille": {
    "en": "Feedback to Henri",
    "sv": "Feedback till Henri"
  },
  "Kerro lyhyesti, mitä huomasit tai mitä toivot. Saat tarkistaa viestin ennen sähköpostin avaamista.": {
    "en": "Briefly describe what you noticed or what you would like. You can review your message before opening your email app.",
    "sv": "Beskriv kort vad du märkte eller vad du önskar. Du kan granska meddelandet innan du öppnar e-postappen."
  },
  "Palautteen tyyppi": {
    "en": "Feedback type",
    "sv": "Typ av feedback"
  },
  "Aihe": {
    "en": "Subject",
    "sv": "Ämne"
  },
  "Esimerkiksi kellon korjaaminen": {
    "en": "For example: adjusting the clock",
    "sv": "Till exempel: justera klockan"
  },
  "Miten ongelman saa esiin?": {
    "en": "How can the problem be reproduced?",
    "sv": "Hur kan problemet återskapas?"
  },
  "Liitä tekniset perustiedot": {
    "en": "Include basic technical details",
    "sv": "Bifoga grundläggande tekniska uppgifter"
  },
  "Sovellusversio, käyttöjärjestelmä, selain ja yhteyden tila. Otteluita tai pelaajatietoja ei liitetä.": {
    "en": "App version, operating system, browser and connection status. No match or player data is included.",
    "sv": "Appversion, operativsystem, webbläsare och anslutningsstatus. Inga match- eller spelaruppgifter bifogas."
  },
  "Voit kirjoittaa myös ilman nettiä. Lähetys tehdään omasta sähköpostisovelluksestasi, kun yhteys on käytettävissä.": {
    "en": "You can write offline too. Send the message from your own email app when you have a connection.",
    "sv": "Du kan även skriva offline. Skicka meddelandet från din egen e-postapp när du har uppkoppling."
  },
  "Tyhjennä palauteluonnos": {
    "en": "Clear feedback draft",
    "sv": "Töm feedbackutkast"
  },
  "Takaisin": {
    "en": "Back",
    "sv": "Tillbaka"
  },
  "Esikatsele viesti": {
    "en": "Preview message",
    "sv": "Förhandsgranska meddelandet"
  },
  "Kopioi pitkä viesti ensin.": {
    "en": "Copy the long message first.",
    "sv": "Kopiera det långa meddelandet först."
  },
  "Paina Kopioi viesti, avaa sähköposti ja liitä teksti viestiin. Vastaanottaja ja aihe täyttyvät valmiiksi.": {
    "en": "Tap Copy message, open your email app and paste the text into the message. The recipient and subject will already be filled in.",
    "sv": "Tryck på Kopiera meddelande, öppna e-postappen och klistra in texten. Mottagare och ämne är redan ifyllda."
  },
  "Lähetät viestin sähköpostisovelluksessa.": {
    "en": "Send the message in your email app.",
    "sv": "Du skickar meddelandet i din e-postapp."
  },
  "Avaa sähköposti, tarkista viesti ja paina siellä Lähetä. Voit liittää kuvakaappauksen sähköpostissa.": {
    "en": "Open your email app, check the message and tap Send there. You can attach a screenshot in the email.",
    "sv": "Öppna e-postappen, kontrollera meddelandet och tryck på Skicka där. Du kan bifoga en skärmbild i mejlet."
  },
  "Palautteen esikatselu": {
    "en": "Feedback preview",
    "sv": "Förhandsgranskning av feedback"
  },
  "Kopioi viesti": {
    "en": "Copy message",
    "sv": "Kopiera meddelande"
  },
  "Lataa teksti": {
    "en": "Download text",
    "sv": "Ladda ner text"
  },
  "Kopioi sähköpostiosoite": {
    "en": "Copy email address",
    "sv": "Kopiera e-postadress"
  },
  "Jos sähköposti ei avaudu, kopioi viesti ja osoite omaan sähköpostiisi. Tallennettu luonnos säilyy, kunnes tyhjennät sen. Sovellus ei näe, lähetettiinkö viesti.": {
    "en": "If your email app does not open, copy the message and address into an email yourself. The saved draft remains until you clear it. The app cannot tell whether the message was sent.",
    "sv": "Om e-postappen inte öppnas kan du kopiera meddelandet och adressen till ett mejl själv. Det sparade utkastet finns kvar tills du tömmer det. Appen kan inte se om meddelandet har skickats."
  },
  "Muokkaa": {
    "en": "Edit",
    "sv": "Redigera"
  },
  "Avaa sähköposti": {
    "en": "Open email app",
    "sv": "Öppna e-postappen"
  },
  "iPhone · Safari": {
    "en": "iPhone · Safari",
    "sv": "iPhone · Safari"
  },
  "Avaa tämä osoite Safarissa. Valitse Jaa → Lisää Koti-valikkoon. Ota Avaa verkkoappina käyttöön, jos valinta näkyy. Tarkista nimeksi Kiekkokirjuri ja paina Lisää.": {
    "en": "Open this address in Safari. Choose Share → Add to Home Screen. Enable Open as Web App if the option appears. Check that the name is Kiekkokirjuri and tap Add.",
    "sv": "Öppna adressen i Safari. Välj Dela → Lägg till på hemskärmen. Aktivera Öppna som webbapp om alternativet visas. Kontrollera att namnet är Kiekkokirjuri och tryck på Lägg till."
  },
  "Android · Chrome": {
    "en": "Android · Chrome",
    "sv": "Android · Chrome"
  },
  "Avaa tämä osoite Chromessa. Valitse ⋮ → Asenna ja luo pikakuvake → Asenna. Joissakin versioissa valinta on Lisää aloitusnäyttöön.": {
    "en": "Open this address in Chrome. Choose ⋮ → Install and create shortcut → Install. In some versions, the option is Add to home screen.",
    "sv": "Öppna adressen i Chrome. Välj ⋮ → Installera och skapa genväg → Installera. I vissa versioner heter alternativet Lägg till på startskärmen."
  },
  "Avaa uusi Kiekkokirjuri-kuvake kerran netissä": {
    "en": "Open the new Kiekkokirjuri icon once while online",
    "sv": "Öppna den nya Kiekkokirjuri-ikonen en gång när du är uppkopplad"
  },
  "Odota, että asetuksissa lukee Valmis myös ilman yhteyttä. Sen jälkeen voit kirjata ottelut ilman verkkoa. Uudet kokoonpanot ja sovelluspäivitykset haetaan verkkoyhteydellä.": {
    "en": "Wait until the settings say Ready to use offline. You can then record matches without an internet connection. New line-ups and app updates are downloaded when you are online.",
    "sv": "Vänta tills det står Klar att använda offline i inställningarna. Därefter kan du registrera matcher utan internetanslutning. Nya laguppställningar och appuppdateringar hämtas när du är uppkopplad."
  },
  "Onko sinulla jo otteluita vanhassa kuvakkeessa tai selaimessa?": {
    "en": "Already have matches in the old app icon or browser?",
    "sv": "Har du redan matcher i den gamla appikonen eller webbläsaren?"
  },
  "Vie niistä varmuuskopio ennen uuden kuvakkeen lisäämistä. Vanha kuvake ei välttämättä vaihda nimeä tai kuvaa itsestään. Jos uusi kuvake avaa tyhjän ottelun, palauta varmuuskopio siinä. Säilytä vanha sovellus, kunnes ottelut näkyvät myös uudessa.": {
    "en": "Export a backup before adding the new icon. The old icon may not update its name or image automatically. If the new icon opens an empty match, restore the backup there. Keep the old app until your matches also appear in the new one.",
    "sv": "Exportera en säkerhetskopia innan du lägger till den nya ikonen. Den gamla ikonen kanske inte uppdaterar sitt namn eller sin bild automatiskt. Om den nya ikonen öppnar en tom match återställer du säkerhetskopian där. Behåll den gamla appen tills matcherna också syns i den nya."
  },
  "Selvä": {
    "en": "Got it",
    "sv": "Uppfattat"
  },
  "Ottelun tekstikooste": {
    "en": "Match text summary",
    "sv": "Matchens textsammanfattning"
  },
  "Lataa .txt": {
    "en": "Download .txt",
    "sv": "Ladda ner .txt"
  },
  "Kopioi teksti": {
    "en": "Copy text",
    "sv": "Kopiera text"
  },
  "Lataa PNG": {
    "en": "Download PNG",
    "sv": "Ladda ner PNG"
  },
  "Jaa kuva": {
    "en": "Share image",
    "sv": "Dela bild"
  },
  "Päivitä sovellus": {
    "en": "Update app",
    "sv": "Uppdatera appen"
  },
  "Kerro omin sanoin. Mitä teit ja mitä odotit tapahtuvan?": {
    "en": "Describe it in your own words. What did you do, and what did you expect to happen?",
    "sv": "Beskriv med egna ord. Vad gjorde du, och vad förväntade du dig skulle hända?"
  },
  "Esimerkiksi: avaan ottelun, käynnistän kellon…": {
    "en": "For example: I open the match, start the clock…",
    "sv": "Till exempel: jag öppnar matchen, startar klockan…"
  },
  "{period}. erä": {
    "en": "Period {period}",
    "sv": "Period {period}"
  },
  "{period}. ERÄ": {
    "en": "PERIOD {period}",
    "sv": "PERIOD {period}"
  },
  "Tulos {home}–{away}": {
    "en": "Score {home}–{away}",
    "sv": "Ställning {home}–{away}"
  },
  "{count} tapahtumaa": {
    "en": "{count} events",
    "sv": "{count} händelser"
  },
  "{count} pelaajaa": {
    "en": "{count} players",
    "sv": "{count} spelare"
  },
  "{team}: pelaajatilastot": {
    "en": "{team}: player statistics",
    "sv": "{team}: spelarstatistik"
  },
  "Muokkaa pelaajaa {player}": {
    "en": "Edit player {player}",
    "sv": "Redigera spelare {player}"
  },
  "Syöttäjä {player}": {
    "en": "Assist by {player}",
    "sv": "Assist av {player}"
  },
  "{role}, numero": {
    "en": "{role}, number",
    "sv": "{role}, nummer"
  },
  "Versio {version}": {
    "en": "Version {version}",
    "sv": "Version {version}"
  },
  "Uusi versio {version} on valmis.": {
    "en": "New version {version} is ready.",
    "sv": "Den nya versionen {version} är klar."
  },
  "Ottelukooste: {home} vastaan {away}": {
    "en": "Match summary: {home} vs {away}",
    "sv": "Matchsammanfattning: {home} mot {away}"
  },
  "Maalivahti valitsematta": {
    "en": "No goalkeeper selected",
    "sv": "Ingen målvakt vald"
  },
  "Ilman numeroa": {
    "en": "No number",
    "sv": "Utan nummer"
  },
  "Valitse maalivahti": {
    "en": "Choose goalkeeper",
    "sv": "Välj målvakt"
  },
  "Vaihda maalivahti": {
    "en": "Change goalkeeper",
    "sv": "Byt målvakt"
  },
  "Kirjaa torjunta": {
    "en": "Record save",
    "sv": "Registrera räddning"
  },
  "Kirjaa torjunta: {team}": {
    "en": "Record save: {team}",
    "sv": "Registrera räddning: {team}"
  },
  "Vaihda maalivahti: {team}": {
    "en": "Change goalkeeper: {team}",
    "sv": "Byt målvakt: {team}"
  },
  "Valitse maalivahti: {team}": {
    "en": "Choose goalkeeper: {team}",
    "sv": "Välj målvakt: {team}"
  },
  "Torjunta tallentuu heti joukkueen painalluksesta, kun maalivahti on valittu.": {
    "en": "Once a goalkeeper is selected, tapping the team records the save immediately.",
    "sv": "När en målvakt är vald registreras räddningen direkt när du trycker på laget."
  },
  "Valitse maalivahti kerran. Tämä torjunta kirjataan samalla.": {
    "en": "Choose the goalkeeper once. This also records the save.",
    "sv": "Välj målvakt en gång. Den här räddningen registreras samtidigt."
  },
  "Valinta koskee seuraavia torjuntoja. Aiemmat kirjaukset säilyvät ennallaan.": {
    "en": "This choice applies to future saves. Earlier entries stay unchanged.",
    "sv": "Valet gäller kommande räddningar. Tidigare registreringar ändras inte."
  },
  "Valinta muistetaan tämän ottelun ajan. Voit vaihtaa maalivahdin tästä tai Pelaajat-näkymästä.": {
    "en": "This choice is remembered for this match. Change the goalkeeper here or in Players.",
    "sv": "Valet sparas för den här matchen. Du kan byta målvakt här eller under Spelare."
  },
  "Valitse ja kirjaa torjunta": {
    "en": "Select and record save",
    "sv": "Välj och registrera räddning"
  },
  "Maalivahdin numero": {
    "en": "Goalkeeper number",
    "sv": "Målvaktens nummer"
  },
  "Kirjaa ilman numeroa": {
    "en": "Record without a number",
    "sv": "Registrera utan nummer"
  },
  "Jatka ilman numeroa": {
    "en": "Continue without a number",
    "sv": "Fortsätt utan nummer"
  },
  "Torjunta kirjattu · {team} · {goalie}": {
    "en": "Save recorded · {team} · {goalie}",
    "sv": "Räddning registrerad · {team} · {goalie}"
  },
  "Maalivahti valittu · {team} · {goalie}": {
    "en": "Goalkeeper selected · {team} · {goalie}",
    "sv": "Målvakt vald · {team} · {goalie}"
  },
  "Valitse numero väliltä 0–99 tai jatka ilman numeroa.": {
    "en": "Choose a number from 0–99 or continue without a number.",
    "sv": "Välj ett nummer mellan 0 och 99 eller fortsätt utan nummer."
  },
  "Palaa joukkueen valintaan": {
    "en": "Back to team selection",
    "sv": "Tillbaka till lagval"
  },
  "Maalivahti tässä ottelussa": {
    "en": "Goalkeeper for this match",
    "sv": "Målvakt i den här matchen"
  },
  "Vaihto ei kirjaa torjuntaa.": {
    "en": "Changing the goalkeeper does not record a save.",
    "sv": "Ett målvaktsbyte registrerar ingen räddning."
  }
};

export const uiText = createTranslator(UI_MESSAGES);
