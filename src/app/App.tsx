import { useMemo, useState } from 'react';
import { Link, NavLink, Route, Routes } from 'react-router-dom';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { categoryLabels, facilityLabels, isFictional, matchesPlace, type FacilityName, type Place, type PlaceCategory } from '../domain/places';
import { places } from '../data/places';
import { activitiesForAge } from '../data/activities';
import { checklistItemsForAge, getAgeDescription, getCurrentMilestone, getJourneyWeek, initialDemoState, type ContentPreference, type DemoProfile, type DemoState, type JourneyStage } from '../domain/journey';
import { clearDemoState, readDemoState, readFavoriteIds, writeDemoState, writeFavoriteIds } from '../services/storage';
import './styles.css';

const filterOptions: FacilityName[] = ['changing_table', 'stroller_space', 'step_free_access', 'changing_access_all_caregivers', 'stroller_suitable_route', 'free_activity'];

function Shell({ children }: { children: React.ReactNode }) {
  return <><header className="topbar"><Link to="/" className="brand">LittleClimby-appen <span>DEMO</span></Link><nav aria-label="Hovedmeny">{['/', '/utforsk', '/reise', '/guider', '/profil'].map((path) => <NavLink key={path} to={path} end={path === '/'}>{path === '/' ? 'Hjem' : path.slice(1).replace('utforsk', 'Utforsk').replace('reise', 'Min reise').replace('guider', 'Guider').replace('profil', 'Profil')}</NavLink>)}</nav></header><main>{children}</main><footer>Studentprototype · Eksempeldata er ikke en offentlig tjeneste.</footer></>;
}

function Home() {
  return <section className="hero page"><p className="eyebrow">Enklere babyliv, hjemme og ute</p><h1>Finn et sted som passer dere.</h1><p className="lead">Utforsk Kristiansand med tydelig informasjon om hva som er kjent, ukjent og bare demonstrert.</p><div className="actions"><Link className="button primary" to="/utforsk">Finn babyvennlige steder</Link><Link className="button secondary" to="/reise">Se Min reise</Link></div><div className="card-grid"><article className="card"><h2>Tryggere valg</h2><p>Se fasiliteter med ja, nei eller ukjent – vi gjetter ikke.</p></article><article className="card"><h2>For alle omsorgspersoner</h2><p>Filtrer på stelleplass tilgjengelig for alle omsorgspersoner.</p></article></div></section>;
}

function TrustNote() {
  return <aside className="trust-note" aria-label="Om data og demo"><strong>Slik leser du informasjonen</strong><span><b className="legend-dot confirmed" />Bekreftet av oppføringens kilde</span><span><b className="legend-dot unknown" />Ukjent betyr at vi ikke har bevis</span><span><b className="legend-dot demo" />Fiktivt demosted er kun eksempeldata</span></aside>;
}

function Guides() {
  return <section className="page guides"><div className="section-intro"><div><p className="eyebrow">Guider og Pappasporet</p><h1>Praktisk støtte, uten fasit.</h1></div><Link className="button secondary" to="/utforsk">Finn steder</Link></div><p className="lead">Korte, generelle forslag for pappa, medforelder og andre omsorgspersoner. Innholdet er ikke medisinsk rådgivning.</p><div className="guide-grid"><article className="card guide-card"><p className="eyebrow">Pappasporet</p><h2>Pappa og baby på tur</h2><p>Velg et sted med enkel adkomst, og sjekk fasiliteter før dere drar. En plan B kan være å snu eller ta en kortere tur.</p><ul><li>Ta med det dere faktisk bruker.</li><li>Finn ut hvem som kan hjelpe hvis dagen endrer seg.</li><li>La begge omsorgspersoner få eie sin måte å gjøre ting på.</li></ul><Link className="text-button" to="/reise">Se praktiske sjekklister</Link></article><article className="card guide-card"><p className="eyebrow">På tur med baby</p><h2>Gjør første tur enkel</h2><p>Start med et rolig mål og god tid. Kartet viser fasilitetsstatus der den er kjent, men tilgjengelighet kan endre seg.</p><ul><li>Se etter plass til barnevogn.</li><li>Bruk listevisningen hvis kartfliser ikke lastes.</li><li>Åpne ekstern karttjeneste for vei – dette er ikke appens egen ruteplanlegger.</li></ul><Link className="text-button" to="/utforsk">Åpne kartet</Link></article></div><section className="card activities"><div className="section-intro"><div><p className="eyebrow">Enkel aktivitetsoversikt</p><h2>Aktiviteter i demoen</h2></div><span className="demo-label">Demodata</span></div><p>Dette er fiktive kort for å vise hvordan aktiviteter kan presenteres. Ingen datoer eller påmeldinger er reelle.</p><div className="activity-list">{places.filter((place) => place.category === 'activity').map((place) => <article className="activity-card" key={place.id}><h3>{place.name}</h3><p className="muted">{place.addressOrArea} · Gratis i demoen</p><span className="demo-label">Fiktiv aktivitet</span><p>{place.shortDescription}</p></article>)}</div></section><p className="source-note">Kunnskapskortene er generelle designhypoteser for studentprototypen. De skal kvalitetssikres før eventuell produksjonsbruk.</p></section>;
}

