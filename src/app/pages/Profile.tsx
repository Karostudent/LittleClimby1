import { useState } from 'react';
import { Link } from 'react-router-dom';
import { places } from '../../data/places';
import { formatAgeMonths, type ContentPreference, type DemoState } from '../../domain/journey';
import { readFavoriteIds } from '../../services/storage';
import { Icon, PageHeader, usePageTitle } from '../ui';

export function Profile({ state, onChange, onClear }: { state: DemoState; onChange: (state: DemoState) => void; onClear: () => void }) {
  usePageTitle('Profil');
  const profile = state.profile;
  const [confirming, setConfirming] = useState(false);
  const [cleared, setCleared] = useState(false);
  const favorites = readFavoriteIds().map((id) => places.find((place) => place.id === id)).filter((place) => place !== undefined);

  const updateAge = (value: string) => {
    if (!profile) return;
    onChange({ ...state, profile: { ...profile, childAgeMonths: value === '' ? undefined : Number(value) } });
  };
  const updatePreference = (value: ContentPreference) => {
    if (!profile) return;
    onChange({ ...state, profile: { ...profile, contentPreference: value } });
  };

  return (
    <>
      <PageHeader title="Profil" lead="Brukes bare til å tilpasse appen i denne nettleseren." />
      <div className="page page-narrow">
        {profile ? (
          <section className="card" aria-labelledby="child-title" style={{ gap: 14 }}>
            <h2 id="child-title">Om barnet</h2>
            {profile.stage === 'baby_born' && (
              <label className="field">Barnets alder
                <select className="input" value={profile.childAgeMonths ?? ''} onChange={(event) => updateAge(event.target.value)}>
                  <option value="">Velg alder (valgfritt)</option>
                  {Array.from({ length: 13 }, (_, months) => <option key={months} value={months}>{formatAgeMonths(months)}</option>)}
                </select>
              </label>
            )}
            <label className="field">Hva vil du helst lese om?
              <select className="input" value={profile.contentPreference} onChange={(event) => updatePreference(event.target.value as ContentPreference)}>
                <option value="general">Generelt</option>
                <option value="dad">For far eller medforelder</option>
                <option value="pregnant_parent">For den som er gravid eller har født</option>
                <option value="both">Begge deler</option>
              </select>
            </label>
          </section>
        ) : (
          <section className="card">
            <h2>Ingen profil ennå</h2>
            <p>Sett opp Min baby for å få forslag som passer barnets alder.</p>
            <Link className="btn btn-secondary" to="/reise">Sett opp Min baby</Link>
          </section>
        )}

        <section className="stack" aria-labelledby="fav-title">
          <h2 id="fav-title">Lagrede steder</h2>
          {favorites.length ? (
            <div className="card menu-list">
              {favorites.map((place) => <Link key={place.id} to={`/utforsk/${place.id}`}>{place.name}<Icon name="chevron" size={18} strokeWidth={2.4} /></Link>)}
            </div>
          ) : <p className="muted">Ingen lagrede steder. Trykk «Lagre» på et sted for å finne det igjen her.</p>}
        </section>

        <nav className="card menu-list" aria-label="Mer i appen">
          <Link to="/guider">Guider og Pappasporet<Icon name="chevron" size={18} strokeWidth={2.4} /></Link>
          <Link to="/partnere">Partnertilbud<Icon name="chevron" size={18} strokeWidth={2.4} /></Link>
        </nav>

        <section className="card card-mint" aria-labelledby="privacy-title">
          <h2 id="privacy-title" className="row" style={{ alignItems: 'center', gap: 8 }}><Icon name="lock" />Personvern</h2>
          <p>Ingen innlogging. Alder, favoritter, turplaner og meldinger lagres bare i denne nettleseren og sendes ikke til oss.</p>
          {!confirming ? (
            <button className="btn btn-danger" onClick={() => { setConfirming(true); setCleared(false); }}>Slett alle mine data</button>
          ) : (
            <div className="stack">
              <p><strong>Er du sikker?</strong> Dette kan ikke angres.</p>
              <div className="row">
                <button className="btn btn-danger" onClick={() => { onClear(); setConfirming(false); setCleared(true); }}>Ja, slett alt</button>
                <button className="btn btn-outline" onClick={() => setConfirming(false)}>Avbryt</button>
              </div>
            </div>
          )}
          <div role="status">{cleared && <p className="status-msg">Alle dine data er slettet fra denne nettleseren.</p>}</div>
        </section>
      </div>
    </>
  );
}
