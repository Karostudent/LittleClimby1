# Verifisering

## Fase 0

- Masterspesifikasjonen lest i sin helhet: verifisert 2026-11-04.
- Repository undersøkt: kun `README.md`, `LICENSE`, `gitignore` og masterspesifikasjon fantes før implementasjon.

## Fase 1

- `npm install`: fullført 2026-11-04. npm rapporterte 8 transitive audit-funn; ingen automatisk tvangsoppgradering er gjort.
- `npm test`: bestått 2026-11-04, 1 testfil og 2 tester.
- `npm run build`: bestått 2026-11-04 med Vite-produksjonsbygg.
- Fase 2 kjernetester: 7 tester bestått i 3 testfiler. Dekker lokal kalenderberegning fra termin, alternativ ukeinngang, milepæl-/pappatipsendring, sjekkliste-lagring og defensiv sletting/lasting.
- Ikke verifisert ennå: nettleserflyt på mobilbredder, faktisk kartflis-tilgjengelighet, tastaturgjennomgang og Playwright-røykflyt.

## Fase 3

- `npm test`: bestått 2026-11-04, 3 testfiler og 8 tester.
- `npm run build`: bestått 2026-11-04 med Vite-produksjonsbygg.
- Implementert: Pappasporet, generell guide, fiktiv aktivitetsoversikt, tillitslegend på Utforsk, synlig tastaturfokus og responsive guide-/reiseflater.
- Ikke verifisert ennå: manuell skjermlesergjennomgang, reell mobilnettleser og kartleverandørens runtime-tilgjengelighet.

## Fase 4

- Ingrid- og Jonas-skript er dokumentert i [test-scenarios.md](./test-scenarios.md).
- Testnotatskjema er dokumentert i [user-test-notes.md](./user-test-notes.md).
- Kravstatus med skille mellom verifisert, implementert, simulert og utenfor MVP er dokumentert i [requirements-status.md](./requirements-status.md).
- Ingen nye runtime-funksjoner ble lagt til i fase 4.

## Alders- og rådsutvidelse

- `npm test`: bestått 2026-11-04, 4 testfiler og 11 tester.
- `npm run build`: bestått 2026-11-04 med Vite-produksjonsbygg.
- Implementert: valgfri alder 0–5 år på profilsiden, aldersfiltrerte fiktive aktiviteter og separate råd til mor/den gravide og far/medforelder.
- Utvidet: sjekklistene filtreres etter samme aldersintervall som aktivitetene, med egne forslag for spedbarn og småbarn.
- `npm test`: bestått 2026-11-04, 4 testfiler og 12 tester.
- Ikke verifisert ennå: manuell kontroll av profilendring i nettleser og visuell kontroll på mobilbredder.
- Utvidet: «Din status» viser en kort, generell aldersbeskrivelse når barnets alder er valgt, med eksplisitt forbehold om individuelle forskjeller.
- `npm test`: bestått 2026-11-04, 4 testfiler og 13 tester.
- Utvidet: «Den første tiden hjemme» byttes til større-barn-råd når valgt alder er over ett år. Rådene gjelder lek, bevegelse, rutiner, små oppgaver og pauser, og er generelle designhypoteser – ikke medisinsk veiledning.
- `npm test`: bestått 2026-11-04, 4 testfiler og 14 tester.

## Siste design- og aldersoppdatering

- Implementert: aldersvalg til og med 6 år, fødselsdato som dynamisk alderskilde og månedstilpasset visning for babyer under ett år.
- Implementert: mobilbunnmeny med safe-area-støtte, Emma-inspirert aktivt ikonfelt og matchende SVG-symboler.
- `npm test`: bestått 2026-11-16, 4 testfiler og 23 tester.
- `npm run build`: bestått 2026-11-16 med Vite-produksjonsbygg.
- `git diff --check`: bestått 2026-11-16.
- Ikke verifisert ennå: visuell kontroll i mobilnettleser og skjermlesergjennomgang.

## UX- og informasjonsarkitektur