function PlaceCard({ place, favorite, onFavorite, onSelect }: { place: Place; favorite: boolean; onFavorite: () => void; onSelect: () => void }) {
  return <article className="place-card"><div className="card-heading"><div><h3>{place.name}</h3><p className="muted">{categoryLabels[place.category]} · {place.addressOrArea}</p></div><button className="icon-button" aria-label={favorite ? `Fjern ${place.name} fra favoritter` : `Lagre ${place.name} som favoritt`} onClick={onFavorite}>{favorite ? '★' : '☆'}</button></div>{isFictional(place) && <span className="demo-label">Fiktivt demosted</span>}<p>{place.shortDescription}</p><div className="facility-list">{Object.entries(place.facilities).slice(0, 3).map(([name, claim]) => <span className={`status ${claim?.value}`} key={name}>{claim?.value === 'yes' ? 'Ja' : claim?.value === 'no' ? 'Nei' : 'Ukjent'} · {facilityLabels[name as FacilityName]}</span>)}</div><button className="text-button" onClick={onSelect}>Se detaljer</button></article>;
}

function PlaceDetails({ place, onClose }: { place: Place; onClose: () => void }) {
  return <div className="detail-panel" role="dialog" aria-modal="true" aria-labelledby="detail-title"><button className="close-button" onClick={onClose}>Lukk</button><h2 id="detail-title">{place.name}</h2>{isFictional(place) ? <p className="demo-label">Fiktivt demosted – kun eksempeldata</p> : <p className="verified-label">Reell stedsidentitet · fasiliteter må verifiseres separat</p>}<p className="muted">{place.addressOrArea}</p><p>{place.shortDescription}</p><h3>Fasiliteter</h3><ul>{Object.entries(place.facilities).map(([name, claim]) => <li key={name}><strong>{facilityLabels[name as FacilityName]}:</strong> {claim?.value === 'yes' ? 'Ja' : claim?.value === 'no' ? 'Nei' : 'Ukjent'}{claim?.note ? ` – ${claim.note}` : ''}</li>)}</ul>{place.identitySourceUrl && <p><a href={place.identitySourceUrl} target="_blank" rel="noreferrer">Kilde for stedsidentitet (ekstern)</a></p>}{place.coordinates && !isFictional(place) && <a className="button secondary" href={`https://www.openstreetmap.org/?mlat=${place.coordinates.lat}&mlon=${place.coordinates.lng}#map=17/${place.coordinates.lat}/${place.coordinates.lng}`} target="_blank" rel="noreferrer">Vis vei (ekstern)</a>}</div>;
}

