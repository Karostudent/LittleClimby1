# Kravstatus ved fase 4

Statusene betyr:

- **Verifisert i kode/test:** dekket av kjørte tester eller inspeksjon av implementasjonen.
- **Implementert, manuell kontroll gjenstår:** funksjonen finnes, men nettleser-, mobil- eller tilgjengelighetskontroll er ikke kjørt.
- **Simulert/demo:** bevisst syntetisk eller forhåndsvisning, ikke en produksjonsfunksjon.
- **Utenfor MVP:** ikke implementert etter spesifikasjonen.

| Område | Status | Dokumentasjon |
|---|---|---|
| Kart, liste, søk og filtre | Verifisert i kode/test | `src/domain/places.test.ts`, `src/app/App.tsx` |
| `unknown` ekskluderes fra positive filtre | Verifisert i kode/test | `src/domain/places.test.ts` |
| Favoritter i lokal lagring | Verifisert i kode/test og nettleserkontroll | `src/services/storage.ts`, Ingrid-skript |
| Fiktive og reelle stedsidentiteter | Implementert, data er demo | `docs/data-provenance.md` |
| Termin- og ukeinngang | Verifisert i kode/test | `src/domain/journey.test.ts` |
| Milepæler og minst tre pappatips | Verifisert i kode/test | `src/domain/journey.test.ts` |
| Separate råd til mor/den gravide og far/medforelder | Verifisert i kode/test | `src/domain/journey.test.ts`, `src/domain/journey.ts` |
| To sjekklister og lokal utholdenhet | Verifisert i kode/test; manuell reload gjenstår | `src/services/storage.test.ts`, Jonas-skript |
| Valg av barnets alder 0–6 år og fødselsdato på profil | Verifisert i kode/test og nettleserkontroll; eksklusive innganger implementert | `src/app/App.tsx`, `src/domain/journey.test.ts` |
| Aldersfiltrerte aktivitetsforslag | Verifisert i kode/test; manuell UI-kontroll gjenstår | `src/data/activities.test.ts`, `src/data/activities.ts` |
| Alderstilpassede sjekkpunkter | Verifisert i kode/test; manuell UI-kontroll gjenstår | `src/domain/journey.test.ts`, `src/domain/journey.ts` |
| Kort aldersbeskrivelse i «Din status» | Verifisert i kode/test; manuell UI-kontroll gjenstår | `src/domain/journey.test.ts`, `src/app/App.tsx` |
| Aldersstyrt innhold i «Den første tiden hjemme» | Verifisert i kode/test; manuell UI-kontroll gjenstår | `src/domain/journey.test.ts`, `src/domain/journey.ts` |
| Varslingsforhåndsvisning | Implementert og simulert | `src/app/App.tsx` |
| Sletting av demodata | Verifisert i lagringstest; manuell UI-kontroll gjenstår | `src/services/storage.test.ts`, Jonas-skript |
| Pappasporet, guider og aktivitetsoversikt | Implementert; innholdet er demo/designhypotese | `src/app/App.tsx` |
| Responsiv layout og femvalgsnavigasjon | Nettleserkontroll gjennomført; full skjermlesertest gjenstår | `src/app/styles.css`, `src/app/App.tsx` |
| Tastaturfokus og dialogsemantikk | Escape, fokus og bakgrunnssperre kontrollert i nettleser; skjermlesertest gjenstår | `src/app/App.tsx`, `src/app/styles.css` |
| Kartfliser og ekstern karttjeneste | Simulert av ekstern leverandør | `src/app/App.tsx`, `docs/data-provenance.md` |
| Produksjonsinnlogging, sending, booking, betaling og medisinsk rådgivning | Utenfor MVP | `docs/MASTERSPESIFIKASJON.md` |

## Faktisk verifisert i fase 4

- Siste `npm test`: 26 tester bestått i 4 testfiler.
- `npm run build`: bestått.
- Mobil- og desktopnavigasjon med Hjem, Utforsk, Min tur, Min baby og Mer er implementert; Guider, Partnertilbud og Profil ligger under Mer.
- Nettleserkontroll er kjørt for 320–1920 px bredde og 320–900 px høyde. Hurting-oppdatering av filter, Escape/lukking av Mer-meny og stedsdialog, samt Min tur-fjerning er kontrollert.
- Faktisk brukertest med testpersoner og skjermlesergjennomgang er ikke kjørt i denne fasen.