- Implementert 2026-11-17: fem hovedvalg på mobil og desktop: Hjem, Utforsk, Min tur, Min baby og Mer.
- Implementert 2026-11-17: Guider, Partnertilbud og Profil/innstillinger samlet under Mer; partnerportalen er fortsatt tilgjengelig fra Partnertilbud.
- Implementert 2026-11-17: Hjem forkortet til én hovedhandling, én sekundærhandling, kompakt Min tur-status og én kort forklaring.
- Eksisterende ruter er beholdt: `/utforsk`, `/planlegg`, `/reise`, `/guider`, `/partnere`, `/partnerportal` og `/profil`.
- Implementert 2026-11-17: Utforsk → Min tur-flyten har tydeligere søk, primærfiltre, «Flere filtre», «Kun favoritter», progressive stedskort og eksplisitt lagret/ikke-lagret-status.
- `npm test`: bestått 2026-11-17, 4 testfiler og 23 tester.
- `npm run build`: bestått 2026-11-17 med Vite-produksjonsbygg.
- `git diff --check`: bestått 2026-11-17.

## Min baby, Guider og Profil

- Implementert: Min baby er samlet som personlig oversikt med fase/alder, mest relevant milepæl, aldersfiltrerte sjekklister og tydelig inngang til å endre opplysninger.
- Implementert: sekundære aktivitets-, barnehage/skolestart- og varslingsseksjoner er sammenleggbare, slik at hovedoppgaven ikke drukner i innhold.
- Implementert: Guider inneholder generell veiledning og Pappasporet, mens lokale aktiviteter og steder henvises til Utforsk.
- Implementert: Profil håndterer redigering av eksisterende opplysninger og separat, bekreftet sletting av all lokal demodata.
- Verifisert: `npm test -- --run` bestått, 4 testfiler og 23 tester.
- Verifisert: `npm run build` bestått med Vite-produksjonsbygg.
- Verifisert: `git diff --check` bestått.

## Navigasjonsretting

- Rettet: Mer-menyen er nå en egen komponent for desktop- og mobilnavigasjonen, slik at klikk-state ikke deles med en skjult navigasjonsvariant.
- Rettet: Mobilbunnmenyen klipper ikke lenger Mer-panelet når det åpnes oppover.
- Verifisert etter rettingen: `npm test -- --run` bestått med 23 tester.
- Verifisert etter rettingen: `npm run build` bestått.
- Verifisert etter rettingen: `git diff --check` bestått.

## Kritisk UX-gjennomgang før første brukertest

- Forenklet: Detaljvisning av sted har nå direkte handling for å legge stedet til i Min tur.
- Forenklet: Min baby har én tydelig «Endre opplysninger»-handling i hovedoversikten.
- Forenklet: Profilskjemaet forklarer hvorfor lagring er deaktivert før nødvendig termin- eller ukeinformasjon er valgt.
- Tydeliggjort: Stedlisten er visuelt skilt fra kartet med overskriften «Steder i området».
- Kontrollert: Ingrid-flyten fra Utforsk til valgt sted, Min tur og lagret plan fungerer i eksisterende komponenter.
- Kontrollert: Jonas-flyten fra Min baby til lokal profil, alders-/faseinnhold og sjekklister er bevart.
- Begrensning: Brukervennlighet er ikke verifisert gjennom faktiske testpersoner; dette skal undersøkes i den planlagte brukertesten.

## Stelleplass for alle omsorgspersoner

- Implementert: «Stelleplass for alle omsorgspersoner» er tilbake som et synlig hovedfilter i Utforsk.
- Implementert: Statusen vises også i stedskort sammen med de andre prioriterte fasilitetene.
- Bevart: Filtreringen krever eksplisitt `Ja`; `Ukjent` behandles ikke som et positivt treff.

## Endre Min tur

- Implementert: Min tur har en tydelig «Endre stopp»-knapp tilbake til Utforsk.
- Bevart: valgte stopp, dato og notat kan redigeres uten å starte planen på nytt.
- Bevart: endringer må lagres eksplisitt, og ulagrede endringer vises tydelig.

## Kartkilder og lokal stedsrapportering

