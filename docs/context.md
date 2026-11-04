# Kontekst

## Formål

LittleClimby-appen er en privat studentprototype for IS-219. Fase 1 tester om en forelder kan finne et passende sted i Kristiansand uten konto, med tydelig skille mellom dokumentert stedsidentitet, fasilitetspåstander og fiktiv demodata.

## Viktige krav

1. Kartet er hovedfunksjonen, men dette er et gruppevalg som må avklares med oppdragsgiver.
2. Kart/liste, søk, kategorier, positive fasilitetsfiltre, stedskort og favoritter må fungere sammen.
3. `unknown` skal aldri telle som `yes`.
4. Fiktive steder skal merkes overalt; reelle identiteter skal ikke få oppdiktede fasiliteter.
5. Kartet skal ha tekstlig listealternativ og vise ekstern navigasjon som ekstern.
6. Demoen skal fungere uten innlogging og lagre bare syntetiske favoritter lokalt.

## Risikoer og antakelser

- Kartfliser kan være utilgjengelige eller ha leverandørvilkår som krever ny vurdering før produksjon.
- Reelle steder vises foreløpig uten kartkoordinater fordi posisjon ikke er kontrollert i denne arbeidsøkten.
- Fase 1 bruker seks fiktive testoppføringer og to reelle stedsidentiteter.
- «Utstyrsliste først» fra briefen er ikke implementert i fase 1.

## Sporbarhet

Kravene er hentet fra `docs/MASTERSPESIFIKASJON.md`, særlig MAP-01–MAP-11, UI-01–UI-02, A01–A08, UX01 og SRC01–SRC02.
