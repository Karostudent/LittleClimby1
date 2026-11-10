import { useMemo, useState } from 'react';
import { Link, NavLink, Route, Routes, useNavigate } from 'react-router-dom';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { categoryLabels, facilityLabels, isFictional, matchesPlace, type FacilityName, type Place, type PlaceCategory } from '../domain/places';
import { places } from '../data/places';
import { activitiesForAge } from '../data/activities';
import { checklistItemsForAge, getAgeDescription, getCurrentMilestone, getJourneyWeek, initialDemoState, kindergartenChecklistForAge, pregnancyChecklistForWeek, type ContentPreference, type DemoProfile, type DemoState, type JourneyStage } from '../domain/journey';
import { clearDemoState, readDemoState, readFavoriteIds, readFeedback, readTripPlan, readTripSelection, writeDemoState, writeFavoriteIds, writeFeedback, writeTripPlan, writeTripSelection, type DemoFeedback, type TripPlan } from '../services/storage';
import './styles.css';

const filterOptions: FacilityName[] = ['changing_table', 'stroller_space', 'step_free_access', 'changing_access_all_caregivers', 'stroller_suitable_route', 'free_activity'];

function Shell({ children }: { children: React.ReactNode }) {
  return <><header className="topbar"><Link to="/" className="brand"><img src="https://www.littleclimby.com/cdn/shop/files/Blde_logo_430x_f28bc674-bc9e-495a-898e-ed5b95cf0868.png?v=1681884793&width=220" alt="Little Climby" /><span>DEMO</span></Link><nav aria-label="Hovedmeny">{['/', '/utforsk', '/planlegg', '/reise', '/guider', '/profil'].map((path) => <NavLink key={path} to={path} end={path === '/'}>{path === '/' ? 'Hjem' : path.slice(1).replace('utforsk', 'Utforsk').replace('planlegg', 'Planlegg tur').replace('reise', 'Min reise').replace('guider', 'Guider').replace('profil', 'Profil')}</NavLink>)}</nav></header><main>{children}</main><footer>Studentprototype · Eksempeldata er ikke en offentlig tjeneste.</footer></>;
}

function Home() {
  const plan = readTripPlan();
  const plannedPlaces = plan ? plan.placeIds.map((id) => places.find((place) => place.id === id)).filter((place): place is Place => Boolean(place)) : [];
  return <section className="hero page"><p className="eyebrow">Enklere babyliv, hjemme og ute</p><h1>Finn et sted som passer dere.</h1><p className="lead">Utforsk Kristiansand med tydelig informasjon om hva som er kjent, ukjent og bare demonstrert.</p><div className="actions"><Link className="button primary" to="/utforsk">Finn babyvennlige steder</Link><Link className="button secondary" to="/planlegg">Planlegg en tur</Link></div>{plannedPlaces.length > 0 && <article className="card home-plan"><p className="eyebrow">Neste tur</p><h2>{plannedPlaces.length} stopp planlagt</h2><p>{plannedPlaces.map((place) => place.name).join(' · ')}</p><p>{plan?.date ? `Planlagt ${new Date(`${plan.date}T12:00:00`).toLocaleDateString('nb-NO', { day: 'numeric', month: 'long' })}` : 'Dato ikke valgt'}</p><Link className="text-button" to="/planlegg">Åpne turplanen</Link></article>}<div className="card-grid"><article className="card"><h2>Tryggere valg</h2><p>Se fasiliteter med ja, nei eller ukjent – vi gjetter ikke.</p></article><article className="card"><h2>Fra valg til handling</h2><p>Lagre flere stopp og gjør dem om til en enkel plan dere kan ta med videre.</p></article></div><FeedbackCard /></section>;
}

function FeedbackCard() {
  const [feedback, setFeedback] = useState<DemoFeedback | null>(readFeedback);
  const [rating, setRating] = useState<DemoFeedback['rating']>('useful');
  const [comment, setComment] = useState('');
  const save = () => {
    const next = { rating, comment };
    writeFeedback(next);
    setFeedback(next);
  };
  if (feedback) return <section className="card feedback-card" aria-live="polite"><p className="eyebrow">Takk for testen</p><h2>Tilbakemeldingen er lagret lokalt</h2><p>Dette er en prototype – ingen data sendes videre.</p><button className="text-button" onClick={() => setFeedback(null)}>Endre svar</button></section>;
  return <section className="card feedback-card"><p className="eyebrow">Hjelp oss å teste</p><h2>Hvordan opplevdes førsteinntrykket?</h2><div className="feedback-options" role="group" aria-label="Tilbakemelding"><button className={rating === 'useful' ? 'selected' : ''} onClick={() => setRating('useful')}>Nyttig</button><button className={rating === 'unclear' ? 'selected' : ''} onClick={() => setRating('unclear')}>Litt uklart</button><button className={rating === 'missing' ? 'selected' : ''} onClick={() => setRating('missing')}>Savner noe</button></div><label>En kort kommentar (valgfritt)<textarea value={comment} onChange={(event) => setComment(event.target.value)} rows={3} placeholder="Hva ville gjort appen enda bedre?" /></label><button className="button primary" onClick={save}>Lagre tilbakemelding</button></section>;
}

