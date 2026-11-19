# Enklere Babyliv

Enklere Babyliv er en mobiltilpasset studentprototype for IS-219 ved Universitetet i Agder. Appen skal gjøre det enklere for kommende og nybakte foreldre å finne steder, aktiviteter og praktiske råd i Kristiansand.

Dette er en privat demo med syntetiske data – ikke en offentlig tjeneste eller helseapp.

## Kom i gang

Forutsetter Node.js 20 eller nyere og npm.

Installer låste avhengigheter fra prosjektroten:

```bash
npm ci
```

Start utviklingsserveren:

```bash
npm run dev
```

Åpne URL-en som Vite viser i terminalen, vanligvis `http://localhost:5173`.
Stopp serveren med `Ctrl+C`.

### Test og produksjonsbuild

Kjør testene:

```bash
npm test
```

Lag en produksjonsbuild:

```bash
npm run build
```

`npm run build` kjører TypeScript-sjekk før Vite lager produksjonsfilene i `dist/`.
Mappen `dist/` og `node_modules/` er genererte filer og skal ikke legges til i Git.

## Funksjonalitet

### Utforsk

- Interaktivt Leaflet-kart og tekstlig listevisning.
- Søk på navn, område og tagger.
- Kategorier for kaféer/møteplasser, turer/uteområder og aktiviteter.
- Filtre for blant annet stellerom, barnevognplass, trappefri adkomst og stelleplass for alle omsorgspersoner.
- Søk og de viktigste praktiske filtrene vises først; øvrige filtre ligger under «Flere filtre».
- «Kun favoritter» gjør det mulig å finne igjen lagrede steder direkte i Utforsk.
- `Ja`, `Nei` og `Ukjent` vises separat. `Ukjent` teller aldri som et positivt filtertreff.
- Favoritter lagres lokalt i nettleseren.
- Fiktive steder er merket som «Fiktivt demosted».
- Kartet inneholder reelle steder i Kristiansand, blant annet Ravnedalen, Baneheia, Otterdalsparken, Aquarama, Leo’s Lekeland, Hamresanden og Kristiansand Dyrepark. Peisestuen er registrert som parkområde inntil lekeplassstatus kan bekreftes.
- Kartutsnittet tilpasses synlige søkeresultater og zoomer inn på ett enkelt treff. Standardvisningen viser alle registrerte steder i området.
- Steder kan legges direkte til «Min tur», som viser valgte stopp, dato og notat.
- Min tur viser «Åpne veibeskrivelse i Google Maps» tydelig når alle stopp har reell posisjon. Fiktive demosteder hindrer derfor ikke bare reelle stopp; forklaringen sier hvorfor lenken er utilgjengelig.
- Hjelpeteksten anbefaler Bystranda og Fiskebrygga som en enkel kontroll av enkel og kombinert veibeskrivelse.
- Hurtigfilterlenker fra Hjem oppdaterer det aktive filteret også når Utforsk allerede er åpnet.
- Stedsdetaljer åpnes som en tilgjengelig dialog med intern scrolling på korte skjermer og alltid synlig «Lukk»-handling.
- «Mer»-menyen kan lukkes med Escape eller klikk utenfor.

### Min baby og Profil

- Frivillig demo-profil uten innlogging eller e-post.
- Termin eller svangerskapsuke som alternative innganger.
- Omtrentlig, deterministisk ukevisning basert på lokale kalenderdager.
- Milepæler med separate, generelle råd til mor/den gravide og far/medforelder.
- Milepælinnholdet endres med valgt alder: månedstilpasset innhold for babyer under ett år og lek-, rutine- og selvstendighetsfokus for større barn.
- Valg av barnets alder fra 0–6 år, eller fødselsdato som dynamisk alderskilde.
- Babyer under ett år får alder vist i hele måneder; fra ett år vises hele år.
- Kort, generell beskrivelse av valgt aldersgruppe i «Din status», med tydelig forbehold om individuelle forskjeller.
- Alderstilpassede fiktive aktiviteter og sjekkpunkter.
- To lokale sjekklister med avkryssing.
- Varslingsforhåndsvisning merket «Ikke sendt – prototype».
- «Slett mine demodata» fjerner profil, sjekklister, favoritter, turplan, turvalg og tilbakemeldinger.
- Fødselsdato og omtrentlig alder er eksklusive alternativer, slik at bare én alderskilde kan lagres samtidig.

