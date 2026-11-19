# Little BabyLove – masterspesifikasjon for prototype

**Versjon:** 1.0  
**Dato:** 4. november 2026  
**Status:** Arbeidsgrunnlag for intern studentprototype – ikke godkjent produksjonsspesifikasjon  
**Prosjekt:** IS-219, gruppe 3  
**Konfidensialitet:** Studentbriefen angir at konseptet er konfidensielt. Avklar deling/publisering med oppdragsgiver før repo eller demo gjøres offentlig.

## 0. Slik skal dokumentet brukes

Dette er prosjektets samlende **produkt- og kontekstspesifikasjon**. Start-promptet (`STARTPROMPT_VSCODE.md`) skal be kodeassistenten lese dette dokumentet før den foreslår arkitektur eller skriver kode. Ved motstrid gjelder (1) eksplisitte beslutninger fra prosjekteier/studentgruppen, (2) denne masterspesifikasjonen, (3) enkeltstående feature-spesifikasjoner, i den grad de er oppdatert og konsistente, (4) generelle forslag fra KI. Stopp og synliggjør reelle konflikter – ikke finn på en løsning.

Skill mellom:
- **Dokumenterte funn:** opplysninger fra gruppens intervjuer/oppgaver og oppdragsgivers brief.
- **Gruppens konseptvalg:** kart som hovedfunksjon og Kristiansand som pilotområde.
- **Designhypoteser:** detaljer vi foreslår å teste, og ikke påstår at brukerne allerede ønsker.
- **Demodata:** aldri presentert som bekreftet virkelighetsinformasjon.

### Kildedokumenter og forankring

1. `IS-219 - Oppgave 3. Fasene Undersøkelse og Analyse - Gruppe 3 (7).pptx`: oppsummering av fem intervjuer, personas Jonas/Ingrid/Maria, behov for tillit, rask informasjonsfremfinning og lokale tilbud (særlig lysbilde 8–17).
2. `IS-219 - Oppgave 4. Fasene Idégenerering og Idéutvelgelse - Gruppe 3 (2).pptx`: konseptprioritering, verdiforslag for kart, Ingrids brukerreise, første krav og WBS (særlig lysbilde 5–9).
3. `IS-219 - KONSEPTFORSLAG for mulig prototyping - Karoline.docx`: utkastet «Enklere babyliv, hjemme og ute», kategori- og filterideer, pappa-inkludering, forslag til navigasjon og tillitsregler.
4. `Little BabyLove – studentbrief og intervjuguide (1).pdf`: oppdragsgivers mål, positiv/praktisk profil, utstyrslister, påminnelser, delte oppgaver, budsjett, kommersiell avgrensning og konfidensialitet (særlig s. 1–5).
5. `IS-219 Digitalisering og Tjenestedesign (2026-4 og 5) - Oppgavemal.pptx`: kundeopplevelse, brukerflyt, IX/UX og testplan.
6. `Prototyping-fasen - veikart - v_2026-08-12.docx`: Context → Spec → Plan → Build → Verify; sporbarhet fra brukerbehov via blueprint til krav, tester og kode (særlig s. 5–11 og 24–26).
7. `IS-219 - Refleksjonsoppgave - Gruppe 3 (1).pdf`: samskaping, brukerinvolvering og iterasjon.

> **Viktig avvik fra opprinnelig brief:** Briefen prioriterer utstyrsliste, påminnelser og kjøpsbudsjett i første modul, og legger lokale tilbud til en senere modul. Studentgruppen har etter idegenerering valgt **kartet som hovedkonsept**. Dette er en bevisst prototypetolkning, ikke en påstand om at oppdragsgiver allerede har godkjent omprioriteringen. Be om eksplisitt tilbakemelding fra oppdragsgiver.

---

## 1. Produktvisjon

**Produktnavn:** Enklere Babyliv – *Enklere babyliv, hjemme og ute*.  
**Løfte:** Gjør det enkelt for kommende og nybakte foreldre å finne babyvennlige steder, turer og aktiviteter, samtidig som de får et rolig og praktisk hjelpemiddel for svangerskapet og de første månedene.

### 1.1 Produktet skal være

- **Kart-først:** «Hvor kan jeg dra med baby, og hva må jeg vite før jeg drar?»
- **Praktisk:** Opplysninger om reelle fasiliteter fremfor diffuse «babyvennlig»-poengsummer.
- **Inkluderende:** Både mor, pappa, medforelder og andre omsorgspersoner skal kjenne seg igjen; et særskilt Pappaspor synliggjør farens behov.
- **Relevant over tid:** En lett, personlig tidslinje knytter informasjon og sjekklister til svangerskapsuke og barnets alder.
- **Tillitsvekkende:** Kilde, oppdateringsstatus, usikkerhet og kommersielle interesser gjøres tydelige.
- **Raskt:** Kartet kan brukes uten konto, uten obligatorisk GPS og uten en lang oppstartsguide.