function TrustNote() {
  return <aside className="trust-note" aria-label="Om data og demo"><strong>Slik leser du informasjonen</strong><span><b className="legend-dot confirmed" />Bekreftet av oppføringens kilde</span><span><b className="legend-dot unknown" />Ukjent betyr at vi ikke har bevis</span><span><b className="legend-dot demo" />Fiktivt demosted er kun eksempeldata</span></aside>;
}

function Guides() {
  return <section className="page guides"><div className="section-intro"><div><p className="eyebrow">Guider og Pappasporet</p><h1>Praktisk støtte, uten fasit.</h1></div><Link className="button secondary" to="/utforsk">Finn steder</Link></div><p className="lead">Korte, generelle forslag for pappa, medforelder og andre omsorgspersoner. Innholdet er ikke medisinsk rådgivning.</p><div className="guide-grid"><article className="card guide-card"><p className="eyebrow">Pappasporet</p><h2>Pappa og baby på tur</h2><p>Velg et sted med enkel adkomst, og sjekk fasiliteter før dere drar. En plan B kan være å snu eller ta en kortere tur.</p><ul><li>Ta med det dere faktisk bruker.</li><li>Finn ut hvem som kan hjelpe hvis dagen endrer seg.</li><li>La begge omsorgspersoner få eie sin måte å gjøre ting på.</li></ul><Link className="text-button" to="/reise">Se praktiske sjekklister</Link></article><article className="card guide-card"><p className="eyebrow">På tur med baby</p><h2>Gjør første tur enkel</h2><p>Start med et rolig mål og god tid. Kartet viser fasilitetsstatus der den er kjent, men tilgjengelighet kan endre seg.</p><ul><li>Se etter plass til barnevogn.</li><li>Bruk listevisningen hvis kartfliser ikke lastes.</li><li>Åpne ekstern karttjeneste for vei – dette er ikke appens egen ruteplanlegger.</li></ul><Link className="text-button" to="/utforsk">Åpne kartet</Link></article></div><section className="card activities"><div className="section-intro"><div><p className="eyebrow">Enkel aktivitetsoversikt</p><h2>Aktiviteter i demoen</h2></div><span className="demo-label">Demodata</span></div><p>Dette er fiktive kort for å vise hvordan aktiviteter kan presenteres. Ingen datoer eller påmeldinger er reelle.</p><div className="activity-list">{places.filter((place) => place.category === 'activity').map((place) => <article className="activity-card" key={place.id}><h3>{place.name}</h3><p className="muted">{place.addressOrArea} · Gratis i demoen</p><span className="demo-label">Fiktiv aktivitet</span><p>{place.shortDescription}</p></article>)}</div></section><p className="source-note">Kunnskapskortene er generelle designhypoteser for studentprototypen. De skal kvalitetssikres før eventuell produksjonsbruk.</p></section>;
}

function PlaceCard({ place, favorite, onFavorite, onSelect }: { place: Place; favorite: boolean; onFavorite: () => void; onSelect: () => void }) {
  return <article className="place-card"><div className="card-heading"><div><h3>{place.name}</h3><p className="muted">{categoryLabels[place.category]} · {place.addressOrArea}</p></div><button className="icon-button" aria-label={favorite ? `Fjern ${place.name} fra favoritter` : `Lagre ${place.name} som favoritt`} onClick={onFavorite}>{favorite ? '★' : '☆'}</button></div>{isFictional(place) && <span className="demo-label">Fiktivt demosted</span>}<p>{place.shortDescription}</p>{place.routeInfo && <p className="route-summary"><strong>{place.routeInfo.lengthKm} km</strong> · {place.routeInfo.surfaceText} · Ikke verifisert</p>}<div className="facility-list">{Object.entries(place.facilities).slice(0, 3).map(([name, claim]) => <span className={`status ${claim?.value}`} key={name}>{claim?.value === 'yes' ? 'Ja' : claim?.value === 'no' ? 'Nei' : 'Ukjent'} · {facilityLabels[name as FacilityName]}</span>)}</div><button className="text-button" onClick={onSelect}>Se detaljer</button></article>;
}

