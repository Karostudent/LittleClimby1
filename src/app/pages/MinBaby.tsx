import { useState } from 'react';
import { Link } from 'react-router-dom';
import { activitiesForAge } from '../../data/activities';
import {
  checklistItemsForAge, formatAgeMonths, getAgeDescription, getChildAgeMonths, getCurrentMilestone, getJourneyWeek,
  initialDemoState, pregnancyChecklistForWeek, type ContentPreference, type DemoProfile, type DemoState, type JourneyStage,
} from '../../domain/journey';
import { Icon, PageHeader, today, usePageTitle } from '../ui';

const ageOptions = Array.from({ length: 13 }, (_, months) => months);

function JourneySetup({ onSave }: { onSave: (profile: DemoProfile) => void }) {
  const [stage, setStage] = useState<JourneyStage>('baby_born');
  const [inputMode, setInputMode] = useState<'dueDate' | 'week'>('dueDate');
  const [dueDate, setDueDate] = useState('');
  const [week, setWeek] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [ageMonths, setAgeMonths] = useState('');
  const [preference, setPreference] = useState<ContentPreference>('general');
  const canSave = stage !== 'expecting' || (inputMode === 'dueDate' ? Boolean(dueDate) : Number(week) >= 1 && Number(week) <= 42);

  const save = () => {
    if (!canSave) return;
    onSave({
      stage,
      ...(stage === 'expecting' && inputMode === 'dueDate' ? { dueDate } : {}),
      ...(stage === 'expecting' && inputMode === 'week' ? { enteredPregnancyWeek: Number(week), enteredWeekAnchorDate: today() } : {}),
      ...(stage === 'baby_born' && birthDate ? { childBirthDate: birthDate } : {}),
      ...(stage === 'baby_born' && ageMonths !== '' ? { childAgeMonths: Number(ageMonths) } : {}),
      contentPreference: preference,
      notificationPreference: 'preview_only',
    });
  };

  return (
    <form className="card stack" style={{ gap: 18 }} onSubmit={(event) => { event.preventDefault(); save(); }}>
      <h2>Hva passer for deg nå?</h2>
      <p className="muted">Frivillig. Det du velger, lagres bare i denne nettleseren.</p>
      <fieldset className="stack" style={{ gap: 4 }}>
        <legend className="field" style={{ marginBottom: 4 }}>Hvor er dere?</legend>
        <label className="check"><input type="radio" name="stage" checked={stage === 'baby_born'} onChange={() => setStage('baby_born')} />Vi har fått barn</label>
        <label className="check"><input type="radio" name="stage" checked={stage === 'expecting'} onChange={() => setStage('expecting')} />Vi venter barn</label>
        <label className="check"><input type="radio" name="stage" checked={stage === 'prefer_not_to_say'} onChange={() => setStage('prefer_not_to_say')} />Jeg vil bare se meg rundt</label>
      </fieldset>

      {stage === 'baby_born' && (
        <>
          <label className="field">Barnets alder
            <select className="input" value={ageMonths} onChange={(event) => setAgeMonths(event.target.value)}>
              <option value="">Velg alder (valgfritt)</option>
              {ageOptions.map((months) => <option key={months} value={months}>{formatAgeMonths(months)}</option>)}
            </select>
          </label>
          <label className="field">Eller fødselsdato
            <span className="hint">Valgfritt. Da regner vi ut alderen for deg.</span>
            <input className="input" type="date" value={birthDate} onChange={(event) => setBirthDate(event.target.value)} />
          </label>
        </>
      )}

      {stage === 'expecting' && (
        <fieldset className="stack" style={{ gap: 10 }}>
          <legend className="field" style={{ marginBottom: 4 }}>Hvordan vil du oppgi tidspunktet?</legend>
          <div className="row">
            <label className="check"><input type="radio" name="mode" checked={inputMode === 'dueDate'} onChange={() => setInputMode('dueDate')} />Termindato</label>
            <label className="check"><input type="radio" name="mode" checked={inputMode === 'week'} onChange={() => setInputMode('week')} />Svangerskapsuke</label>
          </div>
          {inputMode === 'dueDate'
            ? <label className="field">Termindato<input className="input" type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} required /></label>
            : <label className="field">Svangerskapsuke (1–42)<input className="input" type="number" min={1} max={42} value={week} onChange={(event) => setWeek(event.target.value)} required /></label>}
          <p className="hint">Uken er omtrentlig og ikke en medisinsk vurdering.</p>
        </fieldset>
      )}

      <label className="field">Hva vil du helst lese om?
        <select className="input" value={preference} onChange={(event) => setPreference(event.target.value as ContentPreference)}>
          <option value="general">Generelt</option>
          <option value="dad">For far eller medforelder</option>
          <option value="pregnant_parent">For den som er gravid eller har født</option>
          <option value="both">Begge deler</option>
        </select>
      </label>
      <button className="btn btn-primary" type="submit" disabled={!canSave}>Lagre</button>
    </form>
  );
}

function Checklist({ title, items, checked, onToggle }: { title: string; items: { id: string; label: string }[]; checked: string[]; onToggle: (id: string) => void }) {
  const done = items.filter((item) => checked.includes(item.id)).length;
  return (
    <section className="card" aria-label={title}>
      <div className="row" style={{ justifyContent: 'space-between', alignItems: 'baseline' }}>
        <h2>{title}</h2>
        <p className="muted">{done} av {items.length} klart</p>
      </div>
      <fieldset>
        <legend className="vh">{title}</legend>
        {items.map((item) => (
          <label className="check" key={item.id}><input type="checkbox" checked={checked.includes(item.id)} onChange={() => onToggle(item.id)} />{item.label}</label>
        ))}
      </fieldset>
    </section>
  );
}

