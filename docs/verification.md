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