function TripSelectionBar({ selectedIds, onToggle, onCreatePlan }: { selectedIds: string[]; onToggle: (id: string) => void; onCreatePlan: () => void }) {
  return <aside className="trip-selection" aria-label="Valgte stopp for turplan"><div><strong>{selectedIds.length}/3 stopp valgt</strong><p className="muted">{selectedIds.length ? 'Velg opptil tre steder og lag en samlet turplan.' : 'Velg steder fra listen for å bygge en tur.'}</p></div><div className="trip-selection-actions">{selectedIds.length > 0 && <button className="text-button" onClick={() => selectedIds.forEach(onToggle)}>Nullstill valg</button>}<button className="button primary" disabled={!selectedIds.length} onClick={onCreatePlan}>Lag turplan</button></div></aside>;
}

function PlaceDetails({ place, onClose }: { place: Place; onClose: () => void }) {
  return <div className="detail-panel" role="dialog" aria-modal="true" aria-labelledby="detail-title"><button className="close-button" onClick={onClose}>Lukk</button><h2 id="detail-title">{place.name}</h2>{isFictional(place) ? <p className="demo-label">Fiktivt demosted – kun eksempeldata</p> : <p className="verified-label">Reell stedsidentitet · fasiliteter må verifiseres separat</p>}<p className="muted">{place.addressOrArea}</p><p>{place.shortDescription}</p>{place.routeInfo && <p className="route-summary"><strong>Rute:</strong> {place.routeInfo.lengthKm} km · {place.routeInfo.surfaceText}. Rutedata er ikke verifisert.</p>}<h3>Fasiliteter</h3><ul>{Object.entries(place.facilities).map(([name, claim]) => <li key={name}><strong>{facilityLabels[name as FacilityName]}:</strong> {claim?.value === 'yes' ? 'Ja' : claim?.value === 'no' ? 'Nei' : 'Ukjent'}{claim?.note ? ` – ${claim.note}` : ''}</li>)}</ul>{place.identitySourceUrl && <p><a href={place.identitySourceUrl} target="_blank" rel="noreferrer">Kilde for stedsidentitet (ekstern)</a></p>}{place.coordinates && !isFictional(place) && <a className="button secondary" href={`https://www.openstreetmap.org/?mlat=${place.coordinates.lat}&mlon=${place.coordinates.lng}#map=17/${place.coordinates.lat}/${place.coordinates.lng}`} target="_blank" rel="noreferrer">Vis vei (ekstern)</a>}</div>;
}

