# Kiekkokirjurin puhekirjaus – tutkimus ja toteutussuunnitelma

Päivitetty 28.11.2026. Tila: suunnitelma, ei vielä käytössä oleva ominaisuus.

## Suositus

Pidetään kummankin joukkueen suora torjuntapainike ensisijaisena. Puheesta on todennäköisesti eniten hyötyä maalintekijän, syöttäjien ja jäähyn tietojen täyttämisessä. Tätä hyötyä pitää mitata hallissa; yksinkertaisen torjunnan puhuminen ja tarkistaminen voi olla hitaampaa kuin yksi painallus.

Suositeltu seuraava vaihe on erillinen paikallisen puheentunnistuksen prototyyppi: paina puhepainiketta, sano lyhyt tapahtuma ja tarkista ehdotus. Valitaan tunnistusmoottori oikeilla iPhone- ja Android-puhelimilla tehtävän vertailun perusteella. Pelkän selaimen Web Speech API:n varaan ei luvata suomen-, ruotsin- ja englanninkielistä offline-toimintaa kaikilla puhelimilla.

## Mitä lähteistä voi päätellä

| Vaihtoehto | Lähteissä dokumentoitu | Johtopäätös tähän sovellukseen |
|---|---|---|
| Selaimen Web Speech API | `processLocally: true` vaatii paikallista käsittelyä. `available()` tarkistaa kielikohtaisen valmiuden ja `install()` asentaa resursseja. Oletusarvo ei takaa paikallista käsittelyä. [1] | Hyödynnettävissä vain, jos sekä ominaisuus että tarvittava kieli on laitteessa oikeasti saatavilla. Asennettujen kielipakettien valmius tarkistetaan erikseen. |
| Chrome puhelimessa | Chromium-kehittäjän toukokuun 2026 vastauksen mukaan Android ei tuolloin tukenut paikallista Web Speech -tunnistusta. Tarkistetun päähaaran `UseOnDeviceSpeechRecognition` palauttaa Androidilla edelleen `false`; natiivitunnistus on eri toteutuspolku. [2] | Työpöytä-Chromen tuki ei osoita Android-PWA:n offline-tukea. Tarkistetaan julkaistu selain laitteella; käyttöjärjestelmän sanelutuki ei yksin riitä. |
| Safari ja iPhone | WebKit dokumentoi Safarin puheentunnistuksen ja Siriin liittyvän moottorin. Julkaisu ei lupaa tässä tarvittavaa kolmen kielen offline-toimintaa Koti-valikon verkkosovelluksessa. [3] | Paikallinen toiminta jää tässä tutkimuksessa vahvistamatta. Safari-välilehti ja Koti-valikon sovellus testataan erikseen. |
| Oma selainmalli | `whisper.cpp` tarjoaa paikallisen WebAssembly-toteutuksen; dokumentin `tiny`-malli on noin 74 Mt. Sen suorituskykyesimerkit eivät ole tämän sovelluksen iPhone-mittauksia. [4] | Pieni monikielinen malli on kevyt vertailun lähtökohta. Suomen numerot ja hallimelu voivat silti rajoittaa laatua. |
| MediaPipe Audio Transcriber | Googlen selainrajapinta suorittaa tunnistuksen laitteessa ja tukee lopullisia sekä keskeneräisiä tuloksia. Parakeet TDT 0.6B v3 -mallipaketti on noin 600 Mt; mallikortti listaa suomen, ruotsin ja englannin. [5][6] | Ajantasainen toinen prototyyppiehdokas. Selvästi suurempi lataus ja muistitarve; kielilista ei takaa käytännön nopeutta tai osumatarkkuutta jääkiekossa. |
| Natiivi sovellus | Applen SpeechAnalyzer ja Androidin paikallinen SpeechRecognizer tarjoavat laitekohtaiset rajapinnat; kielten, mallien ja laitteen tuki tarkistetaan. Nämä eivät sellaisenaan ole PWA:n JavaScript-rajapintoja. [7][8] | Mahdollinen myöhempi sovelluspaketointi, jos selaimessa ajettava malli ei riitä. Se kasvattaa ylläpitoa ja jakelutyötä. |

WebAudio-kehittäjien Chrome-kieliesimerkissä ei ole suomea eikä ruotsia. Lista on selaimesta riippuva esimerkki, ei pysyvä maailmanlaajuinen kielitakuu. Saatavuus pitää kysyä käytettävästä moottorista. [9]

Googlen marraskuun 2026 ML Kit -dokumentaatiossa ruotsi on Advanced-tilan beetakieli, suomea ei ole taulukossa ja laitetuki vaihtelee. Se ei siksi yksin ratkaise kaikkien toimitsijoiden offline-käyttöä. [10]

**Vahvistamatta:** oikeiden kohdepuhelinten tunnistustarkkuus, käynnistysviive, muistirajat, akun kulutus, Bluetooth-mikrofonin toiminta sekä käytös hallimelussa ja lentotilassa. Näitä ei ole testattu tässä tutkimuksessa.

## Käyttöliittymä ja puhekomennot

