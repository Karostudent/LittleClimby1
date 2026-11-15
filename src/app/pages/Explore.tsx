import { useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { MapContainer, Marker, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { places } from '../../data/places';
import { categoryLabels, facilityLabels, isFictional, matchesPlace, verificationSummary, type FacilityName, type Place } from '../../domain/places';
import type { TripSelection } from '../App';
import { DataBadge, Icon, StatusChip, usePageTitle } from '../ui';

export const filterOptions: FacilityName[] = ['changing_table', 'stroller_space', 'step_free_access', 'changing_access_all_caregivers', 'free_activity'];

const shortLabels: Partial<Record<FacilityName, string>> = {
  changing_table: 'Stellerom',
  stroller_space: 'Barnevognplass',
  step_free_access: 'Trappefri',
  changing_access_all_caregivers: 'Stell for alle',
  free_activity: 'Gratis',
};

const escapeHtml = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Kartnål med synlig form og et navn skjermlesere kan lese opp. */
const pinIcon = (place: Place) => {
  const yes = Object.values(place.facilities).filter((claim) => claim?.value === 'yes').length;
  const name = `${place.name}, ${isFictional(place) ? 'eksempeldata' : 'reelt sted'}, ${yes} med Ja. Åpne detaljer`;
  return L.divIcon({
    className: 'pin-icon',
    html: `<span class="pin ${isFictional(place) ? 'pin-demo' : 'pin-real'}"><span class="pin-shape"><i></i></span><span class="vh">${escapeHtml(name)}</span></span>`,
    iconSize: [44, 44],
    iconAnchor: [22, 42],
  });
};

export function PlaceCard({ place, trip }: { place: Place; trip: TripSelection }) {
  const inTrip = trip.ids.includes(place.id);
  const full = !inTrip && trip.ids.length >= 3;
  return (
    <article className="card place-card">
      <div className="place-card-head">
        <div>
          <h3>{place.name}</h3>
          <p className="muted">{categoryLabels[place.category]} · {place.addressOrArea}{place.routeInfo?.lengthKm ? ` · ${String(place.routeInfo.lengthKm).replace('.', ',')} km` : ''}</p>
        </div>
        <DataBadge real={!isFictional(place)} />
      </div>
      <p className="muted small">{verificationSummary(place)}</p>
      <ul className="chip-list" aria-label="Fasiliteter">
        {Object.entries(place.facilities).slice(0, 3).map(([name, claim]) => claim && (
          <li key={name}><StatusChip value={claim.value} label={shortLabels[name as FacilityName] ?? facilityLabels[name as FacilityName]} /></li>
        ))}
      </ul>
      <div className="place-card-actions">
        <Link className="btn btn-secondary" to={`/utforsk/${place.id}`}>Se detaljer<span className="vh"> om {place.name}</span></Link>
        <button className="btn btn-outline" aria-pressed={inTrip} disabled={full} onClick={() => trip.toggle(place.id)}>
          {inTrip ? 'Lagt til tur' : full ? 'Turen er full' : 'Legg til tur'}<span className="vh"> – {place.name}</span>
        </button>
      </div>
    </article>
  );
}

export function Explore({ trip }: { trip: TripSelection }) {
  usePageTitle('Utforsk');
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [view, setView] = useState<'map' | 'list'>('map');
  const filters = (params.get('filter') ?? '').split(',').filter((value): value is FacilityName => filterOptions.includes(value as FacilityName));

  const setFilters = (next: FacilityName[]) => setParams(next.length ? { filter: next.join(',') } : {}, { replace: true });
  const toggleFilter = (filter: FacilityName) => setFilters(filters.includes(filter) ? filters.filter((item) => item !== filter) : [...filters, filter]);
  const results = useMemo(() => places.filter((place) => matchesPlace(place, search, 'all', filters)), [search, filters.join(',')]);
  const countText = `${results.length} ${results.length === 1 ? 'sted' : 'steder'}`;

  return (
    <div className={`explore ${view}`}>
      <div className="explore-controls">
        <div className="explore-controls-inner">
          <div className="explore-top">
            <h1 tabIndex={-1}>Utforsk</h1>
            <div className="segmented" role="group" aria-label="Visning">
              <button aria-pressed={view === 'map'} onClick={() => setView('map')}>Kart</button>
              <button aria-pressed={view === 'list'} onClick={() => setView('list')}>Liste</button>
            </div>
          </div>
          <label className="field">Søk etter sted eller område
            <span className="search-box">
              <Icon name="search" />
              <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="For eksempel Kvadraturen eller kafé" />
            </span>
          </label>
          <div className="pill-row" role="group" aria-label="Filtrer på fasiliteter">
            {filterOptions.map((filter) => (
              <button key={filter} className="pill" aria-pressed={filters.includes(filter)} onClick={() => toggleFilter(filter)}>
                {filters.includes(filter) && <Icon name="check" size={14} strokeWidth={3} />}{shortLabels[filter]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="explore-body">
        {view === 'map' && (
          <div className="explore-map" role="region" aria-label="Kart over Kristiansand med steder">
            <MapContainer center={[58.1467, 7.9956]} zoom={13} scrollWheelZoom={false}>
              <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {results.filter((place) => place.coordinates).map((place) => (
                <Marker key={place.id} position={[place.coordinates!.lat, place.coordinates!.lng]} icon={pinIcon(place)} keyboard
                  eventHandlers={{ click: () => navigate(`/utforsk/${place.id}`) }} />
              ))}
            </MapContainer>
            <div className="map-legend" aria-hidden="true">
              <span><i className="dot dot-real" />Reelt sted</span>
              <span><i className="dot dot-demo" />Eksempeldata</span>
            </div>
          </div>
        )}

        <section className="explore-results" aria-labelledby="results-title">
          <div className="sheet-handle" aria-hidden="true" />
          <div className="results-head">
            <h2 id="results-title"><span role="status" aria-live="polite">{countText}</span></h2>
            {filters.length > 0 && <button className="text-link" onClick={() => setFilters([])}>Nullstill filtre</button>}
          </div>
          {filters.length > 0 && <p className="muted small">Viser bare steder med bekreftet «Ja» på alt du har valgt. «Ukjent» gir ikke treff.</p>}
          {results.length === 0 ? (
            <div className="card" style={{ alignItems: 'center', textAlign: 'center' }}>
              <h3>Ingen bekreftede treff</h3>
              <p>Ingen steder har «Ja» på alle filtrene du har valgt. Prøv å fjerne ett filter.</p>
              <button className="btn btn-secondary" onClick={() => { setFilters([]); setSearch(''); }}>Nullstill søk og filtre</button>
            </div>
          ) : (
            <ul className="result-list">
              {results.map((place) => <li key={place.id}><PlaceCard place={place} trip={trip} /></li>)}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
