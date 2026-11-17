# Beslutningslogg

## 2026-11-04

- **Appnavn:** Appen bruker navnet «Enklere Babyliv» i brukergrensesnittet. Little BabyBot er navnet på den framtidige chatbot-funksjonen.
- **Forretningsmodell:** Partnerinnhold samles på en egen, valgfri tilbudsside. Provisjon ved booking er hovedhypotesen; sponset plassering er et tydelig merket tillegg.
- **Figurer:** Appen bruker egne, fiktive appfigurer inntil eventuelle rettigheter til eksterne figurunivers er avklart.
- **Fargepalett:** UI-et bruker en mer nøytral marineblå/petrol-basert palett med skifertekst, dempet sand og tydelige statusfarger. Valget skal oppleves robust og voksen uten å bruke farge alene som meningsbærer.
- **Kart som hovedfunksjon:** Studentgruppen følger spesifikasjonens fastsatte konseptvalg og bygger kartreisen først. Dette er en prototypetolkning som skal forelegges oppdragsgiver.
- **Utstyrsliste først:** Opprinnelig prioritering i briefen registreres som åpent avklaringspunkt. Den er ikke erstattet som produktkrav; den er bare utenfor fase 1.
- **Ingen falsk fasilitetsdata:** Reelle stedsidentiteter har `unknown` der separat fasilitetsbevis mangler.
- **Koordinater:** Bare syntetiske demooppføringer har kartkoordinater i fase 1. Reelle identiteter kan ligge i listen uten pin.
- **Teknikk:** React, TypeScript, Vite, React Router og React Leaflet brukes fordi de er foreslått i masterspesifikasjonen og holder prototypen forståelig.

## 2026-11-17

- **Stedsdialog:** Detaljvisningen beholder informasjonsrekkefølgen, men får intern vertikal scrolling og en fast tilgjengelig «Lukk»-handling.
- **Hurtigfiltre:** URL-parameteren `filter` synkroniseres når Utforsk er montert på nytt eller navigasjonen endres mens siden forblir aktiv.
- **Barnets alder:** Fødselsdato og omtrentlig alder vises som to eksklusive alternativer for å unngå motstridende aldersopplysninger.
- **Min tur:** Lagret tur og ulagret utkast skilles tydelig, og det finnes eksplisitte handlinger for å fjerne alle stopp eller starte en ny tur.
- **Tilgjengelighet:** Mer-menyen og stedsdialogen støtter Escape, fokusstyring og lukking utenfor; mobilens Mer-meny begrenses til tilgjengelig viewport-høyde.
- **Little BabyBot:** Implementert kun som en forhåndsvisningsside under «Mer» med tre forhåndsdefinerte samtaler. Meldingsfelt og sendehandling er deaktivert, og ingen AI, API, backend eller chatlagring brukes.
