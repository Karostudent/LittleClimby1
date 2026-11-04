# Testscenarier og brukertest

## Før testen

1. Kjør `npm install`, `npm test` og `npm run build`.
2. Start appen med `npm run dev`.
3. Bruk en ren nettleserprofil eller velg «Slett mine demodata» før ny test.
4. Opplys testpersonen om at dette er en studentprototype med syntetiske data.
5. Ikke be om ekte navn, e-post, termin eller andre personopplysninger. Bruk scenarioverdiene under.

## Siri – kartreise (3–5 minutter)

**Scenario:** Du er Siri og vil finne et sted i Kristiansand for en tur med baby. Du vil vite hva som er bekreftet, og om det finnes plass til barnevogn og stellefasilitet.

**Oppgave til testpersonen:** «Finn et passende sted uten å lage profil. Undersøk detaljene, lagre stedet og vis hvordan du ville funnet veien.»

**Observatørens stoppunkter:**

1. Fra Hjem åpner testpersonen «Finn babyvennlige steder».
2. Testpersonen bytter mellom Kart og Liste.
3. Testpersonen søker etter `barsel` eller velger «Aktivitet».
4. Testpersonen nullstiller og aktiverer «Stellerom» og «Plass til barnevogn».
5. Testpersonen åpner `Demokafé Solgløtt` og finner «Fiktivt demosted».
6. Testpersonen lagrer favoritten og oppdaterer siden.
7. Testpersonen åpner en reell stedsidentitet og forklarer hva «Ukjent» betyr.
8. Testpersonen peker på ekstern vei-/kartlenke, uten at appen påstår å beregne en trygg rute.

**Forventet resultat:** Testpersonen kan bruke kartet uten profil, forstår listealternativet, ser at positive filtre krever eksplisitt ja, skiller fiktive data fra reelle identiteter og finner igjen favoritten.

## Jonas – personlig reise (3–5 minutter)

**Scenario:** Du er Jonas og ønsker konkrete, ikke-medisinske forslag til hvordan du kan bidra før og etter fødsel.

**Oppgave til testpersonen:** «Lag en lokal demoprofil, finn neste praktiske råd, kryss av en oppgave og kontroller at varslingen ikke sendes.»

**Observatørens stoppunkter:**

1. Fra Hjem åpner testpersonen «Se Min reise».
2. Velger «Jeg venter barn» og registrerer eksempeltermin `01.01.2027`, eller velger uke `20`.
3. Velger «Pappa/medforelder» og lagrer profilen.
4. Leser den omtrentlig beregnede uken og et pappatips.
5. Krysser av én oppgave i hver av de to sjekklistene.
6. Oppdaterer siden og kontrollerer at avkrysningene består.
7. Leser varslingskortet og bekrefter «Ikke sendt – prototype».
8. Åpner «Finn steder å besøke» og går til Utforsk.
9. Velger «Slett mine demodata» og kontrollerer at profilen er borte.

**Forventet resultat:** Testpersonen forstår at profilen er frivillig og lokal, at ukevisningen er omtrentlig, at rådene ikke er medisinske, at varsler ikke sendes og at sletting faktisk nullstiller demoen.

## Enkel regresjonssjekk

1. Åpne Utforsk uten profil; kart og liste skal være tilgjengelig.
2. Aktiver Stellerom og Plass til barnevogn; bare eksplisitt `yes` skal vises.
3. Søk etter `barseltreff` og velg aktivitetskategori.
4. Velg kombinasjon uten treff; tomtilstand og nullstilling skal vises.
5. Åpne fiktivt sted; «Fiktivt demosted» skal være synlig.
6. Lagre en favoritt, oppdater siden og kontroller at stjernen består.
7. Åpne reell identitet; fasiliteter skal stå som ukjent og ingen kartpin skal påstås.
8. Opprett forventende profil med termin og med uke som separat alternativ.
9. Kryss av sjekklister, oppdater siden og slett demodata.
10. Åpne Guider og kontroller Pappasporet, aktivitetskort og kildestatus.
