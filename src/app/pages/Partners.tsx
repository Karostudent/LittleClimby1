import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BackLink, Icon, usePageTitle } from '../ui';

type OfferType = 'all' | 'course' | 'activity' | 'event';

interface Offer {
  id: string;
  type: Exclude<OfferType, 'all'>;
  title: string;
  description: string;
  meta: [string, string][];
}

// Alle tilbud er fiktive. De viser hvordan betalt plassering kan se ut, tydelig merket.
const offers: Offer[] = [
  { id: 'swim', type: 'course', title: 'Babysvømming for nybegynnere', description: 'Et rolig introduksjonskurs med liten gruppe og god tid for foreldre.', meta: [['Varighet', '6 samlinger'], ['Alder', 'Fra 3 måneder'], ['Arrangør', 'Fiktiv partner']] },
  { id: 'play', type: 'activity', title: 'Åpen lekestund på kafé', description: 'En uformell formiddag for små barn og omsorgspersoner, med plass til barnevogn.', meta: [['Når', 'Lørdager 10–12'], ['Sted', 'Kristiansand'], ['Arrangør', 'Fiktiv partner']] },
  { id: 'sea', type: 'event', title: 'Familielørdag ved sjøen', description: 'Rolig formiddag med sang, lek og god plass til barnevogn.', meta: [['Når', 'Lørdag 10–12'], ['Sted', 'Kristiansand'], ['Arrangør', 'Fiktiv partner']] },
];

const typeLabels: Record<OfferType, string> = { all: 'Alle', course: 'Kurs', activity: 'Aktiviteter', event: 'Arrangementer' };

export function Partners() {
  usePageTitle('Partnertilbud');
  const [type, setType] = useState<OfferType>('all');
  const visible = offers.filter((offer) => type === 'all' || offer.type === type);

  return (
    <div className="page">
      <BackLink to="/">Hjem</BackLink>
      <div className="stack" style={{ gap: 8 }}>
        <p className="eyebrow">Partnertilbud</p>
        <h1 tabIndex={-1}>Kurs og aktiviteter i nærheten</h1>
      </div>

      <section className="card card-warn" aria-labelledby="how-title">
        <Icon name="info" size={22} />
        <div className="stack" style={{ gap: 4 }}>
          <h2 id="how-title" style={{ fontSize: '1rem' }}>Slik fungerer denne delen</h2>
          <p>Tilbudene her er betalt plassering og alltid merket «Annonse». Vi får provisjon når du booker. Partnere påvirker ikke stedene, filtrene eller rådene ellers i appen.</p>
        </div>
      </section>

      <div className="pill-row" role="group" aria-label="Velg type tilbud">
        {(Object.keys(typeLabels) as OfferType[]).map((key) => (
          <button key={key} className="pill" aria-pressed={type === key} onClick={() => setType(key)}>{typeLabels[key]}</button>
        ))}
      </div>
      <p className="vh" role="status">{visible.length} tilbud</p>

      <ul className="offers stack" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {visible.map((offer) => (
          <li key={offer.id} className="card">
            <div className="row" style={{ gap: 6 }}><span className="badge badge-ad">Annonse</span><span className="badge badge-demo">Fiktivt tilbud</span></div>
            <h2>{offer.title}</h2>
            <p>{offer.description}</p>
            <dl className="offer-meta">
              {offer.meta.map(([label, value]) => <div key={label} style={{ display: 'contents' }}><dt>{label}</dt><dd>{value}</dd></div>)}
            </dl>
            <button className="btn" disabled>Booking kommer (demo)</button>
          </li>
        ))}
      </ul>

      <Link className="card card-link row" to="/partnerportal" style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="stack" style={{ gap: 2 }}><strong style={{ fontSize: '1.05rem' }}>Er du partner?</strong><span className="muted">Legg inn et tilbud for familier</span></span>
        <Icon name="chevron" strokeWidth={2.4} />
      </Link>
    </div>
  );
}
