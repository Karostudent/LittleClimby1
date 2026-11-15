import { useState, type FormEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import { places } from '../../data/places';
import { categoryLabels, directionsUrl, facilityLabels, isFictional, type FacilityClaim, type FacilityName } from '../../domain/places';
import { addPlaceReport, readFavoriteIds, writeFavoriteIds } from '../../services/storage';
import type { TripSelection } from '../App';
import { BackLink, DataBadge, Icon, StatusChip, formatLongDate, usePageTitle } from '../ui';

const latestFacilityCheck = (facilities: Partial<Record<FacilityName, FacilityClaim>>) =>
  Object.values(facilities)
    .filter((claim): claim is FacilityClaim => Boolean(claim?.checkedAt && (claim.evidenceStatus === 'venue_confirmed' || claim.evidenceStatus === 'public_source')))
    .map((claim) => claim.checkedAt as string)
    .sort()
    .pop();

export function PlaceDetail({ trip }: { trip: TripSelection }) {
  const { placeId } = useParams();
  const place = places.find((item) => item.id === placeId);
  usePageTitle(place?.name ?? 'Fant ikke stedet');
  const [favorites, setFavorites] = useState(readFavoriteIds);
  const [reportKind, setReportKind] = useState<'confirm' | 'error' | null>(null);
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  if (!place) {
    return (
      <div className="page page-narrow">
        <BackLink to="/utforsk">Tilbake til Utforsk</BackLink>
        <h1 tabIndex={-1}>Fant ikke stedet</h1>
        <p>Stedet kan være fjernet fra demoen.</p>
      </div>
    );
  }

  const real = !isFictional(place);
  const saved = favorites.includes(place.id);
  const inTrip = trip.ids.includes(place.id);
  const tripFull = !inTrip && trip.ids.length >= 3;
  const facilitiesChecked = latestFacilityCheck(place.facilities);

  const toggleFavorite = () => {
    const next = saved ? favorites.filter((id) => id !== place.id) : [...favorites, place.id];
    setFavorites(next);
    writeFavoriteIds(next);
  };

  const sendReport = (event: FormEvent) => {
    event.preventDefault();
    if (!reportKind) return;
    addPlaceReport({ placeId: place.id, kind: reportKind, message: message.trim(), createdAt: new Date().toISOString() });
    setSent(true);
    setReportKind(null);
    setMessage('');
  };

  return (
    <div className="page">
      <BackLink to="/utforsk">Tilbake til Utforsk</BackLink>
      <div className="detail">
        <div className="stack" style={{ gap: 8 }}>
          <span style={{ alignSelf: 'flex-start' }}><DataBadge real={real} /></span>
          <h1 tabIndex={-1}>{place.name}</h1>
          <p>{categoryLabels[place.category]} · {place.addressOrArea}</p>
          <p className="muted">{place.shortDescription}</p>
        </div>

        <section className="card card-mint" aria-labelledby="check-title">
          <h2 id="check-title" className="row" style={{ alignItems: 'center', gap: 8 }}><Icon name="shield" />Sist kontrollert</h2>
          {real ? (
            <>
              <dl className="check-list">
                <dt>Stedet finnes</dt><dd>{place.identityCheckedAt ? formatLongDate(place.identityCheckedAt) : 'Ikke kontrollert'}</dd>
                <dt>Posisjon</dt><dd>{place.coordinatesCheckedAt ? formatLongDate(place.coordinatesCheckedAt) : 'Ikke kontrollert'}</dd>
                <dt>Fasiliteter</dt><dd>{facilitiesChecked ? formatLongDate(facilitiesChecked) : 'Ikke kontrollert'}</dd>
              </dl>
              <p className="small">
                Kilder:{' '}
                {place.identitySourceUrl && <a href={place.identitySourceUrl} target="_blank" rel="noreferrer">stedet<span className="vh"> (åpnes i ny fane)</span></a>}
                {place.identitySourceUrl && place.coordinatesSourceUrl && ' og '}
                {place.coordinatesSourceUrl && <a href={place.coordinatesSourceUrl} target="_blank" rel="noreferrer">posisjonen<span className="vh"> (åpnes i ny fane)</span></a>}
              </p>
            </>
          ) : (
            <p>Dette er et fiktivt sted laget for å vise hvordan appen fungerer. Ingenting her er kontrollert.</p>
          )}
        </section>

        <section aria-labelledby="fac-title">
          <h2 id="fac-title">Fasiliteter</h2>
          <ul className="fac-list">
            {Object.entries(place.facilities).map(([name, claim]) => claim && (
              <li key={name}>{facilityLabels[name as FacilityName]}<StatusChip value={claim.value} /></li>
            ))}
          </ul>
          {place.routeInfo && (
            <p style={{ marginTop: 12 }}><strong>Rute:</strong> {place.routeInfo.lengthKm ? `${String(place.routeInfo.lengthKm).replace('.', ',')} km · ` : ''}{place.routeInfo.surfaceText}. Rutedata er ikke kontrollert.</p>
          )}
          <p style={{ marginTop: 12 }}>«Ukjent» betyr at vi ikke har kontrollert dette ennå. Sjekk gjerne med stedet før dere drar.</p>
        </section>

        <div className="stack">
          {real && place.coordinates ? (
            <>
              <a className="btn btn-primary" href={directionsUrl([place.coordinates])} target="_blank" rel="noreferrer">
                <Icon name="navigate" />Vis vei i kartappen<span className="vh"> (åpnes i ny fane)</span>
              </a>
              <p className="muted" style={{ textAlign: 'center' }}>Åpner Google Maps. Der velger du gange, kollektiv eller bil.</p>
            </>
          ) : (
            <p className="muted">Veibeskrivelse finnes bare for reelle steder.</p>
          )}
          <div className="grid-2">
            <button className="btn btn-secondary" aria-pressed={inTrip} disabled={tripFull} onClick={() => trip.toggle(place.id)}>
              {inTrip ? 'Lagt til tur' : tripFull ? 'Turen er full' : 'Legg til tur'}
            </button>
            <button className="btn btn-outline" aria-pressed={saved} onClick={toggleFavorite}>
              <Icon name="star" size={18} />{saved ? 'Lagret' : 'Lagre'}
            </button>
          </div>
          {inTrip && <Link className="text-link" to="/planlegg">Gå til turplanen</Link>}
        </div>

        <section className="card" aria-labelledby="help-title">
          <h2 id="help-title">Har du vært her?</h2>
          <p>Hjelp andre foreldre. Vi kontrollerer det du sender inn før det vises som bekreftet.</p>
          {!reportKind && (
            <div className="grid-2">
              <button className="btn btn-outline" onClick={() => { setReportKind('confirm'); setSent(false); }}>Bekreft informasjon</button>
              <button className="btn btn-outline" onClick={() => { setReportKind('error'); setSent(false); }}>Meld fra om feil</button>
            </div>
          )}
          {reportKind && (
            <form className="stack" onSubmit={sendReport}>
              <label className="field">{reportKind === 'confirm' ? 'Hva kan du bekrefte?' : 'Hva er feil?'}
                <span className="hint">{reportKind === 'confirm' ? 'For eksempel: Det er stellerom ved inngangen.' : 'For eksempel: Det er trapp inn, ikke trappefritt.'}</span>
                <textarea className="input" value={message} onChange={(event) => setMessage(event.target.value)} required />
              </label>
              <div className="row">
                <button className="btn btn-primary" type="submit">Send</button>
                <button className="btn btn-outline" type="button" onClick={() => setReportKind(null)}>Avbryt</button>
              </div>
            </form>
          )}
          <div role="status">{sent && <p className="status-msg">Takk! I demoen lagres meldingen bare i denne nettleseren.</p>}</div>
        </section>
      </div>
    </div>
  );
}