function Explore() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<PlaceCategory | 'all'>('all');
  const [filters, setFilters] = useState<FacilityName[]>([]);
  const [view, setView] = useState<'map' | 'list'>('map');
  const [selected, setSelected] = useState<Place | null>(null);
  const [favorites, setFavorites] = useState(readFavoriteIds);
  const results = useMemo(() => places.filter((place) => matchesPlace(place, search, category, filters)), [search, category, filters]);
  const toggleFavorite = (id: string) => { const next = favorites.includes(id) ? favorites.filter((item) => item !== id) : [...favorites, id]; setFavorites(next); writeFavoriteIds(next); };
  const reset = () => { setSearch(''); setCategory('all'); setFilters([]); };
  return <section className="page explore"><div className="section-intro"><div><p className="eyebrow">Kristiansand og nærområdene</p><h1>Utforsk steder</h1></div><span className="result-count">{results.length} treff</span></div><TrustNote /><div className="controls"><label>Søk<input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Navn, område eller tag" /></label><label>Kategori<select value={category} onChange={(event) => setCategory(event.target.value as PlaceCategory | 'all')}><option value="all">Alle kategorier</option>{Object.entries(categoryLabels).map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label><div className="filter-group"><span className="label">Filtre</span>{filterOptions.map((filter) => <label className="checkbox" key={filter}><input type="checkbox" checked={filters.includes(filter)} onChange={() => setFilters(filters.includes(filter) ? filters.filter((item) => item !== filter) : [...filters, filter])} />{facilityLabels[filter]}</label>)}</div><button className="text-button" onClick={reset}>Nullstill filtre</button></div><div className="view-toggle" role="group" aria-label="Visning"><button className={view === 'map' ? 'active' : ''} onClick={() => setView('map')}>Kart</button><button className={view === 'list' ? 'active' : ''} onClick={() => setView('list')}>Liste</button></div><div className={`explore-layout ${view}`}><div className="map-area" aria-label="Kart over Kristiansand"><MapContainer center={[58.1467, 7.9956]} zoom={13} scrollWheelZoom><TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />{results.filter((place) => place.coordinates).map((place) => <Marker position={[place.coordinates!.lat, place.coordinates!.lng]} key={place.id}><Popup><strong>{place.name}</strong><br />{isFictional(place) ? 'Fiktivt demosted' : 'Reell stedsidentitet'}<br /><button onClick={() => setSelected(place)}>Se detaljer</button></Popup></Marker>)}</MapContainer></div><div className="results" aria-live="polite">{results.length ? results.map((place) => <PlaceCard key={place.id} place={place} favorite={favorites.includes(place.id)} onFavorite={() => toggleFavorite(place.id)} onSelect={() => setSelected(place)} />) : <div className="empty-state"><h2>Ingen treff</h2><p>Prøv et annet søk eller fjern noen filtre.</p><button className="button secondary" onClick={reset}>Nullstill filtre</button></div>}</div></div>{selected && <PlaceDetails place={selected} onClose={() => setSelected(null)} />}</section>;
}

const today = () => {
  const date = new Date();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
};

function JourneySetup({ onSave }: { onSave: (profile: DemoProfile) => void }) {
  const [stage, setStage] = useState<JourneyStage>('expecting');
  const [inputMode, setInputMode] = useState<'dueDate' | 'week'>('dueDate');
  const [dueDate, setDueDate] = useState('');
  const [week, setWeek] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [ageYears, setAgeYears] = useState('');
  const [preference, setPreference] = useState<ContentPreference>('general');
  const canSave = stage !== 'expecting' || (inputMode === 'dueDate' ? Boolean(dueDate) : Number(week) >= 1 && Number(week) <= 42);
  const save = () => {
    if (!canSave) return;
    onSave({
      stage,
      ...(stage === 'expecting' && inputMode === 'dueDate' ? { dueDate } : {}),
      ...(stage === 'expecting' && inputMode === 'week' ? { enteredPregnancyWeek: Number(week), enteredWeekAnchorDate: today() } : {}),
      ...(stage === 'baby_born' && birthDate ? { childBirthDate: birthDate } : {}),
      ...(stage === 'baby_born' && ageYears ? { childAgeYears: Number(ageYears) } : {}),
      contentPreference: preference,
      notificationPreference: 'preview_only',
    });
  };
  return <div className="journey-setup card"><p className="eyebrow">Frivillig demoprofil</p><h2>Hva passer for deg nå?</h2><p className="muted">Du kan utforske kartet uten profil. Dette lagres bare lokalt i denne nettleseren.</p><div className="choice-grid"><label className="choice"><input type="radio" checked={stage === 'expecting'} onChange={() => setStage('expecting')} />Jeg venter barn</label><label className="choice"><input type="radio" checked={stage === 'baby_born'} onChange={() => setStage('baby_born')} />Jeg har fått barn</label><label className="choice"><input type="radio" checked={stage === 'prefer_not_to_say'} onChange={() => setStage('prefer_not_to_say')} />Jeg vil bare utforske</label></div>{stage === 'expecting' && <fieldset><legend>Velg én inngang</legend><div className="choice-grid"><label className="choice"><input type="radio" checked={inputMode === 'dueDate'} onChange={() => setInputMode('dueDate')} />Termindato</label><label className="choice"><input type="radio" checked={inputMode === 'week'} onChange={() => setInputMode('week')} />Svangerskapsuke</label></div>{inputMode === 'dueDate' ? <label>Termindato<input type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} /></label> : <label>Aktuell svangerskapsuke (1–42)<input type="number" min="1" max="42" value={week} onChange={(event) => setWeek(event.target.value)} /></label>}<p className="muted">Visningen er omtrentlig og ikke en klinisk vurdering.</p></fieldset>}{stage === 'baby_born' && <><label>Fødselsdato (valgfritt)<input type="date" value={birthDate} onChange={(event) => setBirthDate(event.target.value)} /></label><label>Barnets alder i hele år<select value={ageYears} onChange={(event) => setAgeYears(event.target.value)}><option value="">Velg alder (valgfritt)</option>{[0, 1, 2, 3, 4, 5].map((age) => <option value={age} key={age}>{age} år</option>)}</select></label></>}<label>Innholdspreferanse<select value={preference} onChange={(event) => setPreference(event.target.value as ContentPreference)}><option value="general">Generelt</option><option value="dad">Pappa/medforelder</option><option value="pregnant_parent">Den gravide</option><option value="both">Begge</option></select></label><button className="button primary" disabled={!canSave} onClick={save}>Lagre lokal demoprofil</button></div>;
}

