import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BackLink, usePageTitle } from '../ui';

type Topic = 'dad' | 'trip';

function DadIllustration() {
  return (
    <div style={{ height: 120, borderRadius: 14, background: 'var(--mint-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} aria-hidden="true">
      <svg width="180" height="90" viewBox="0 0 180 90">
        <path d="M0 78 C40 64 90 70 180 60 V90 H0Z" fill="#92CEC7" />
        <circle cx="70" cy="26" r="11" fill="#755858" />
        <path d="M70 38 v26 M58 50 h24 M70 64 l-8 14 M70 64 l8 14" stroke="#755858" strokeWidth="5" strokeLinecap="round" fill="none" />
        <rect x="96" y="46" width="34" height="20" rx="10" fill="#F0E3DE" stroke="#755858" strokeWidth="3" />
        <circle cx="102" cy="72" r="5" fill="#755858" />
        <circle cx="124" cy="72" r="5" fill="#755858" />
        <path d="M82 50 L98 50" stroke="#755858" strokeWidth="4" strokeLinecap="round" />
      </svg>
    </div>
  );
}

export function Guides() {
  usePageTitle('Guider og Pappasporet');
  const [topic, setTopic] = useState<Topic>('dad');

  return (
    <div className="page" style={{ maxWidth: 760 }}>
      <BackLink to="/">Hjem</BackLink>
      <div className="stack" style={{ gap: 8 }}>
        <p className="eyebrow">Guider</p>
        <h1 tabIndex={-1}>Praktisk støtte, uten fasit</h1>
        <p>Korte forslag for far, medforelder og andre omsorgspersoner. Ikke medisinsk rådgivning.</p>
      </div>

      <div className="row" role="group" aria-label="Velg tema">
        <button className="pill" aria-pressed={topic === 'dad'} onClick={() => setTopic('dad')}>Pappasporet</button>
        <button className="pill" aria-pressed={topic === 'trip'} onClick={() => setTopic('trip')}>På tur med baby</button>
      </div>

      {topic === 'dad' ? (
        <>
          <article className="card">
            <DadIllustration />
            <h2>Pappa og baby på tur</h2>
            <p>Velg et sted med enkel adkomst, og sjekk fasilitetene før dere drar. En plan B kan være å snu eller ta en kortere tur.</p>
            <ul className="stack" style={{ gap: 6, margin: 0, paddingLeft: 20 }}>
              <li>Ta med det dere faktisk bruker.</li>
              <li>Sjekk at det finnes stellerom som alle omsorgspersoner har tilgang til.</li>
              <li>La begge foreldre få eie sin måte å gjøre ting på.</li>
            </ul>
            <Link className="btn btn-secondary" to="/utforsk?filter=changing_access_all_caregivers">Finn steder med stell for alle</Link>
          </article>
          <article className="card">
            <h2>Ta ansvar for én tur i uka</h2>
            <p>Velg sted, rute og hva som skal være med. Da slipper den andre å planlegge alt.</p>
            <Link className="text-link" to="/planlegg">Planlegg en tur</Link>
          </article>
        </>
      ) : (
        <>
          <article className="card">
            <h2>Gjør første tur enkel</h2>
            <p>Start med et rolig mål og god tid. Appen viser fasiliteter der de er kjent, men forhold kan endre seg.</p>
            <ul className="stack" style={{ gap: 6, margin: 0, paddingLeft: 20 }}>
              <li>Se etter plass til barnevogn og trappefri adkomst.</li>
              <li>Bruk listevisningen hvis kartet ikke laster.</li>
              <li>«Vis vei» åpner Google Maps. Appen har ikke egen ruteplanlegger.</li>
            </ul>
            <Link className="btn btn-secondary" to="/utforsk">Åpne Utforsk</Link>
          </article>
          <article className="card">
            <h2>Ha en plan B</h2>
            <p>Velg gjerne et stopp i nærheten der dere kan sette dere inn, skifte eller snu.</p>
            <Link className="text-link" to="/planlegg">Legg til stopp i turplanen</Link>
          </article>
        </>
      )}

      <p className="muted">Guidene bygger på det foreldre fortalte oss i intervjuer, og på åpne kilder. Har du spørsmål om helse, kontakt helsestasjonen.</p>
    </div>
  );
}