export function MinBaby({ state, onChange }: { state: DemoState; onChange: (state: DemoState) => void }) {
  usePageTitle('Min baby');
  const profile = state.profile;

  if (!profile) {
    return (
      <>
        <PageHeader eyebrow="Min baby" title="Den første tiden, litt enklere" lead="Få praktiske sjekklister og forslag til steder som passer der dere er nå." />
        <div className="page page-narrow"><JourneySetup onSave={(next) => onChange({ ...initialDemoState, profile: next })} /></div>
      </>
    );
  }

  const date = today();
  const week = getJourneyWeek(profile, date);
  const ageMonths = getChildAgeMonths(profile, date);
  const milestone = getCurrentMilestone(profile, date);
  const toggle = (id: string) => onChange({ ...state, checkedItemIds: state.checkedItemIds.includes(id) ? state.checkedItemIds.filter((item) => item !== id) : [...state.checkedItemIds, id] });
  const items = checklistItemsForAge(ageMonths ?? 0);
  const pregnancyItems = profile.stage === 'expecting' && week ? pregnancyChecklistForWeek(week) : [];
  const activities = ageMonths === undefined ? [] : activitiesForAge(ageMonths);
  const otherParentLabel = profile.stage === 'expecting' ? 'Til den gravide' : 'Til den som har født';
  const tips = milestone ? [
    { key: 'other', label: otherParentLabel, text: milestone.pregnantParentTip },
    { key: 'dad', label: 'Til far eller medforelder', text: milestone.dadTip },
  ].filter((tip) => tip.text) : [];
  if (profile.contentPreference === 'dad') tips.reverse();

  const statusTitle = profile.stage === 'expecting'
    ? `Omtrent uke ${week ?? '–'} av svangerskapet`
    : profile.stage === 'baby_born'
      ? ageMonths === undefined ? 'Barnet er født' : `Barnet er ${formatAgeMonths(ageMonths)}`
      : 'Du utforsker uten å velge fase';

  return (
    <>
      <PageHeader eyebrow="Min baby" title="Den første tiden, litt enklere" />
      <div className="page masonry">
        <section className="card card-mint" aria-labelledby="status-title">
          <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 id="status-title" style={{ fontSize: '1.35rem' }}>{statusTitle}</h2>
            <Link className="text-link" to="/profil">Endre<span className="vh"> profil</span></Link>
          </div>
          {ageMonths !== undefined && <p>{getAgeDescription(ageMonths)}</p>}
          {profile.stage === 'baby_born' && ageMonths === undefined && <p>Legg inn alderen under Profil, så tilpasser vi forslagene.</p>}
          <p className="muted">Et generelt eksempel – barn utvikler seg ulikt.</p>
        </section>

        {milestone && (
          <section className="card" aria-labelledby="ms-title">
            <p className="eyebrow">Denne fasen</p>
            <h2 id="ms-title">{milestone.title}</h2>
            <p>{milestone.body}</p>
            {tips.map((tip) => <div className="tip" key={tip.key}><strong>{tip.label}</strong>{tip.text}</div>)}
          </section>
        )}

        <section className="stack" aria-labelledby="places-title">
          <h2 id="places-title">Steder som passer nå</h2>
          <Link className="link-row" to="/utforsk?filter=changing_table,stroller_space">Steder med stellerom og vognplass<Icon name="chevron" size={18} strokeWidth={2.4} /></Link>
          <Link className="link-row" to="/utforsk?filter=step_free_access">Steder uten trapper<Icon name="chevron" size={18} strokeWidth={2.4} /></Link>
          <Link className="link-row" to="/utforsk?filter=free_activity">Gratis aktiviteter<Icon name="chevron" size={18} strokeWidth={2.4} /></Link>
        </section>

        {pregnancyItems.length > 0 && (
          <section className="card" aria-labelledby="preg-title">
            <h2 id="preg-title">Forberedelser fra uke {week}</h2>
            <fieldset>
              <legend className="vh">Forberedelser</legend>
              {pregnancyItems.map((item) => <label className="check" key={item.id}><input type="checkbox" checked={state.checkedItemIds.includes(item.id)} onChange={() => toggle(item.id)} />{item.label}</label>)}
            </fieldset>
            <p className="muted small">Kilde: <a href="https://www.gravidhjelpen.no/sjekkliste" target="_blank" rel="noreferrer">Gravidhjelpen – sjekkliste<span className="vh"> (åpnes i ny fane)</span></a>. Bearbeidet for prototypen.</p>
          </section>
        )}

        <Checklist title="Turbagen" items={items.filter((item) => item.listId === 'equipment')} checked={state.checkedItemIds} onToggle={toggle} />
        <Checklist title="Praktisk støtte" items={items.filter((item) => item.listId === 'practical')} checked={state.checkedItemIds} onToggle={toggle} />

        {activities.length > 0 && (
          <section className="card" aria-labelledby="act-title">
            <h2 id="act-title">Aktiviteter for alderen</h2>
            <ul className="stack" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {activities.map((activity) => (
                <li key={activity.id} className="stack" style={{ gap: 2 }}>
                  <strong style={{ color: 'var(--ink)' }}>{activity.title}</strong>
                  <span>{activity.description}</span>
                  <span className="muted small">{activity.locationLabel} · {activity.ageMinMonths}–{activity.ageMaxMonths} mnd · <span className="badge badge-demo">Eksempeldata</span></span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <p className="muted span-all">Dette er generell, praktisk informasjon – ikke medisinske råd. Spørsmål om helse tar du med jordmor, helsestasjonen eller fastlegen.</p>
      </div>
    </>
  );
}