### 1.2 Prototypens formål

En interaktiv studentprototype for å demonstrere og teste to komplette brukerreiser, ikke en produksjonsklar app med sanntidsdata, betalinger eller personopplysningsbehandling.

**Overordnet testspørsmål:** Kan en forelder bruke kartet til å velge en passende destinasjon uten å måtte lete på flere steder?  
**Sekundært testspørsmål:** Oppleves personlig oppfølging og pappa-fokus som nyttige supplementer som gjør tjenesten mer relevant over tid?

### 1.3 Fastsatte beslutninger

| Beslutning | Valg |
|---|---|
| Produktform | Mobiltilpasset webapp, PWA-lignende; skal også fungere i desktop-nettleser |
| Hovedfunksjon | Interaktivt kart over babyvennlige steder og aktiviteter |
| Geografi | Kristiansand og nærområdene |
| Datagrunnlag | Kombinasjon av reelle, identifiserbare steder og tydelig merket fiktiv testdata |
| Prioritering | To komplette brukerreiser, enklere støttesider ellers |
| Teknikk | VS Code + GitHub Copilot eller Claude Code; React/TypeScript/Vite foreslås |
| Kart | React Leaflet/Leaflet foreslås; kartleverandør kan byttes |
| Innlogging | Ikke nødvendig for første prototype |
| Varsler | Simulert varslings-/e-postvisning, ingen ekte utsendelse |
| Kjøp/booking | Ingen reelle kjøp eller bookinger |
| Språk | Norsk bokmål |

---

## 2. Brukerinnsikt, målgrupper og designprinsipper

### 2.1 Kjerneinnsikt fra oppgave 3

- Foreldre har ofte **for mye spredt informasjon**, ikke for lite.
- **Tillit** til informasjon og kildeangivelse er svært viktig; KI og reklame kan skape tvil.
- Behov varierer med erfaring og livsfase.
- Praktisk hjelp, informasjon om lokale barnevennlige tilbud og inkludering av pappa er aktuelle behov.
- Utstyrsråd bør unngå unødvendig kjøpepress.

Dette bygger på et begrenset kvalitativt materiale (fem intervjuer, hvorav én far) og må ikke generaliseres ukritisk.

### 2.2 Personas og prøvebrukere

- **Ingrid – hovedscenario kart:** Førstegangsmor i permisjon fra oppgave 3, 29 år, vil planlegge kafé- og trilletur i Kristiansand.
- **Jonas – hovedscenario personlig reise:** Førstegangsfar fra oppgave 3, 32 år, ønsker å være involvert, finne konkrete tips og vite hva som trengs når.
- **Maria – supplerende:** Erfaren flerbarnsmor som vil finne relevante ting raskt og unngå reklame/kjøpepress.

Jonas/Ingrid/Maria er personas konstruert på bakgrunn av funn og tolkninger i oppgave 3. Dette er ikke faktiske personopplysninger.

### 2.3 Designprinsipper

1. **Finn fram på sekunder:** Ingen obligatorisk profil før kartbruk.
2. **Ikke gjett om fasiliteter:** `ukjent` er et reelt og synlig svar.
3. **Tilgjengelig for alle omsorgspersoner:** Spesifikk opplysning om hvorvidt stellefasiliteter er tilgjengelige for alle, ikke antatt ut fra «stellerom finnes».
4. **Gjør det enkelt å komme tilbake:** favoritter og diskret milepæloversikt.
5. **Ingen innholdsstøy:** korte, prioriterte tekster og varm, voksen visuell stil.
6. **Ingen skjult kommersiell rangering:** sponsing må merkes; relevans og filtertreff skal styre ordinære resultater.
7. **Ikke helseapp:** ingen individuelle medisinske vurderinger; kildebelagte ressurser og varsomme generelle tips.
8. **Brukerinvolvering:** funksjonalitet skal evalueres med reelle brukere.

---

## 3. Informasjonsarkitektur og navigasjon

Fem hovedvalg (mobil bunnmeny, desktop toppmeny/sidepanel):