- Implementert: Emma-referansens koordinater for Bystranda (`58.14639, 8.007667`) og Fiskebrygga (`58.14083, 7.99583`) er overført med eksisterende Karoline-ID-er.
- Implementert: koordinatkilde og kontrolldato vises separat fra stedsidentitet og fasilitetsstatus.
- Implementert: kartmarkører skiller reelle steder fra fiktive demosteder med farge og tekstforklaring.
- Implementert: «Om informasjonen» viser kildebevisst status uten å fremstille ukjente fasiliteter som bekreftet.
- Implementert: «Meld fra eller bekreft informasjon» lagrer tilbakemeldinger lokalt i `little-babylove:place-reports:v1`; ingen server eller innlogging er lagt til.
- Verifisert: `npm test -- --run` bestått 2026-11-17, 4 testfiler og 25 tester.
- Verifisert: `npm run build` bestått 2026-11-17 med Vite-produksjonsbygg.
- Verifisert: `git diff --check` bestått 2026-11-17.

## Måltrettet UX- og kvalitetssikring

- Rettet: Stedsdialogen bruker tilgjengelig viewport-høyde, intern vertikal scrolling og en alltid tilgjengelig «Lukk»-handling.
- Rettet: Hurtigfilterlenker oppdaterer nå filtertilstanden når URL-parameteren `filter` endres mens Utforsk er montert.
- Rettet: Profilskjemaet lar fødselsdato og omtrentlig alder være eksklusive innganger.
- Rettet: Min tur skiller tydelig mellom lagret plan og ulagrede stoppvalg, og har handlinger for å fjerne alle stopp eller starte en ny tur.
- Rettet: Mer-menyen har begrenset mobilhøyde, lukker ved Escape og klikk utenfor, og flytter/restorerer tastaturfokus.
- Rettet: Stedsdialogen låser bakgrunnens utilsiktede tastaturnavigasjon, håndterer Escape og rullepanelets tastaturfokus.
- Nettleserkontroll: Hjem, Utforsk, kart/liste, stedsdetaljer, Mer-meny, Min tur og profilredigering kontrollert ved 320, 375, 390, 430, 600, 768, 899, 900, 1024, 1280 og 1920 px bredde.
- Nettleserkontroll: Kontrollerte høyder var 320, 568, 667, 768 og 900 px, inkludert korte og liggende mobilflater.
- Verifisert: Hurtigfiltere for stellerom, barnevognplass og gratis aktiviteter oppdaterer riktig.
- Verifisert: Stedsdialogen scrolles internt på 320 x 320 px, og Escape lukker den.
- Verifisert: `npm test` bestått 2026-11-17, 4 testfiler og 26 tester.
- Verifisert: `npm run build` bestått 2026-11-17 med Vite-produksjonsbygg.
- Verifisert: `git diff --check` bestått 2026-11-17.
- Gjenstår: Faktisk brukertest med reelle testpersoner og manuell skjermleser-/hjelpemiddelsjekk.

## Little BabyBot-konseptdemo

- Implementert 2026-11-17: `/little-babybot` er lagt til som egen side under «Mer», uten endring i hovednavigasjonens fem valg.
- Implementert: Tre valgbare forhåndsdefinerte samtaler, deaktivert meldingsfelt, fire fremtidspunkter og tydelig tillitsinformasjon.
- Beholdt: Eksisterende fargepalett, typografi, avrundede kort og responsiv mobil-/desktopstruktur.
- Ikke implementert: AI, API-kall, server, meldingutveksling, innlogging eller ny brukerdata-lagring.

## Google Maps-veibeskrivelse

- Beholdt: Knappen «Åpne veibeskrivelse i Google Maps» under Min tur.
- Forbedret: En tydelig status viser at veibeskrivelsen er klar, og knappen har primær fremheving.
- Beholdt: Opptil tre stopp og valgt stopprekkefølge.
- Beholdt: Fiktive demosteder gir ingen Google Maps-rute.
- Lagt til: Hjelpeteksten «Vil du prøve veibeskrivelse? Velg Bystranda og Fiskebrygga i Utforsk.»
- Verifisert i tester: Bystranda som enkelt stopp, Bystranda–Fiskebrygga i begge rekkefølger og blanding av reelt/fiktivt sted.
- Verifisert i nettleser 2026-11-17: Bystranda gir én destinasjonslenke, Bystranda–Fiskebrygga gir en rekkefølgelenke og fiktivt sted gir ingen knapp.
- `npm test`: 29 tester bestod 2026-11-17.
- `npm run build`: produksjonsbygg bestod 2026-11-17.
- `git diff --check`: bestod 2026-11-17.

