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
| Favoritter i lokal lagring | Implementert, manuell kontroll gjenstår | `src/services/storage.ts`, Siri-skript |
| Fiktive og reelle stedsidentiteter | Implementert, data er demo | `docs/data-provenance.md` |
| Termin- og ukeinngang | Verifisert i kode/test | `src/domain/journey.test.ts` |
| Milepæler og minst tre pappatips | Verifisert i kode/test | `src/domain/journey.test.ts` |
| Separate råd til mor/den gravide og far/medforelder | Verifisert i kode/test | `src/domain/journey.test.ts`, `src/domain/journey.ts` |
| To sjekklister og lokal utholdenhet | Verifisert i kode/test; manuell reload gjenstår | `src/services/storage.test.ts`, Jonas-skript |
| Valg av barnets alder 0–5 år på profil | Implementert; manuell UI-kontroll gjenstår | `src/app/App.tsx` |
| Aldersfiltrerte aktivitetsforslag | Verifisert i kode/test; manuell UI-kontroll gjenstår | `src/data/activities.test.ts`, `src/data/activities.ts` |
| Alderstilpassede sjekkpunkter | Verifisert i kode/test; manuell UI-kontroll gjenstår | `src/domain/journey.test.ts`, `src/domain/journey.ts` |
| Kort aldersbeskrivelse i «Din status» | Verifisert i kode/test; manuell UI-kontroll gjenstår | `src/domain/journey.test.ts`, `src/app/App.tsx` |
| Aldersstyrt innhold i «Den første tiden hjemme» | Verifisert i kode/test; manuell UI-kontroll gjenstår | `src/domain/journey.test.ts`, `src/domain/journey.ts` |
| Varslingsforhåndsvisning | Implementert og simulert | `src/app/App.tsx` |
| Sletting av demodata | Verifisert i lagringstest; manuell UI-kontroll gjenstår | `src/services/storage.test.ts`, Jonas-skript |
| Pappasporet, guider og aktivitetsoversikt | Implementert; innholdet er demo/designhypotese | `src/app/App.tsx` |
| Responsiv layout | CSS-regler implementert; manuell kontroll gjenstår | `src/app/styles.css` |
| Tastaturfokus og dialogsemantikk | Implementert; skjermleser-/tastaturtest gjenstår | `src/app/App.tsx`, `src/app/styles.css` |
| Kartfliser og ekstern karttjeneste | Simulert av ekstern leverandør | `src/app/App.tsx`, `docs/data-provenance.md` |
| Produksjonsinnlogging, sending, booking, betaling og medisinsk rådgivning | Utenfor MVP | `docs/MASTERSPESIFIKASJON.md` |

## Faktisk verifisert i fase 4

- `npm test`: 8 tester bestått.
- `npm run build`: bestått.
- Manuell brukertest, mobilnettleser, skjermleser og runtime-kartfeil: ikke kjørt i denne fasen.