1. **Hjem:** tydelig inngang til «Finn steder», aktivitetstips, mulighet for frivillig personlig profil, neste milepæl hvis profil finnes.
2. **Utforsk:** kart/liste, søk, filterchips, kategorier, detaljkort for steder/turer/aktiviteter, favoritter og eventuell ekstern navigasjon.
3. **Min tur:** opptil tre valgte stopp, dato og huskelapp, med kobling tilbake til Utforsk.
4. **Min baby:** frivillig registrering av termin eller svangerskapsuke, tidslinje, milepæler, pappatips, sjekklister og utstyrslister.
5. **Mer:** samler Guider, Partnertilbud og Profil/innstillinger. Partnerportalen er tilgjengelig fra Partnertilbud, men er ikke et hovedvalg.

Globalt: tydelig merkevare, enkel navigasjon, mulig søk og synlig demomodus. Ingen døde menyer: sekundærsider kan være enklere, men lenker må føre til faktisk innhold eller være tydelig merket «Ikke i denne prototypen».

---

## 4. To komplette brukerreiser

### 4.1 BR-A – Ingrid finner en kafé eller tur med baby

**Situasjon:** Ingrid ønsker en trilletur i Kristiansand sentrum, eventuelt et kaféstopp sammen med barselgruppen. Hun er usikker på om det er plass til barnevogn og stellefasiliteter.

**Flyt:**

1. Åpner appen, lander på «Hjem», velger «Utforsk kart» uten innlogging.
2. Ser et kart som er sentrert på Kristiansand sentrum, og samme resultater i tilgjengelig listevisning.
3. Velger kategorien «Kaféer og møteplasser» eller «Trilleturer».
4. Aktiverer filtrene «Plass til barnevogn» og «Stellerom»; resultattall og markører oppdateres.
5. Åpner et stedskort og ser navn, beskrivelse, fasiliteter med ja/nei/ukjent, kilde og sist kontrollert.
6. Lagre sted i favoritter. Favoritten beholdes etter oppfrisking i samme nettleser.
7. Velger «Vis vei». Hvis ekte navigasjon/rute ikke er implementert, åpnes tydelig merket ekstern kartlenke; appen later ikke som den har beregnet trygg barnevognrute.

**Alternativer og feiltilfeller:** ingen resultater; bare steder med ukjente fasiliteter; manglende internett/kartfliser; bruker avslår GPS; sted mangler koordinater; demosted kan ikke forveksles med virkelig sted; filter som er for strengt. Vis vennlig tomtilstand med «Nullstill filtre».

**Akseptanse:** BR-A kan fullføres uten profil, filter påvirker markører **og** liste, status og kilde vises, favoritt blir liggende etter reload og tomtilstander er forståelige.

### 4.2 BR-B – Jonas registrerer termin og bruker «Min baby»

**Situasjon:** Jonas vil forberede seg på å bli far og bidra praktisk.

**Flyt:**

1. Fra Hjem velger Jonas «Min baby» og «Kom i gang».
2. Velger «Kommende pappa/medforelder» eller tilsvarende frivillig rolle, og registrerer **termindato eller aktuell svangerskapsuke**.
3. Ser beregnet, **omtrentlig** svangerskapsuke og en personlig tidslinje. Input kan redigeres og har forklaring på beregningen.
4. Får en kort milepæltekst og pappatips, merket som generelle råd, ikke medisinsk veiledning.
5. Åpner en sjekkliste, krysser av en oppgave og finner igjen tilstanden etter reload.
6. Ser forhåndsvisning av et fremtidig e-post-/pushvarsel (ikke sendt), og kan slå av visning/preferanse.
7. Får en kontekstuell kobling til kartet, for eksempel «Se babyvennlige steder å besøke etter fødselen».

**Alternativer og feiltilfeller:** Jonas vil ikke oppgi termin; ukjent/forbigått termindato; profil for «barnet er født»; slett demoopplysninger; riktig tomtilstand ved ugyldig input; ingen skjult automatisk utsendelse.

**Akseptanse:** Beregning og milepælinnhold oppdateres deterministisk ved endring av termindato/uke; sjekklister husker avkrysninger; en bruker kan fjerne profilen og all lokal demotilstand.

### 4.3 Supplerende mikroscenarioer

- Ingrid søker etter en lokal aktivitet og undersøker hva som er bekreftet versus rapportert.
- Maria åpner kartet uten profil og finner raskt et familievennlig uteområde.
- En forelder åpner Pappasporet og finner praktiske forslag uten stereotype antagelser.
- En testbruker møter et falskt demosted og forstår at det ikke er et faktisk forretningssted.
- En bruker prøver å aktivere to filtre som ikke gir treff og får mulighet til å starte på nytt.

---

## 5. Funksjonelle krav

Prioritering: **M = må** (for fullførte hovedreiser), **B = bør** (enkelt demonstrerbar), **S = senere**.