Puhepainike aloittaa yhden lyhyen kuuntelun. Käyttäjä lopettaa sen uudella painalluksella; myöhemmin voi kokeilla pidä pohjassa -elettä. Sovellus näyttää selvästi kuuntelun, tulkinnan ja valmiin ehdotuksen. Mikrofonia ei jätetä jatkuvasti päälle. Lupa ja mallin lataus valmistellaan ennen ottelua, ja puhekieli valitaan erikseen (FI, EN tai SV).

| Esimerkki | Ehdotettu tulkinta |
|---|---|
| ”Sininen torjunta” | Sinisen joukkueen maalivahti torjui; vastustajalle yksi laukaus maalia kohti. |
| ”Sininen maali viisitoista, syöttäjät viisikymmentäkahdeksan ja kaksikymmentäkuusi” | Maali #15, syötöt #58 ja #26. |
| ”Valkoinen jäähy kahdeksantoista, kaksi minuuttia, kampitus” | Valkoinen #18, pieni rangaistus, kampitus. |
| ”Koti maali seitsemänkymmentäseitsemän” | Kotijoukkueen maali #77; syöttäjiä ei oleteta. |

Joukkue tunnistetaan otteluun valitusta väristä, koti/vieras-sanasta tai yksiselitteisestä joukkueen nimestä. Värin pitää tarkoittaa aina **tapahtuman saavaa joukkuetta**, myös torjunnoissa. Jos ryhmänimi ja valittu paitaväri ovat ristiriidassa tai molemmat joukkueet ovat samanvärisiä, epäselvä värikäsky ohjataan joukkuevalintaan. Pelaajanumerot hyväksytään vain väliltä 0–99; samannumeroisia pelaajia eri joukkueissa ei yhdistetä. Ensiversio käyttää numeroita sukunimien tunnistamisen sijasta.

Tunnistus tuottaa ehdotuksen: joukkue nimineen ja väreineen, tapahtuma, pelaajat, rangaistus ja tapahtuma-aika. Käyttäjä painaa **Tallenna**, **Korjaa** tai **Peruuta**. Epäselvästä syötteestä ei arvata pelaajaa, joukkuetta, minuutteja tai jäähylajia. Kaksi plus kaksi tunnistetaan omana rangaistustyyppinään. Avoin tekstikuvaus säilyy tarvittaessa käsin täytettävänä.

Ensiversiossa puhe ei automaattisesti muuta tulostaulua. Kosketuksella kirjattavat torjunnat toimivat edelleen yhdellä painalluksella. Puheella käynnistetyn torjunnan voi ottaa mukaan kokeiluun, mutta sitä ei käytetä perusteluna suorien nappien poistamiselle.

## Liittäminen nykyiseen sovellukseen

1. Puhepainikkeen painalluksesta otetaan `gameId`, erä ja kulunut peliaika. Lisäksi talletetaan senhetkinen joukkueiden nimien, värien ja maalivahtien tulkintakonteksti. Aikaa ei oteta vasta tunnistuksen valmistuessa.
2. Tunnistusmoottori palauttaa tekstin. Oma pieni jäsennin muuntaa sallitun kieliopin tapahtumaehdotukseksi. Kiekon tilasto- tai rangaistussääntöjä ei päätellä vapaalla kielimallilla.
3. Ehdotus käyttää nykyisiä tapahtumalomakkeita ja `validateEvent`-validointia. Torjunta kirjataan saman mallipolun kautta kuin kosketustorjunta, jotta laukauksia ei lisätä kahdesti.
4. Ennen tallennusta tarkistetaan ottelun tunniste ja muutoskonflikti. Maalivahdin tai joukkueasetusten vaihtuminen puheen aikana näytetään tarkistettavana; vanha puhetulos ei saa kirjautua uuteen otteluun.
5. Jokaisella puheistunnolla on oma tunniste. Keskeneräiset tunnistustulokset eivät tallenna mitään. Lopullisen tuloksen toistuva callback, myöhäinen tulos tai toinen tallennuspainallus ei saa luoda lisätapahtumaa.
6. Jos toimitsija kirjaa torjunnan napista puhetulkinnan aikana, kyseinen kosketus toimii heti. Puhetorjunnan vahvistus ilmoittaa samanaikaisesta kirjauksesta ja pyytää ratkaisemaan, onko kyse samasta vai toisesta tilanteesta. Pelkkä ajallinen läheisyys ei poista oikeaa toista torjuntaa.
7. Tallennettu tapahtuma käyttää nykyistä kumoamista, muokkausta, arkistoa ja varmuuskopiota. Onnistumista näytetään vasta paikallisen tallennuksen onnistuttua.

## Offline-lataus ja toteutusvaiheet

**Vaihe 1 – vertailuprototyyppi.** Testataan monikielinen Whisper `tiny`/`base` sekä MediaPipe/Parakeet lyhyillä samoilla ääninäytteillä. Mitataan tarkkuus, viive ja muistinkäyttö iPhonella ja tavallisella Android-puhelimella. Suomen peli- ja numerosanasto ratkaisee valinnan; yleisen sanelun vertailupisteet eivät yksin riitä.

