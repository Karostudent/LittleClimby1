import { Link } from 'react-router-dom';
import { places } from '../../data/places';
import type { FacilityName, Place } from '../../domain/places';
import { readTripPlan } from '../../services/storage';
import { StatusChip, usePageTitle } from '../ui';

const quickFilters: { filter: FacilityName; label: string }[] = [
  { filter: 'changing_table', label: 'Stellerom' },
  { filter: 'stroller_space', label: 'Plass til barnevogn' },
  { filter: 'step_free_access', label: 'Trappefri adkomst' },
  { filter: 'changing_access_all_caregivers', label: 'Stell for alle omsorgspersoner' },
];

function HeroArt() {
  return (
    <div className="hero-art" aria-hidden="true">
      <svg viewBox="0 0 350 150" preserveAspectRatio="xMidYMid slice">
        <circle cx="290" cy="42" r="22" fill="#FFE2B8" />
        <path d="M0 112 C70 70 140 80 200 104 S300 120 350 96 V150 H0Z" fill="#92CEC7" />
        <path d="M0 130 C90 104 180 116 260 132 S330 140 350 134 V150 H0Z" fill="#6FB7AE" />
        <path d="M40 132 C90 118 140 112 190 100" fill="none" stroke="#fff" strokeWidth="3" strokeDasharray="2 8" strokeLinecap="round" />
        <circle cx="196" cy="98" r="9" fill="#755858" />
        <circle cx="196" cy="98" r="3.5" fill="#fff" />
      </svg>
    </div>
  );
}

export function Home() {
  usePageTitle('Hjem');
  const plan = readTripPlan();
  const planned = plan ? plan.placeIds.map((id) => places.find((place) => place.id === id)).filter((place): place is Place => Boolean(place)) : [];
  const planDate = plan?.date ? new Date(`${plan.date}T12:00:00`).toLocaleDateString('nb-NO', { weekday: 'long', day: 'numeric', month: 'long' }) : null;

  return (
    <div className="page home">
      <section className="hero" aria-labelledby="hero-title">
        <HeroArt />
        <h1 id="hero-title" tabIndex={-1}>Finn steder som passer for deg og babyen</h1>
        <p className="hero-lead">Se hvor det er stellerom, plass til barnevogn og trappefri adkomst i Kristiansand – og hva som faktisk er kontrollert.</p>
        <div className="hero-actions">
          <Link className="btn btn-primary" to="/utforsk">Utforsk steder i nærheten</Link>
          <Link className="btn btn-secondary" to="/reise">Sett opp Min baby</Link>
        </div>
        <p className="muted">Ingen innlogging. Det du lagrer, blir bare i denne nettleseren.</p>
      </section>

      <section className="card" aria-labelledby="trip-title">
        <p className="eyebrow">Neste tur</p>
        {planned.length ? (
          <>
            <h2 id="trip-title">{planDate ? `${planDate[0].toUpperCase()}${planDate.slice(1)}` : 'Dato ikke valgt'} · {planned.length} stopp</h2>
            <p>{planned.map((place) => place.name).join(' → ')}</p>
            <Link className="text-link" to="/planlegg">Åpne turplanen</Link>
          </>
        ) : (
          <>
            <h2 id="trip-title">Ingen tur planlagt ennå</h2>
            <p>Velg opptil tre steder i Utforsk, så setter vi dem sammen til en tur.</p>
            <Link className="text-link" to="/utforsk">Finn steder</Link>
          </>
        )}
      </section>

      <section className="stack" aria-labelledby="quick-title">
        <h2 id="quick-title">Hva trenger dere i dag?</h2>
        <div className="row">
          {quickFilters.map((item) => <Link key={item.filter} className="pill" to={`/utforsk?filter=${item.filter}`}>{item.label}</Link>)}
        </div>
      </section>

      <section className="card" aria-labelledby="trust-title">
        <h2 id="trust-title">Slik leser du informasjonen</h2>
        <ul className="legend-list">
          <li><StatusChip value="yes" /><span>Bekreftet. Vises alltid med kilde og dato.</span></li>
          <li><StatusChip value="no" /><span>Finnes ikke på stedet.</span></li>
          <li><StatusChip value="unknown" /><span>Ikke kontrollert. Gir ikke treff når du filtrerer.</span></li>
          <li><span className="badge badge-demo">Eksempeldata</span><span>Fiktivt sted i demoen.</span></li>
        </ul>
      </section>

      <nav className="grid-2" aria-label="Mer i appen">
        <Link className="card card-link" to="/guider"><h2>Pappasporet</h2><span className="muted">Korte, praktiske guider for far og medforelder</span></Link>
        <Link className="card card-link" to="/partnere"><h2>Partnertilbud</h2><span className="muted">Kurs og aktiviteter. Egen del, alltid merket</span></Link>
      </nav>
    </div>
  );
}