| ID | Pri | Krav |
|---|---|---|
| MAP-01 | M | Interaktivt kart, sentrert på Kristiansand, med markører hentet fra strukturert seed-data |
| MAP-02 | M | Liste-/kartbytte; samme resultater og filterstatus i begge visninger |
| MAP-03 | M | Fritekstsøk og kategori: kafé/møteplass, tur/uteområde, aktivitet/barseltreff |
| MAP-04 | M | Filtrering med reell effekt på datasettet, inkludert barnevognplass og stellerom |
| MAP-05 | M | Stedskort med plassering, beskrivelse, fasiliteter, datakilde og status |
| MAP-06 | M | Ja/nei/ukjent for individuelle fasiliteter; ukjent må ikke behandles som ja |
| MAP-07 | M | Stedskort skiller dokumentert stedsidentitet fra bekreftede fasiliteter |
| MAP-08 | M | Tydelig merke «Fiktivt demosted» for syntetiske oppføringer, også på kort og detaljer |
| MAP-09 | M | Favoritter kan legges til/fjernes og bevares lokalt etter refresh |
| MAP-10 | M | Tomtilstand ved null treff og tydelig nullstillingshandling |
| MAP-11 | B | «Vis vei» åpner ekstern karttjeneste for ekte steder, uten påstand om beregnet trygg rute |
| MAP-12 | B | Besøkende kan se hvordan de rapporterer feil/forslag; i prototype lagres dette bare lokalt eller simuleres tydelig |
| MAP-13 | B | Filtre for trappefri adkomst, amme-/mateplass, stelleplass tilgjengelig for alle omsorgspersoner, underlag/stigning, pris og trefftype |
| ACT-01 | B | Eksempelaktiviteter/barseltreff med dato, målgruppe, pris og påmeldingsstatus, tydelig merket demo |
| PRO-01 | M | Frivillig registrering av termindato **eller** svangerskapsuke; mulig å hoppe over |
| PRO-02 | M | Bruker kan velge rolle/innholdsinteresse uten at det er påkrevd |
| PRO-03 | M | Demoprofil kan redigeres og slettes; ingen ekte konto kreves |
| TIM-01 | M | Personlig tidslinje og regelbaserte milepæler, med tydelig omtrentlig beregning |
| TIM-02 | M | Pappatips i minst tre relevante milepæler |
| LIS-01 | M | Minst to sjekklister som kan krysses av og persisteres lokalt |
| LIS-02 | B | Enkel utstyrsliste: «Må ha», «Fint å ha», «Kan vente», med informasjon om gjenbruk |
| LIS-03 | B | Enkel oppgavefordeling til «meg»/«medforelder» uten innlogging/synkronisering |
| NOT-01 | M | Tydelig **forhåndsvisning** av e-post/pushvarsel; ingen reelle utsendelser |
| NOT-02 | B | Innstilling for ønskede varsler, men tydelig opplyst at prototype ikke sender |
| GUI-01 | B | «Pappasporet» med kort, konkret, ikke-stereotyp informasjon, lenker til kart og sjekklister |
| GUI-02 | B | Korte guider med tydelig kilde og dato; ikke personlig helserådgivning |
| UI-01 | M | Hjem, Utforsk, Min baby, Guider og Profil er navigerbare på mobil og desktop |
| UI-02 | M | Norsk bokmål, hyggelig, kortfattet, ikke masete tone og ingen reklame i kjernen |
| COM-01 | S | Faktiske partneravtaler, booking, betalte plasseringer, rabattkoder og betaling |
| FIN-01 | S | Kjøpsbudsjett og familieøkonomi; kan være enkel statisk skisse hvis ønskelig |
| AI-01 | S | AI-hjelper basert kun på kvalitetssikret innhold; ikke medisinsk rådgivning |
| AUTH-01 | S | Produksjonsinnlogging, delte kontoer og ekte e-post-/push-infrastruktur |

### 5.1 Spesielle regler for turer

En sti/tur skal ikke merkes «egnet for barnevogn» uten konkret grunnlag. Strekninger er ikke nødvendigvis ensartede; eventuelt vis «delvis egnet» og forklaring. Første prototype kan vise et lite antall **forhåndsdefinerte turforslag**; ikke tegn oppdiktede ruter eller beregn ubegrunnede gangtider.

### 5.2 Stedsrangering

Filtre og treffrelevans prioriteres; ingen betalt plassering i ordinær sortering. Ingen syntetiske anmeldelser skal vises som ekte brukerutsagn. Vurderinger og kommentarer er utenfor første MVP, med mindre de eksplisitt merkes som eksempeldata.