function Journey({ state, onChange, onClear }: { state: DemoState; onChange: (state: DemoState) => void; onClear: () => void }) {
  const profile = state.profile;
  const week = profile ? getJourneyWeek(profile, today()) : null;
  const milestone = profile ? getCurrentMilestone(profile, today()) : null;
  const ageActivities = profile?.childAgeYears === undefined ? [] : activitiesForAge(profile.childAgeYears);
  const toggleItem = (id: string) => onChange({ ...state, checkedItemIds: state.checkedItemIds.includes(id) ? state.checkedItemIds.filter((item) => item !== id) : [...state.checkedItemIds, id] });
  if (!profile) return <section className="page"><p className="eyebrow">Min reise</p><h1>En roligere oversikt over det praktiske.</h1><p className="lead">Velg selv om du vil bruke en liten, lokal demoprofil. Ingen innlogging eller e-post er nødvendig.</p><JourneySetup onSave={(next) => onChange({ ...initialDemoState, profile: next })} /></section>;
  const relevantItems = profile.childAgeYears === undefined
    ? checklistItemsForAge(0)
    : checklistItemsForAge(profile.childAgeYears);
  return <section className="page journey"><div className="section-intro"><div><p className="eyebrow">Min reise · lokal demo</p><h1>En liten plan for hverdagen</h1></div><button className="text-button" onClick={onClear}>Tilbakestill demo</button></div><div className="journey-grid"><article className="card"><h2>Din status</h2><p>{profile.stage === 'expecting' ? `Omtrentlig svangerskapsuke ${week ?? 'ukjent'}` : profile.stage === 'baby_born' ? `Barnet er ${profile.childAgeYears === undefined ? 'født' : `${profile.childAgeYears} år`}` : 'Utforsker uten valgt fase'}</p>{profile.stage === 'baby_born' && profile.childAgeYears !== undefined && <><p>{getAgeDescription(profile.childAgeYears)}</p><p className="muted">Et generelt eksempel – barn utvikler seg ulikt.</p></>}<p className="muted">Dette er generell demo-informasjon, ikke medisinsk rådgivning.</p></article>{milestone && <article className="card milestone"><h2>{milestone.title}</h2><p>{milestone.body}</p>{milestone.pregnantParentTip && <p><strong>Råd til mor/den gravide:</strong> {milestone.pregnantParentTip}</p>}{milestone.dadTip && <p><strong>Råd til far/medforelder:</strong> {milestone.dadTip}</p>}<Link className="button secondary" to="/utforsk">Finn steder å besøke</Link></article>}</div>{profile.stage === 'baby_born' && <section className="card age-activities"><div className="section-intro"><div><h2>Aktiviteter for deres aldersgruppe</h2><p className="muted">{profile.childAgeYears === undefined ? 'Velg barnets alder på profilsiden for å få tilpassede forslag.' : `Forslag for barn på ${profile.childAgeYears} år`}</p></div><Link className="text-button" to="/profil">Endre alder</Link></div>{ageActivities.length ? <div className="activity-list">{ageActivities.map((activity) => <article className="activity-card" key={activity.id}><h3>{activity.title}</h3><p>{activity.description}</p><p className="muted">{activity.locationLabel} · {activity.ageMinYears}–{activity.ageMaxYears} år</p><span className="demo-label">Fiktiv aktivitet</span></article>)}</div> : <p>Ingen forslag for denne alderen i demoen ennå.</p>}</section>}<section className="card"><div className="section-intro"><div><h2>Sjekklister for deres aldersgruppe</h2><p className="muted">{profile.stage === 'baby_born' && profile.childAgeYears !== undefined ? `Forslag for barn på ${profile.childAgeYears} år` : 'Generelle forslag for den første tiden'}</p></div><Link className="text-button" to="/profil">Endre alder</Link></div><div className="checklist-grid">{['equipment', 'practical'].map((listId) => <div key={listId}><h3>{listId === 'equipment' ? 'Utstyr og tur' : 'Praktisk støtte'}</h3>{relevantItems.filter((item) => item.listId === listId).map((item) => <label className="check-item" key={item.id}><input type="checkbox" checked={state.checkedItemIds.includes(item.id)} onChange={() => toggleItem(item.id)} />{item.label}</label>)}</div>)}</div></section><section className="card notification-preview"><h2>Varslingsforhåndsvisning</h2><p className="demo-label">Ikke sendt – prototype</p><p>En rolig påminnelse om neste praktiske steg kan vises her. Appen sender ingen e-post eller pushvarsler.</p></section><button className="danger-button" onClick={onClear}>Slett mine demodata</button></section>;
}

