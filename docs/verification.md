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
- Implementert: full mobilbunnmeny med alle sju Karoline-innganger, safe-area-støtte, Emma-inspirert aktivt ikonfelt og matchende SVG-symboler.
- `npm test`: bestått 2026-11-16, 4 testfiler og 23 tester.
- `npm run build`: bestått 2026-11-16 med Vite-produksjonsbygg.
- `git diff --check`: bestått 2026-11-16.
- Ikke verifisert ennå: visuell kontroll i mobilnettleser og skjermlesergjennomgang.