### 5.3 Terminberegning

Termindato og uke er **to alternative innganger**, ikke to samtidige krav. Beregning ved termindato er omtrentlig og baseres på en modell med 40 uker / 280 dager; vis at svangerskapsalder fastsettes av helsepersonell. Bruk lokale kalenderdager (Europe/Oslo) fremfor å subtrahere tilfeldige millisekunder rundt sommertid. Hvis termindato er historisk eller input er urimelig, be brukeren korrigere eller bytte til «barnet er født»; ikke anta fødselsdato. Ikke vis automatisk termin-baserte helsevarsler.

---

## 6. Datastruktur og kvalitetsmodell

Data skal være strukturert, ikke hardkodet i JSX. Definer TypeScript-typer, datavalidering og separate demofiler.

### 6.1 Place

```ts
type TriState = 'yes' | 'no' | 'unknown';
type PlaceCategory = 'cafe' | 'walking_route' | 'outdoor_area' | 'activity';
type DataKind = 'real_place_identity' | 'fictional_demo';
type EvidenceStatus = 'venue_confirmed' | 'public_source' | 'user_report' | 'unverified' | 'not_applicable';

type FacilityName =
  | 'stroller_space' | 'changing_table' | 'changing_access_all_caregivers'
  | 'step_free_access' | 'feeding_space' | 'toilet'
  | 'stroller_suitable_route' | 'even_surface' | 'low_slope'
  | 'benches' | 'public_transport';

interface FacilityClaim {
  value: TriState;
  evidenceStatus: EvidenceStatus;
  evidenceUrl?: string;
  checkedAt?: string; // ISO dato, bare hvis faktisk kontrollert
  note?: string;
}
interface Place {
  id: string;
  name: string;
  category: PlaceCategory;
  dataKind: DataKind;
  coordinates: { lat: number; lng: number } | null;
  addressOrArea: string;
  shortDescription: string;
  identitySourceUrl?: string; // for reell stedsidentitet
  identityCheckedAt?: string;
  facilities: Partial<Record<FacilityName, FacilityClaim>>;
  tags: string[];
  imageUrl?: string; // bare egnete bilder med bruksrett
  routeInfo?: { lengthKm?: number; surfaceText?: string; slopeText?: string; routeVerified: boolean };
  activityInfo?: { dateLabel?: string; priceLabel?: string; registrationLabel?: string; isDemo: boolean };
}
```

**Kritisk skille:** At **Baneheia eksisterer**, betyr ikke at *enhver sti i Baneheia* er egnet for barnevogn. At **Fiskebrygga eksisterer**, betyr ikke at en vilkårlig kafé har stelleplass. Verifisering av navn, beliggenhet og fasiliteter er separate påstander.

### 6.2 Profil, milepæler og sjekklister

```ts
interface DemoProfile {
  stage: 'expecting' | 'baby_born' | 'prefer_not_to_say';
  dueDate?: string;
  enteredPregnancyWeek?: number;
  enteredWeekAnchorDate?: string;
  childBirthDate?: string;
  contentPreference: 'dad' | 'pregnant_parent' | 'both' | 'general';
  notificationPreference: 'off' | 'preview_only';
}
interface Milestone {
  id: string;
  stage: 'pregnancy' | 'postpartum';
  minWeekOrMonth: number;
  title: string;
  body: string;
  dadTip?: string;
  checklistIds: string[];
  source?: string;
  medicalClaim: boolean; // skal være false uten faglig kontroll
}
interface ChecklistItem {
  id: string;
  listId: string;
  label: string;
  category: 'must_have' | 'nice_to_have' | 'can_wait' | 'practical';
  optionalAssignee?: 'me' | 'co_parent';
}
interface DemoState {
  schemaVersion: number;
  profile: DemoProfile | null;
  favoritePlaceIds: string[];
  checkedItemIds: string[];
  notificationPreviewSeenIds: string[];
}
```

**Lagring:** localStorage er tillatt for **kun syntetiske/demorelaterte** data, med tydelig datarens/tilbakestilling. Ingen faktiske svangerskapsdatoer for testpersoner i offentlig demonstrasjon. Brukes ekte personopplysninger i videre prosjekt, kreves egen personvern-/sikkerhetsvurdering, egnet lagring og samtykke der relevant.

### 6.3 Stedsdatasett for Kristiansand

