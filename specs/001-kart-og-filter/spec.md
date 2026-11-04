# Fase 1: Kart og filter

## Mål

Siri skal kunne åpne Utforsk uten innlogging, finne et sted ved tekst eller filter, forstå datastatus, åpne detaljer og lagre en favoritt.

## Akseptanse

- Kartet er sentrert på Kristiansand og bruker strukturerte `Place`-data.
- Listevisningen viser de samme filtrerte resultatene som kartvisningen.
- Positive fasilitetsfilter krever eksplisitt `yes`.
- `unknown` og `no` ekskluderes fra positive filter.
- Fiktive oppføringer merkes; reelle oppføringer viser kilde for identitet når den finnes.
- Null treff gir forståelig tomtilstand og nullstilling.
- Favoritter lagres defensivt i localStorage.

## Ikke i denne fasen

Min reise, sjekklister, varsler, produksjonskonto, booking, ratings og automatisk ruteplanlegging.