function Explore() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<PlaceCategory | 'all'>('all');
  const [filters, setFilters] = useState<FacilityName[]>([]);
  const [view, setView] = useState<'map' | 'list'>('map');
  const [selected, setSelected] = useState<Place | null>(null);
  const [favorites, setFavorites] = useState(readFavoriteIds);
  const [tripSelection, setTripSelection] = useState(readTripSelection);
  const navigate = useNavigate();
  const results = useMemo(() => places.filter((place) => matchesPlace(place, search, category, filters)), [search, category, filters]);
  const toggleFavorite = (id: string) => { const next = favorites.includes(id) ? favorites.filter((item) => item !== id) : [...favorites, id]; setFavorites(next); writeFavoriteIds(next); };
  const reset = () => { setSearch(''); setCategory('all'); setFilters([]); };
  const toggleTripSelection = (id: string) => {
    const next = tripSelection.includes(id)
      ? tripSelection.filter((item) => item !== id)
      : tripSelection.length < 3 ? [...tripSelection, id] : tripSelection;
    setTripSelection(next);
    writeTripSelection(next);
  };
  const createTripPlan = () => { writeTripSelection(tripSelection); navigate('/planlegg'); };
  return <section className="page explore"><div className="section-intro"><div><p className="eyebrow">Kristiansand og nærområdene</p><h1>Utforsk steder</h1></div><span className="result-count">{results.length} treff</span></div><TrustNote /><TripSelectionBar selectedIds={tripSelection} onToggle={toggleTripSelection} onCreatePlan={createTripPlan} /><div className="controls"><label>Søk<input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Navn, område eller tag" /></label><label>Kategori<select value={category} onChange={(event) => setCategory(event.target.value as PlaceCategory | 'all')}><option value="all">Alle kategorier</option>{Object.entries(categoryLabels).map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label><div className="filter-group"><span className="label">Filtre</span>{filterOptions.map((filter) => <label className="checkbox" key={filter}><input type="checkbox" checked={filters.includes(filter)} onChange={() => setFilters(filters.includes(filter) ? filters.filter((item) => item !== filter) : [...filters, filter])} />{facilityLabels[filter]}</label>)}</div><button className="text-button" onClick={reset}>Nullstill filtre</button></div><div className="view-toggle" role="group" aria-label="Visning"><button className={view === 'map' ? 'active' : ''} onClick={() => setView('map')}>Kart</button><button className={view === 'list' ? 'active' : ''} onClick={() => setView('list')}>Liste</button></div><div className={`explore-layout ${view}`}><div className="map-area" aria-label="Kart over Kristiansand"><MapContainer center={[58.1467, 7.9956]} zoom={13} scrollWheelZoom><TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />{results.filter((place) => place.coordinates).map((place) => <Marker position={[place.coordinates!.lat, place.coordinates!.lng]} key={place.id}><Popup><strong>{place.name}</strong><br />{isFictional(place) ? 'Fiktivt demosted' : 'Reell stedsidentitet'}<br /><button onClick={() => setSelected(place)}>Se detaljer</button></Popup></Marker>)}</MapContainer></div><div className="results" aria-live="polite">{results.length ? results.map((place) => <div className="place-card" key={place.id}><PlaceCard place={place} favorite={favorites.includes(place.id)} onFavorite={() => toggleFavorite(place.id)} onSelect={() => setSelected(place)} /><button className={`trip-add-button ${tripSelection.includes(place.id) ? 'selected' : ''}`} onClick={() => toggleTripSelection(place.id)} disabled={!tripSelection.includes(place.id) && tripSelection.length >= 3}>{tripSelection.includes(place.id) ? '✓ Valgt til turplan' : 'Legg til turplan'}</button></div>) : <div className="empty-state"><h2>Ingen treff</h2><p>Prøv et annet søk eller fjern noen filtre.</p><button className="button secondary" onClick={reset}>Nullstill filtre</button></div>}</div></div>{selected && <PlaceDetails place={selected} onClose={() => setSelected(null)} />}</section>;
}