**Virkelige stedsidentiteter som kan være aktuelle kandidater:** Bystranda, Fiskebrygga, Baneheia, Odderøya og Strandpromenaden. Disse er omtalt i kilder fra Kristiansand kommune og Visit Norway. De skal *ikke* gis fasilitetstatus «ja» uten separat dokumentasjon. Koordinater må hentes og kontrolleres mot egnet kartkilde før de legges på kartet; dersom de ikke er klare, kan stedsidentiteten foreløpig vises i en liste med «posisjon ikke bekreftet».

**Fiktive demosteder:** Opprett 6–10 tydelig fiktive oppføringer i Kristiansand-området, for eksempel `Demokafé Solgløtt (fiktivt)` og `Demotur Ved Elva (fiktiv)`, med testkoordinater, testfasiliteter og variasjon i `yes/no/unknown`. Vis et vedvarende «Demo»-merke og forklar at de ikke er reelle tilbud. Ingen faktiske virksomheter skal tillegges syntetiske fasilitetspåstander.

**Kildereferanser for virkelige stedsidentiteter:**
- Kristiansand kommune, Friluftsliv: https://www.kristiansand.kommune.no/navigasjon/bolig-kart-og-eiendom/parkvesenet/friluftsliv/
- Kristiansand kommune, Kystvandringer: https://www.kristiansand.kommune.no/navigasjon/bolig-kart-og-eiendom/parkvesenet/friluftsliv/kystvandring/
- Visit Norway, planlegg reisen til Kristiansand: https://www.visitnorway.no/reisemal/sorlandet/kristiansand/planlegg-reisen/

Kildehenvisningene bekrefter kun sted/område eller generell omtale, **ikke** alle fasiliteter, eksakt rute eller datakorrekthet på besøksdagen.

---

## 7. Visuell design og opplevelse

Studentbriefens uttrykk er lyst og nøkternt, og teksten ber om positiv, nyttig og lettnavigert opplevelse. Det finnes **ingen dokumentert offisiell designmanual i de vedlagte kildene**. Bruk derfor nedenstående som *forslag*, ikke som fastlagt bedriftspalett.

### 7.1 Design tokens (forslag)

| Token | Farge | Bruk |
|---|---|---|
| `--canvas` | `#FAF7F2` | bakgrunn/kremhvit |
| `--surface` | `#FFFFFF` | kort |
| `--sage` | `#DCE9DF` | rolig sekundærflate |
| `--peach` | `#EBCFC8` | varme illustrasjonsdetaljer |
| `--teal` | `#A8C9C3` | kart- og UI-detaljer |
| `--ink` | `#343C39` | primærtekst |
| `--accent` | `#286F65` | mørkere interaktiv aksent med kontrast |
| `--danger` | `#A33636` | feilmelding |

Farger må evalueres mot WCAG-kontrast. Myke pasteller er **ikke** automatisk egnet som farge for knappetekst. Riktig kontrast går foran paletttroskap.

### 7.2 Komponentprinsipper

- Varm og voksen skandinavisk stil; unngå overdreven rosa/blå, babyaktig clipart og visuell støy.
- Store trykkflater, avrundede kort, tydelige aktive filtre, tilgjengelige ikoner med tekst.
- Mobil først: kart og liste kan veksles med én synlig kontroll; stedsdetaljer som mobil bunnflate/sheet eller sidepanel desktop.
- Minst like god funksjon i listevisningen som på kartet.
- Tydelig status for «Verifisert», «Brukerrapportert», «Ukjent» og «Demodata».
- Ikke bruk tredjepartsbilder eller logo uten nødvendige bruksrettigheter. Tillatte plasserholdere og enkle illustrasjoner er nok.

---

## 8. Arkitektur og utviklingsprosess

### 8.1 Foreslått stack

- React + TypeScript + Vite.
- React Router til navigasjon.
- Leaflet + React Leaflet til kart (med kildeangivelse og tjenestevilkår).
- CSS variables og vanlige CSS-moduler/stylesheet for kontrollert, enkel visuell stil; unngå unødvendige avhengigheter.
- Ikonbibliotek med tilgjengelige labels.
- Vitest + React Testing Library for enhet-/komponenttester; Playwright eller tilsvarende for kritiske brukerflyter hvis miljøet tillater det.
- Ingen database/server i MVP. Separate seeddata, service-lag og lagringsadapter slik at backend kan komme senere.

### 8.2 Kartfliser og datakilder

Om offentlige OSM-fliser brukes: vis `© OpenStreetMap contributors`, bruk korrekt HTTPS-URL, respekter caching og gitte bruksbegrensninger, ikke bulk-last ned eller bygg offlinekart, og la det være enkelt å bytte tile-provider senere. Produksjonsbruk krever egen vurdering av kartleverandør, kapasitet, vilkår og personvern. Se https://operations.osmfoundation.org/policies/tiles/.

