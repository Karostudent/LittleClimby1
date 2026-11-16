# Enklere Babyliv

Enklere Babyliv er en mobiltilpasset studentprototype for IS-219 ved Universitetet i Agder. Appen skal gjøre det enklere for kommende og nybakte foreldre å finne steder, aktiviteter og praktiske råd i Kristiansand.

Dette er en privat demo med syntetiske data – ikke en offentlig tjeneste eller helseapp.

## Kom i gang

Forutsetter Node.js 20 eller nyere.

```bash
npm install
npm run dev
```

Bygg og test:

```bash
npm run build
npm test
```

## Funksjonalitet

### Utforsk

- Interaktivt Leaflet-kart og tekstlig listevisning.
- Søk på navn, område og tagger.
- Kategorier for kaféer/møteplasser, turer/uteområder og aktiviteter.
- Filtre for blant annet stellerom, barnevognplass, trappefri adkomst og stelleplass for alle omsorgspersoner.
- `Ja`, `Nei` og `Ukjent` vises separat. `Ukjent` teller aldri som et positivt filtertreff.
- Favoritter lagres lokalt i nettleseren.
- Fiktive steder er merket som «Fiktivt demosted».

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

### Guider og Pappasporet

- Praktiske, ikke-stereotype råd for pappa, medforelder og andre omsorgspersoner.
- Enkel aktivitetsoversikt med tydelig demomarkering.
- Tillitsmarkeringer for bekreftet informasjon, ukjent status og demodata.
- Partnere har en egen, valgfri tilbudsside for kurs, babysvømming og arrangementer. Hovedmodellen er provisjon ved booking, mens sponset plassering er et tydelig merket tillegg.
- En partnerside viser hvordan en kafé, arrangør eller kursleverandør kan sende inn et tilbud til vurdering.
- En konseptskisse viser mulig premiumtilgang til Little BabyBot og deling med partner. Little BabyBot skal aldri gi helseråd, men henvise til lege eller helsestasjon.

### Navigasjon og mobil

- Mobilbunnmenyen viser Hjem, Utforsk, Planlegg tur, Min baby, Guider, Partnere og Profil.
- Aktivt valg markeres med et mintfarget ikonfelt inspirert av Emma-branchen.
- Navigasjonssymbolene er SVG-symboler: hus, kart, rute, hjerte, informasjon, stjerne og bruker.
- Desktop beholder samme sju hovedinnganger i toppmenyen.

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

Kjør:

```bash
npm test
npm run build
```

Siste verifisering: 23 tester bestått og production build bestått. Manuelle Ingrid- og Jonas-skript finnes i [docs/test-scenarios.md](docs/test-scenarios.md). Kravstatus finnes i [docs/requirements-status.md](docs/requirements-status.md), og testnotater kan føres i [docs/user-test-notes.md](docs/user-test-notes.md).

En produksjonsversjon trenger egen databehandling, personvern- og sikkerhetsvurdering, kartleverandøravtale, verifisering av fasiliteter, universell utforming og løpende kvalitetssikring.
