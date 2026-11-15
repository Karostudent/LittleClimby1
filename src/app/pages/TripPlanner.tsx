import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { places } from '../../data/places';
import { categoryLabels, directionsUrl, isFictional, type Place } from '../../domain/places';
import { readTripPlan, writeTripPlan, type TripPlan } from '../../services/storage';
import type { TripSelection } from '../App';
import { DataBadge, Icon, PageHeader, usePageTitle } from '../ui';

export function TripPlanner({ trip }: { trip: TripSelection }) {
  usePageTitle('Planlegg tur');
  const [plan, setPlan] = useState<TripPlan | null>(readTripPlan);
  const [date, setDate] = useState(plan?.date ?? '');
  const [note, setNote] = useState(plan?.note ?? '');
  const [saved, setSaved] = useState(false);

  // Har brukeren en lagret plan, men ikke noe nytt utvalg, viser vi den lagrede planen.
  useEffect(() => {
    if (trip.ids.length === 0 && plan?.placeIds.length) trip.set(plan.placeIds);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stops = trip.ids.map((id) => places.find((place) => place.id === id)).filter((place): place is Place => Boolean(place));
  const demoStops = stops.filter(isFictional);
  const allReal = stops.length > 0 && demoStops.length === 0 && stops.every((place) => place.coordinates);

  const move = (index: number, delta: number) => {
    const next = [...trip.ids];
    const [item] = next.splice(index, 1);
    next.splice(index + delta, 0, item);
    trip.set(next);
    setSaved(false);
  };

  const save = () => {
    const next = { placeIds: trip.ids, date, note };
    writeTripPlan(next);
    setPlan(next);
    setSaved(true);
  };

  return (
    <>
      <PageHeader title="Planlegg en liten tur" lead="Velg opptil tre stopp. Planen lagres bare på denne enheten." />
      <div className="page two-col">
        <section className="stack" aria-labelledby="stops-title">
          <div className="row" style={{ justifyContent: 'space-between', alignItems: 'baseline' }}>
            <h2 id="stops-title">Stopp</h2>
            <p className="muted">{stops.length} av 3</p>
          </div>
          {stops.length === 0 ? (
            <div className="card">
              <p>Ingen stopp valgt ennå.</p>
              <Link className="btn btn-secondary" to="/utforsk">Finn steder i Utforsk</Link>
            </div>
          ) : (
            <ol className="stack" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {stops.map((place, index) => (
                <li key={place.id} className="card stop">
                  <span className="stop-num" aria-hidden="true">{index + 1}</span>
                  <div className="stop-body">
                    <Link to={`/utforsk/${place.id}`} style={{ fontWeight: 800, color: 'var(--ink)' }}>{place.name}</Link>
                    <span className="muted small">{categoryLabels[place.category]} · {place.addressOrArea}</span>
                    <DataBadge real={!isFictional(place)} />
                  </div>
                  <div className="stop-actions">
                    {index > 0 && <button className="icon-btn" onClick={() => move(index, -1)} aria-label={`Flytt ${place.name} opp`}><Icon name="up" strokeWidth={2.4} /></button>}
                    {index < stops.length - 1 && <button className="icon-btn" onClick={() => move(index, 1)} aria-label={`Flytt ${place.name} ned`}><Icon name="down" strokeWidth={2.4} /></button>}
                    <button className="icon-btn" onClick={() => { trip.toggle(place.id); setSaved(false); }} aria-label={`Fjern ${place.name} fra turen`}><Icon name="close" strokeWidth={2.4} /></button>
                  </div>
                </li>
              ))}
            </ol>
          )}
          {stops.length > 0 && stops.length < 3 && <Link className="text-link" to="/utforsk"><Icon name="plus" size={18} strokeWidth={2.4} />Legg til ett stopp til</Link>}
        </section>

        <div className="stack" style={{ gap: 20 }}>
          <section className="stack" aria-labelledby="details-title">
            <h2 id="details-title">Detaljer</h2>
            <label className="field">Når passer det?
              <input className="input" type="date" value={date} onChange={(event) => { setDate(event.target.value); setSaved(false); }} />
            </label>
            <label className="field">Hva vil dere huske?
              <span className="hint">Valgfritt</span>
              <textarea className="input" rows={3} value={note} onChange={(event) => { setNote(event.target.value); setSaved(false); }} placeholder="For eksempel: ekstra skift og noe varmt å drikke" />
            </label>
          </section>

          {stops.length > 0 && !allReal && (
            <section className="card card-warn" aria-labelledby="route-title">
              <Icon name="info" size={22} />
              <div className="stack" style={{ gap: 4 }}>
                <h2 id="route-title" style={{ fontSize: '1rem' }}>Veibeskrivelse for hele turen</h2>
                <p>Kommer når alle stoppene er reelle steder. {demoStops.map((place) => place.name).join(' og ')} er eksempeldata og har ingen ekte adresse.</p>
              </div>
            </section>
          )}

          <div className="stack">
            <button className="btn btn-primary" disabled={stops.length === 0} onClick={save}>Lagre turplanen</button>
            {allReal && (
              <a className="btn btn-secondary" href={directionsUrl(stops.map((place) => place.coordinates!))} target="_blank" rel="noreferrer">
                <Icon name="navigate" />Start turen i kartappen<span className="vh"> (åpnes i ny fane)</span>
              </a>
            )}
            <div role="status">{saved && <p className="status-msg">Turplanen er lagret i denne nettleseren.</p>}</div>
          </div>
        </div>
      </div>
    </>
  );
}