Ikke bruk offentlig geokoding ved hvert tastetrykk. Bruk forhåndsvaliderte koordinater for demooppføringer og dokumentert prosedyre for å legge til verifiserte ekte steder. GPS bare etter brukerhandling og samtykke; må ikke kreves.

### 8.3 Dokumentstruktur

```text
little-babylove/
  README.md
  AGENTS.md                 # felles korte agentregler (om miljøet støtter)
  CLAUDE.md                 # Claude Code, peker til masterspesifikasjon
  .github/copilot-instructions.md
  docs/
    MASTERSPESIFIKASJON.md
    context.md
    decisions.md
    test-scenarios.md
    verification.md
    data-provenance.md
  specs/
    001-kart-og-filter/spec.md
    002-profil-og-tidslinje/spec.md
    003-sjekklister-og-varsler/spec.md
  src/
    app/
    components/
    features/map/
    features/places/
    features/journey/
    features/checklists/
    features/guides/
    data/
    domain/
    services/
    styles/
  tests/
```

### 8.4 Gjennomføringsrekkefølge

**Fase 0 – Context:** les kildene og masterspesifikasjonen; opprett sporbar prosjektstruktur og beslutningslogg.  
**Fase 1 – Spec & Plan:** beskriv BR-A/BR-B, datakontrakter, kritiske risikomomenter og små implementeringsoppgaver.  
**Fase 2 – Vertical slice kart:** ruter/Hjem/Utforsk, kart/liste, demo-steder, filtre, stedskort, favoritter, første tester.  
**Fase 3 – Vertical slice Min baby:** frivillig demoprofil, termin/uke, milepæler, pappa-tips, sjekkliste og varslingsforhåndsvisning, tester.
**Fase 4 – Polering:** responstilpasning, tastaturnavigasjon, kildemerking, tomtilstander, test og evaluering.  
**Fase 5 – Brukertest:** observer brukere, dokumenter funn, korriger én ting om gangen.

Det store start-promptet skal **ikke** omgå denne faseringen ved å generere en enorm og utestet app i ett steg.

---

## 9. Ikke-funksjonelle krav

- **Tilgjengelighet:** sikte mot WCAG 2.2 AA; full tastaturnavigasjon til primære funksjoner; synlige fokusmarkører; kontrast og tekststørrelse; tekstlig alternativ til kartet.
- **Responsivitet:** test 360 px, 390 px, 768 px og 1440 px bredde. Ingen horisontal scroll i normale visninger.
- **Ytelse:** rask første visning; unngå tunge bilde- og kartavhengigheter ved inngang der kart ikke trengs; vis lastetilstand.
- **Personvern:** samler ikke inn ekte navn, e-post, lokasjon eller svangerskapsdetaljer i demo; ikke send dem til tredjepart.
- **Sikkerhet:** ingen API-nøkler eller hemmeligheter i repo; ingen egenutviklet login som later som den er produksjonssikker.
- **Kildedisiplin:** dokumentert stedsidentitet ≠ bekreftede fasiliteter. Ukjent og ubekreftet synliggjøres.
- **Feilhåndtering:** kart som ikke lastes skal gi forståelig feilmelding og listevisning; tomme søk er støttet.
- **Etikk/kommersielt:** ingen skjult sponsing, ubegrunnede medisinske påstander eller påstander om at fiktive steder finnes.
- **Konfidensialitet:** privat repo med syntetiske data til eksplisitt annen beslutning.

---

## 10. Akseptansetester og måling

| Test-ID | Scenario | Forventet resultat |
|---|---|---|
| A01 | Åpne Utforsk uten profil | Kart/liste kan brukes uten registrering |
| A02 | Filtrer på stellerom + barnevognplass | Bare oppføringer med eksplisitt `yes` på begge vises; `unknown` ekskluderes |
| A03 | Bytt kart/liste | Resultater, sortering og valgte filtre beholdes |
| A04 | Null treff | Tomtilstand og «Nullstill filtre» vises og fungerer |
| A05 | Åpne real-place-oppføring uten fasilitetbevis | Fasiliteter vises «ukjent», aldri «bekreftet» |
| A06 | Åpne fiktiv oppføring | Tydelig «Fiktivt demosted» i kartrelatert UI og på detaljside |
| A07 | Lagre favoritt og oppdater siden | Favoritten er beholdt i samme demo-nettleser |
| A08 | Kartfliser feiler | Listevisningen og forklarende feilmelding kan brukes |
| B01 | Registrer termindato | Omtrentlig uke vises, beregning konsistent med lokalt datogrunnlag |
| B02 | Registrer uke i stedet for dato | Appen fungerer uten termindato |
| B03 | Endre uke/dato | Relevant milepæl og pappatips oppdateres |
| B04 | Kryss av oppgave og oppdater siden | Avkrysningen er beholdt |
| B05 | Se påminnelse | Merket «Forhåndsvisning – sendes ikke» |
| B06 | Slett demoprofil | Data fjernes; bruker returnerer til nøytral tilstand |
| UX01 | Tastaturstyring | Alle primærfunksjoner kan brukes uten mus; liste-alternativ til kart |
| UX02 | Mobilvisning | Ingen skjulte kritiske knapper eller horisontal scroll |
| SRC01 | Stedsinformasjon | Status, identitetskilde og dato vises der de finnes; ukjent ikke kamuflert |
| SRC02 | Ekstern kartlenke | Ingen villedende påstand om barnevognsikker rute |