**Vaihe 2 – rajattu pilotointi.** Valittu malli ladataan käyttäjän toimesta etukäteen. Puhevalmiudella on oma ilmaisin erillään sovelluksen offline-valmiudesta. Malli, tunnistin, sanastot ja muut tarvittavat tiedostot versioidaan ja tallennetaan kokonaan laitteeseen. Katkennut lataus ei saa merkitä pakettia valmiiksi. Mallin puuttuminen tai poistuminen ei estä ottelun normaalia kirjaamista. Jos käytetty suoritusympäristö tarvitsee erityisiä selain- tai palvelinotsakkeita, niiden soveltuvuus nykyiseen julkaisuun tarkistetaan ennen teknologian valintaa.

**Vaihe 3 – julkaisu vain mitatun hyödyn perusteella.** Ensimmäisen pilotin pääkohteet ovat maalit ja jäähyt. Tunnistuksen vaatima tarkistaminen saa olla helpompaa kuin tietojen syöttäminen käsin. Mallipakettia ei lisätä automaattisesti kaikkien toimitsijoiden pieneen perusasennukseen.

Verkkopohjainen puhetunnistus olisi erillinen valinnainen tuotevalinta. Sitä ei käytetä hiljaisena vararatkaisuna, jos paikallinen tunnistus puuttuu: silloin alkuperäinen offline-vaatimus ei täyty.

## Hyväksymiskokeet

- Käynnistys lentotilassa sovelluksen ja puhepaketin lataamisen jälkeen; sovelluksen sulkeminen ja uudelleenavaus. Tarkistus erikseen Safarissa, Koti-valikosta ja Android Chromessa.
- Samat lyhyet komennot suomeksi, ruotsiksi ja englanniksi, hiljaisuudessa sekä aidossa hallimelussa. Mukaan numerot 0, 14, 15, 18, 58, 77 ja 98 sekä kaksi syöttäjää.
- Joukkueen väri/nimi vaihtuu, maalivahti vaihtuu, erä vaihtuu, kello korjataan ja uusi ottelu aloitetaan tunnistuksen aikana.
- Mikrofoniluvan epääminen, puhelu, näytön lukitus, sovelluksen taustalle vienti, hiljaisuus, katkennut puhe ja kuulokkeiden irtoaminen. Näistä ei saa syntyä tapahtumaa itsestään.
- Samasta puheesta tulevat useat osatulokset ja lopputulokset, toistuva tallennuspainallus sekä käsin kirjattu torjunta samaan aikaan. Jokainen vahvistettu tilanne tallentuu vain kerran.
- Käytettävyystavoitteet (ehdotus, eivät mitattu tulos): lämmitetyn mallin ehdotus näkyviin tavallisesti alle kahdessa sekunnissa puheen lopusta, eikä puhe estä suoran torjuntapainikkeen toimintaa. Jos maalin tai jäähyn kokonaiskirjausaika ei parane, toimintoa ei vielä tuoda oletuksena käyttöön.

## Lähteet

Tarkistettu 28.11.2026. Lähteet kuvaavat rajapintoja ja mallien ominaisuuksia; yllä olevat työnkulut, etenemisjärjestys ja hyväksymiskokeet ovat tätä sovellusta varten ehdotettu suunnitelma.

[1]: https://webaudio.github.io/web-speech-api/
[2]: https://chromium.googlesource.com/chromium/src/+/refs/heads/main/content/browser/speech/speech_recognition_manager_impl.cc
[3]: https://webkit.org/blog/11648/new-webkit-features-in-safari-14-1/
[4]: https://github.com/ggml-org/whisper.cpp/blob/master/examples/whisper.wasm/README.md
[5]: https://developers.google.com/edge/mediapipe/solutions/audio/audio_transcriber/index
[6]: https://huggingface.co/litert-community/parakeet-tdt-0.6b-v3
[7]: https://developer.apple.com/videos/play/wwdc2025/277/
[8]: https://developer.android.com/reference/android/speech/SpeechRecognizer
[9]: https://github.com/WebAudio/web-speech-api/blob/main/explainers/on-device-speech-recognition.md
[10]: https://developers.google.com/ml-kit/genai/speech-recognition/android

- [Web Speech API – paikallinen käsittely ja kielipaketit][1]
- [Chromium – puheentunnistuksen päähaaran toteutus][2]; [Chromium-kehittäjän tilannekuva 6.5.2026](https://groups.google.com/a/chromium.org/g/blink-dev/c/P8P-x7AnC6I/m/ClOfRRtOAAAJ)
- [WebKit – Safarin Web Speech API][3]
- [whisper.cpp – WebAssembly-esimerkki][4]
- [Google MediaPipe – Audio Transcriber][5] ja [Parakeet-mallipaketti][6]
- [Apple – SpeechAnalyzer][7] ja [Android – SpeechRecognizer][8]
- [WebAudio – selainkohtaiset kielet ja paikallinen tunnistus][9]
- [Google ML Kit – kieli- ja laitetuki][10]