## Utvidet reell stedsdatabase

- Lagt til 2026-11-17: Ravnedalen, Baneheia, Otterdalsparken, Peisestuen park, Aquarama, Leo’s Lekeland Kristiansand, Hamresanden og Kristiansand Dyrepark.
- Koordinater er registrert med OSM-objekt eller Google Maps-leverandør som kilde. Aquarama og Leo’s har også egen virksomhetsside for stedsidentitet.
- Fasilitetsfelt for alle nye steder er Ukjent der egen dokumentasjon manglet.
- Peisestuen er registrert som park på Odderøya; lekeplassstatus må kontrolleres manuelt før den beskrives som lekeplass.
- Kart- og stedsmodellen er ikke redesignet.
- Totalt reelle steder: 10; totalt fiktive demosteder: 13.
- Verifisert: `npm test` bestod 2026-11-17 med 32 tester i 4 testfiler.
- Verifisert: `npm run build` bestod 2026-11-17 med Vite-produksjonsbygg.
- Verifisert: `git diff --check` bestod 2026-11-17.

## Turplanlegging og ekstern veibeskrivelse

- Implementert: valgte stopp kan flyttes opp og ned i `Min tur`, med maks tre stopp og eksisterende dato/notat bevart.
- Implementert: endret stopprekkefølge regnes som ulagret frem til «Lagre Min tur» brukes.
- Implementert: reelle stopp med koordinater kan åpne veibeskrivelse i Google Maps; URL-en følger valgt stopprekkefølge.
- Implementert: fiktive eller ufullstendige stopp får en kort forklaring i stedet for veibeskrivelsesknapp.
- Rettet: «Nullstill valg» tømmer nå alle valgte stopp deterministisk.
- Forenklet på mobil: kart, filter og stedskort bruker mindre minimumshøyde og tettere mellomrom uten å fjerne Karolines filtre.
- Manuell nettleserkontroll 2026-11-17: Utforsk → Min tur → flytt stopp → ulagret status → Google Maps-lenke kontrollert.
- Verifisert: `npm test -- --run` bestått 2026-11-17, 4 testfiler og 26 tester.
- Verifisert: `npm run build` bestått 2026-11-17 med Vite-produksjonsbygg.
- Verifisert: `git diff --check` bestått 2026-11-17.

## Avsluttende selektiv Emma-overføring

- Beholdt Karolines personlige reise: 0–6 år, fødselsdato, månedstilpasset babyvisning, aldersfiltrerte aktiviteter og sjekklister, generell aldersbeskrivelse, barnehage/skolestart, innholdspreferanser, profilredigering og lokal lagring.
- Overført fra Emma som presentasjon: enkel sjekklistefremdrift (`x av y klart`), få filtrerte snarveier fra Hjem og Min baby, hopp-lenke, fokus på sidens `h1` ved navigasjon og tydelige sidetitler.
- Snarveiene bruker eksisterende filterlogikk og query-parametre; ingen nye stedstyper eller datamodeller er lagt til.
- Kompromiss: snarveiene er begrenset til tre praktiske filtre og viser ikke egne nye kataloger eller innholdssider.
- Manuell nettleserkontroll 2026-11-17: Hjem → snarvei til Utforsk, Min baby → aldersvisning/sjekklister og navigasjonsfokus kontrollert.
- Begrensning: tastatur- og skjermleseropplevelse bør fortsatt testes med faktiske brukere og hjelpemidler.
- Verifisert: `npm test -- --run` bestått 2026-11-17, 4 testfiler og 26 tester.
- Verifisert: `npm run build` bestått 2026-11-17 med Vite-produksjonsbygg.
- Verifisert: `git diff --check` bestått 2026-11-17.