**Foreslåtte kvalitative målepunkter (ikke dokumenterte mål):** Kan testpersonene fullføre BR-A og BR-B uten hjelp? Forstår de hva som er bekreftet? Finner de filtrene? Oppleves løsningen som rask og trygg? Målingen dokumenteres, ikke konstrueres.

---

## 11. Utenfor første prototype

Produksjonsinnlogging, reelle automatiske e-poster/pushvarsler, sanntidsbooking, betaling, partneradministrasjon, prissammenligning, avansert familieøkonomi, AI-assistent, offentlig brukerforum, automatisk ruteplanlegging med garanti for barnevognframkommelighet, ubegrenset nasjonal geografidekning og klinisk/medisinsk veiledning.

Det er tillatt å vise **lav-fidelitetsskisser eller ikke-interaktive informasjonskort** om framtidige funksjoner, dersom de merkes som fremtidige og ikke forveksles med ferdig funksjonalitet.

---

## 12. Risikoer og uløste beslutninger

| Punkt | Status / anbefaling |
|---|---|
| Oppdragsgivers godkjenning av kart-først kontra utstyr-først | **ÅPEN BESLUTNING** – legg fram prototypen og få tilbakemelding |
| Faktiske stedsfasiliteter | **UKJENT** inntil verifisert, også for populære steder |
| Merkevarefarger/logo | **IKKE LEVERT** – foreslått palett, erstattes ved godkjenning |
| Reelle koordinater | Valideres per oppføring før visning som virkelig kartpunkt |
| Hvem vedlikeholder stedsdata etter semesteret | **ÅPENT** – bør avgjøres av produkteier |
| Eventuelle partneravtaler/sponsing | Utenfor MVP; må merkes separat i videreføring |
| Ekte termin- og kontodata | Ikke i studentdemo; krever særskilt vurdering |
| Hvem ser brukertestdata og hvor lagres de | Avklares før ekte tester, bruk anonymiserte notater |
| Teknologi-/lisensvalg ved lansering | Revurderes før produksjon, særlig kartfliser og geokoding |

---

## 13. Leveranser til IS-219

Prototypen bør kunne supplere emnets figur- og refleksjonskrav:

1. **Kundereise-narrativ** for Ingrid og Jonas.
2. **Service blueprint** med frontstage, backstage, data og usikkerhet for hver hovedreise.
3. **IX/sitemap** og brukerflyt med alternative veier.
4. **Valg- og kravlogg** med sporbarhet fra intervjuinnsikt til funksjon.
5. **Akseptansetestresultater** og kjente begrensninger.
6. **Brukertestnotat**: hva fungerte, hvor oppstod friksjon, hva endres.
7. **Kort redegjørelse for KI-bruk** og menneskelig kontroll av resultatet.

Ved sluttdemo skal en observatør kunne gjennomføre BR-A og BR-B på en telefonstor skjerm, og det skal være åpenbart hvilke deler som er eksempler versus faktisk dokumentert informasjon.

---

## 14. Åpne spørsmål – bare de som faktisk kan endre løsningen

1. Bekrefter oppdragsgiver prioriteringen av kart foran utstyrs-/budsjettmodulen?
2. Skal den visuelle profilen bygge på en bestemt eksisterende logo/merkevaremanual?
3. Hvem kan verifisere fasiliteter hos ekte steder i Kristiansand?
4. Hvilke 2–3 målgruppedeltakere kan teste de to brukerreisene?
5. Hvor/med hvem kan det private repoet og prototypen deles?

**Anbefalt standard inntil avklart:** Fortsett med privat, fiktiv demo og foreslått stil, og registrer usikkerheten eksplisitt i `docs/decisions.md`.