function TripPlanner() {
  const [plan, setPlan] = useState<TripPlan | null>(readTripPlan);
  const savedSelection = readTripSelection();
  const [placeIds, setPlaceIds] = useState(savedSelection.length > 0 ? savedSelection : plan?.placeIds ?? []);
  const [date, setDate] = useState(plan?.date ?? '');
  const [note, setNote] = useState(plan?.note ?? '');
  const selectedPlaces = placeIds.map((id) => places.find((place) => place.id === id)).filter((place): place is Place => Boolean(place));
  const togglePlace = (id: string) => setPlaceIds((current) => {
    const next = current.includes(id) ? current.filter((item) => item !== id) : current.length < 3 ? [...current, id] : current;
    writeTripSelection(next);
    return next;
  });
  const save = () => {
    const next = { placeIds, date, note };
    writeTripPlan(next);
    setPlan(next);
    writeTripSelection(placeIds);
  };
  return <section className="page trip-planner"><div className="section-intro"><div><p className="eyebrow">Fra utforskning til plan</p><h1>Planlegg en liten tur</h1></div><Link className="button secondary" to="/utforsk">Velg flere stopp</Link></div><p className="lead">Sett sammen opptil tre stopp fra Utforsk, legg til en dato og skriv én ting som er viktig for dere. Rekkefølgen i listen blir rekkefølgen på turplanen.</p><div className="planner-grid"><section className="card"><h2>Valgte stopp</h2>{selectedPlaces.length === 0 ? <p className="muted">Ingen stopp valgt ennå. Gå tilbake til Utforsk og velg opptil tre steder.</p> : <div className="selected-stops">{selectedPlaces.map((place, index) => <div className="selected-stop" key={place.id}><span className="stop-number">{index + 1}</span><div><strong>{place.name}</strong><p className="muted">{categoryLabels[place.category]} · {place.addressOrArea}</p></div><button className="text-button" onClick={() => togglePlace(place.id)}>Fjern</button></div>)}</div>}<label>Når passer det?<input type="date" value={date} onChange={(event) => setDate(event.target.value)} /></label><label>Hva vil dere huske?<textarea rows={4} value={note} onChange={(event) => setNote(event.target.value)} placeholder="For eksempel: ta med ekstra skift og finn en rolig benk." /></label><button className="button primary" disabled={!selectedPlaces.length} onClick={save}>Lagre samlet turplan</button></section><section className="card plan-preview"><p className="eyebrow">Turens stopp</p>{selectedPlaces.length === 0 ? <h2>Velg stopp i Utforsk</h2> : <ol className="plan-stop-list">{selectedPlaces.map((place) => <li key={place.id}><h2>{place.name}</h2><p className="muted">{place.addressOrArea} · {categoryLabels[place.category]}</p><p>{place.shortDescription}</p>{place.routeInfo && <p className="route-summary"><strong>Trilletur:</strong> {place.routeInfo.lengthKm} km · {place.routeInfo.surfaceText}</p>}<ul>{Object.entries(place.facilities).slice(0, 4).map(([name, claim]) => <li key={name}><strong>{facilityLabels[name as FacilityName]}:</strong> {claim?.value === 'yes' ? 'Ja' : claim?.value === 'no' ? 'Nei' : 'Ukjent'}</li>)}</ul></li>)}</ol>}{plan && <p className="saved-note" role="status">Samlet turplan er lagret lokalt.</p>}</section></div></section>;
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
  const kindergartenItems = profile?.stage === 'baby_born' && profile.childAgeYears !== undefined
    ? kindergartenChecklistForAge(profile.childAgeYears)
    : [];
  const pregnancyItems = profile?.stage === 'expecting' && week ? pregnancyChecklistForWeek(week) : [];
  const toggleItem = (id: string) => onChange({ ...state, checkedItemIds: state.checkedItemIds.includes(id) ? state.checkedItemIds.filter((item) => item !== id) : [...state.checkedItemIds, id] });
  if (!profile) return <section className="page"><p className="eyebrow">Min reise</p><h1>En roligere oversikt over det praktiske.</h1><p className="lead">Velg selv om du vil bruke en liten, lokal demoprofil. Ingen innlogging eller e-post er nødvendig.</p><JourneySetup onSave={(next) => onChange({ ...initialDemoState, profile: next })} /></section>;
  const relevantItems = profile.childAgeYears === undefined
    ? checklistItemsForAge(0)
    : checklistItemsForAge(profile.childAgeYears);
  return <section className="page journey"><div className="section-intro"><div><p className="eyebrow">Min reise · lokal demo</p><h1>En liten plan for hverdagen</h1></div><button className="text-button" onClick={onClear}>Tilbakestill demo</button></div><div className="journey-grid"><article className="card"><h2>Din status</h2><p>{profile.stage === 'expecting' ? `Omtrentlig svangerskapsuke ${week ?? 'ukjent'}` : profile.stage === 'baby_born' ? `Barnet er ${profile.childAgeYears === undefined ? 'født' : `${profile.childAgeYears} år`}` : 'Utforsker uten valgt fase'}</p>{profile.stage === 'baby_born' && profile.childAgeYears !== undefined && <><p>{getAgeDescription(profile.childAgeYears)}</p><p className="muted">Et generelt eksempel – barn utvikler seg ulikt.</p></>}<p className="muted">Dette er generell demo-informasjon, ikke medisinsk rådgivning.</p></article>{milestone && <article className="card milestone"><h2>{milestone.title}</h2><p>{milestone.body}</p>{milestone.pregnantParentTip && <p><strong>Råd til mor/den gravide:</strong> {milestone.pregnantParentTip}</p>}{milestone.dadTip && <p><strong>Råd til far/medforelder:</strong> {milestone.dadTip}</p>}<Link className="button secondary" to="/utforsk">Finn steder å besøke</Link></article>}</div>{profile.stage === 'expecting' && week && <section className="card pregnancy-source-card"><div className="section-intro"><div><p className="eyebrow">Praktiske steg fra uke {week}</p><h2>Forberedelser dere kan vurdere</h2></div><span className="demo-label">Kildebelagte prototypetips</span></div><p className="muted">Dette er praktiske påminnelser, ikke medisinske råd. Snakk med jordmor eller annet helsepersonell om spørsmål som gjelder helse eller oppfølging.</p><div className="checklist-grid">{['practical', 'preparation', 'economy', 'work'].map((category) => <div key={category}><h3>{{ practical: 'Praktisk', preparation: 'Forberedelse', economy: 'Økonomi', work: 'Jobb og studier' }[category as 'practical' | 'preparation' | 'economy' | 'work']}</h3>{pregnancyItems.filter((item) => item.category === category).map((item) => <label className="check-item" key={item.id}><input type="checkbox" checked={state.checkedItemIds.includes(item.id)} onChange={() => toggleItem(item.id)} />{item.label}</label>)}</div>)}</div><p className="source-note">Kilde: <a href="https://www.gravidhjelpen.no/sjekkliste" target="_blank" rel="noreferrer">Gravidhjelpen – sjekkliste</a>. Innholdet er bearbeidet og avgrenset for studentprototypen.</p></section>}{profile.stage === 'baby_born' && <section className="card age-activities"><div className="section-intro"><div><h2>Aktiviteter for deres aldersgruppe</h2><p className="muted">{profile.childAgeYears === undefined ? 'Velg barnets alder på profilsiden for å få tilpassede forslag.' : `Forslag for barn på ${profile.childAgeYears} år`}</p></div><Link className="text-button" to="/profil">Endre alder</Link></div>{ageActivities.length ? <div className="activity-list">{ageActivities.map((activity) => <article className="activity-card" key={activity.id}><h3>{activity.title}</h3><p>{activity.description}</p><p className="muted">{activity.locationLabel} · {activity.ageMinYears}–{activity.ageMaxYears} år</p><span className="demo-label">Fiktiv aktivitet</span></article>)}</div> : <p>Ingen forslag for denne alderen i demoen ennå.</p>}</section>}{profile.stage === 'baby_born' && kindergartenItems.length > 0 && <section className="card kindergarten-source-card"><div className="section-intro"><div><p className="eyebrow">Forbered barnehagestart</p><h2>Praktisk sjekkliste for barnehagebarn</h2></div><span className="demo-label">Alder 3–5 år</span></div><p className="muted">Tipsene er forslag, ikke en universell kravliste. Sjekk også hva deres barnehage ønsker at barnet har med.</p><div className="checklist-grid">{['clothing', 'comfort', 'routine'].map((category) => <div key={category}><h3>{{ clothing: 'Klær og vær', comfort: 'Trygghet', routine: 'Rutiner' }[category as 'clothing' | 'comfort' | 'routine']}</h3>{kindergartenItems.filter((item) => item.category === category).map((item) => <label className="check-item" key={item.id}><input type="checkbox" checked={state.checkedItemIds.includes(item.id)} onChange={() => toggleItem(item.id)} />{item.label}</label>)}</div>)}</div><p className="source-note">Kilde: <a href="https://laringsverkstedet.no/barnehagestart/kl%C3%A6r-og-utstyrsliste" target="_blank" rel="noreferrer">Læringsverkstedet – klær og utstyrsliste</a>. Innholdet er bearbeidet for studentprototypen.</p></section>}<section className="card"><div className="section-intro"><div><h2>Sjekklister for deres aldersgruppe</h2><p className="muted">{profile.stage === 'baby_born' && profile.childAgeYears !== undefined ? `Forslag for barn på ${profile.childAgeYears} år` : 'Generelle forslag for den første tiden'}</p></div><Link className="text-button" to="/profil">Endre alder</Link></div><div className="checklist-grid">{['equipment', 'practical'].map((listId) => <div key={listId}><h3>{listId === 'equipment' ? 'Utstyr og tur' : 'Praktisk støtte'}</h3>{relevantItems.filter((item) => item.listId === listId).map((item) => <label className="check-item" key={item.id}><input type="checkbox" checked={state.checkedItemIds.includes(item.id)} onChange={() => toggleItem(item.id)} />{item.label}</label>)}</div>)}</div></section><section className="card notification-preview"><h2>Varslingsforhåndsvisning</h2><p className="demo-label">Ikke sendt – prototype</p><p>En rolig påminnelse om neste praktiske steg kan vises her. Appen sender ingen e-post eller pushvarsler.</p></section><button className="danger-button" onClick={onClear}>Slett mine demodata</button></section>;
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
  return <Shell><Routes><Route path="/" element={<Home />} /><Route path="/utforsk" element={<Explore />} /><Route path="/planlegg" element={<TripPlanner />} /><Route path="/reise" element={<Journey state={journeyState} onChange={updateJourney} onClear={clearJourney} />} /><Route path="/guider" element={<Guides />} /><Route path="/profil" element={<Profile state={journeyState} onChange={updateJourney} onClear={clearJourney} />} /></Routes></Shell>;
}