### Guider og Pappasporet

- Praktiske, ikke-stereotype råd for pappa, medforelder og andre omsorgspersoner.
- Enkel aktivitetsoversikt med tydelig demomarkering.
- Tillitsmarkeringer for bekreftet informasjon, ukjent status og demodata.
- Partnere har en egen, valgfri tilbudsside for kurs, babysvømming og arrangementer. Hovedmodellen er provisjon ved booking, mens sponset plassering er et tydelig merket tillegg.
- En partnerside viser hvordan en kafé, arrangør eller kursleverandør kan sende inn et tilbud til vurdering.
- Little BabyBot ligger som en egen konseptside under «Mer». Den viser tre forhåndsdefinerte samtaler og fremtidige muligheter, men har deaktivert meldingsfelt og ingen AI-, API- eller lagringsfunksjonalitet.

### Navigasjon og mobil

- Mobil- og desktopnavigasjonen viser Hjem, Utforsk, Min tur, Min baby og Mer.
- «Mer» samler Guider, Little BabyBot, Partnertilbud og Profil og innstillinger.
- Partnerportalen er tilgjengelig fra Partnertilbud, men ligger ikke i hovednavigasjonen.
- Aktivt valg markeres med et mintfarget ikonfelt inspirert av Emma-branchen.
- Navigasjonssymbolene er SVG-symboler: hus, kart, rute, hjerte og informasjon.

### Hjem

- Hjem viser én hovedhandling: «Finn barnevennlige steder».
- «Min baby» er sekundærhandlingen.
- «Min tur» vises som en kompakt snarvei med planstatus.
- Hjem forklarer tjenesten med én kort tekst i stedet for flere introduksjonskort.

### Demo av mulig inntektsmodell

Partnertilbudene er kun visuelle smakbiter for oppdragsgiver. De skal ikke tolkes som ekte samarbeid, anbefalinger eller bookbare tilbud. En produksjonsløsning bør holde partnerinnhold tydelig adskilt fra steddata, guider og generelle råd, og alltid merke sponsede plasseringer med «Annonse» eller «Sponset».

Den visuelle profilen bruker marineblå/petrol, skifer og dempede sandtoner for et mer nøytralt og robust uttrykk. Status kommuniseres også med tekst, ikke bare farge.

Seed-data kan utvides i [src/data/places.ts](src/data/places.ts). Nye reelle steder må ha separat kilde- og kontrollstatus. Domenetyper og filterregler ligger i [src/domain/places.ts](src/domain/places.ts), mens reise- og alderslogikk ligger i [src/domain/journey.ts](src/domain/journey.ts).

## Data og begrensninger

- Fiktive oppføringer er kun laget for demonstrasjon og skal ikke tolkes som faktiske tilbud.
- Reelle stedsidentiteter bekrefter ikke automatisk fasiliteter, ruter eller dagsaktuell tilgjengelighet.
- Varsler, e-post, push, booking, betaling og innlogging er ikke implementert.
- Kartlenker er eksterne; appen beregner ikke en trygg eller barnevognspesifikk rute.
- Ingen medisinske vurderinger eller kliniske råd gis.
- Demo-tilstand lagres kun lokalt og skal ikke fylles med ekte personopplysninger.

Se [docs/data-provenance.md](docs/data-provenance.md) for kilder og status for reelle stedsidentiteter.

## Verifisering og brukertest

For en full lokal kontroll, kjør:

```bash
npm ci
npm test
npm run build
git diff --check
```

Siste verifisering 2026-11-18: 34 tester bestått i 4 testfiler, production build bestått og `git diff --check` bestått. Vitest er oppdatert til `4.1.12`. Manuelle Ingrid- og Jonas-skript finnes i [docs/test-scenarios.md](docs/test-scenarios.md). Kravstatus finnes i [docs/requirements-status.md](docs/requirements-status.md), og testnotater kan føres i [docs/user-test-notes.md](docs/user-test-notes.md).

Sikkerhetsstatus for utviklingsavhengigheter og resterende audit-funn er dokumentert i [docs/verification.md](docs/verification.md). Kjør `npm audit` ved behov; ikke bruk `npm audit fix --force` uten å vurdere kompatibilitet først.

En produksjonsversjon trenger egen databehandling, personvern- og sikkerhetsvurdering, kartleverandøravtale, verifisering av fasiliteter, universell utforming og løpende kvalitetssikring.