function Profile({ state, onChange, onClear }: { state: DemoState; onChange: (state: DemoState) => void; onClear: () => void }) {
  const profile = state.profile;
  const updateAge = (value: string) => {
    if (!profile || profile.stage !== 'baby_born') return;
    onChange({ ...state, profile: { ...profile, childAgeYears: value === '' ? undefined : Number(value) } });
  };
  return <section className="page placeholder"><p className="eyebrow">Profil</p><h1>Din lokale demoprofil</h1><p className="lead">{profile ? 'Profilen brukes bare for å tilpasse Min reise i denne nettleseren.' : 'Du har ingen lagret demoprofil.'}</p>{profile?.stage === 'baby_born' && <div className="card profile-settings"><h2>Barnets alder</h2><label>Hvor gammelt er barnet?<select value={profile.childAgeYears ?? ''} onChange={(event) => updateAge(event.target.value)}><option value="">Velg alder (valgfritt)</option>{[0, 1, 2, 3, 4, 5].map((age) => <option value={age} key={age}>{age} år</option>)}</select></label><p className="muted">Alderen brukes bare til å vise relevante, fiktive aktivitetsforslag.</p></div>}<Link className="button primary" to="/reise">{profile ? 'Åpne Min reise' : 'Lag demoprofil'}</Link>{profile && <button className="danger-button profile-delete" onClick={onClear}>Slett demodata</button>}</section>;
}

function Placeholder({ title, text }: { title: string; text: string }) {
  return <section className="page placeholder"><p className="eyebrow">Kommer i neste fase</p><h1>{title}</h1><p className="lead">{text}</p><Link className="button primary" to="/utforsk">Utforsk kartet</Link></section>;
}

export function App() {
  const [journeyState, setJourneyState] = useState<DemoState>(readDemoState);
  const updateJourney = (next: DemoState) => { setJourneyState(next); writeDemoState(next); };
  const clearJourney = () => { clearDemoState(); setJourneyState(initialDemoState); };
  return <Shell><Routes><Route path="/" element={<Home />} /><Route path="/utforsk" element={<Explore />} /><Route path="/reise" element={<Journey state={journeyState} onChange={updateJourney} onClear={clearJourney} />} /><Route path="/guider" element={<Guides />} /><Route path="/profil" element={<Profile state={journeyState} onChange={updateJourney} onClear={clearJourney} />} /></Routes></Shell>;
}
