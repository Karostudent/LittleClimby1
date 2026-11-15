import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link, NavLink, Route, Routes, useLocation } from 'react-router-dom';
import { initialDemoState, type DemoState } from '../domain/journey';
import { clearDemoState, readDemoState, readTripSelection, writeDemoState, writeTripSelection } from '../services/storage';
import { BrandMark, Icon, type IconName } from './ui';
import { Home } from './pages/Home';
import { Explore } from './pages/Explore';
import { PlaceDetail } from './pages/PlaceDetail';
import { TripPlanner } from './pages/TripPlanner';
import { MinBaby } from './pages/MinBaby';
import { Guides } from './pages/Guides';
import { Partners } from './pages/Partners';
import { PartnerPortal } from './pages/PartnerPortal';
import { Profile } from './pages/Profile';
import './styles.css';

const navItems: { to: string; label: string; icon: IconName }[] = [
  { to: '/', label: 'Hjem', icon: 'home' },
  { to: '/utforsk', label: 'Utforsk', icon: 'map' },
  { to: '/planlegg', label: 'Planlegg', icon: 'route' },
  { to: '/reise', label: 'Min baby', icon: 'heart' },
  { to: '/profil', label: 'Profil', icon: 'user' },
];

/** Turvalget deles mellom Utforsk, stedsdetalj og Planlegg. */
export interface TripSelection {
  ids: string[];
  toggle: (id: string) => void;
  set: (ids: string[]) => void;
}

function Shell({ tripCount, children }: { tripCount: number; children: ReactNode }) {
  const location = useLocation();
  const firstRender = useRef(true);

  // Ved sidebytte: til toppen, og fokus til sidens overskrift slik at skjermleser får beskjed.
  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return; }
    window.scrollTo(0, 0);
    const heading = document.querySelector<HTMLElement>('main h1');
    heading?.focus();
  }, [location.pathname]);

  return (
    <>
      <a className="skip-link" href="#main">Hopp til innholdet</a>
      <header className="site-header">
        <div className="site-header-inner">
          <Link to="/" className="brand"><BrandMark /><span>Enklere babyliv</span></Link>
          <span className="demo-pill">Demo</span>
          <nav className="mainnav" aria-label="Hovedmeny">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.to === '/'} className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
                <span className="nav-icon">
                  <Icon name={item.icon} size={22} />
                  {item.to === '/planlegg' && tripCount > 0 && <span className="nav-badge">{tripCount}<span className="vh"> stopp valgt</span></span>}
                </span>
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main id="main">{children}</main>
      <footer className="site-footer">Enklere babyliv · Studentprototype. Steder merket «Eksempeldata» er fiktive.</footer>
    </>
  );
}

export function App() {
  const [journeyState, setJourneyState] = useState<DemoState>(readDemoState);
  const [tripIds, setTripIds] = useState<string[]>(readTripSelection);

  const updateJourney = (next: DemoState) => { setJourneyState(next); writeDemoState(next); };
  const clearAll = () => { clearDemoState(); setJourneyState(initialDemoState); setTripIds([]); };
  const setTrip = (ids: string[]) => { const next = ids.slice(0, 3); setTripIds(next); writeTripSelection(next); };
  const trip: TripSelection = {
    ids: tripIds,
    set: setTrip,
    toggle: (id) => setTrip(tripIds.includes(id) ? tripIds.filter((item) => item !== id) : tripIds.length < 3 ? [...tripIds, id] : tripIds),
  };

  return (
    <Shell tripCount={tripIds.length}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/utforsk" element={<Explore trip={trip} />} />
        <Route path="/utforsk/:placeId" element={<PlaceDetail trip={trip} />} />
        <Route path="/planlegg" element={<TripPlanner trip={trip} />} />
        <Route path="/reise" element={<MinBaby state={journeyState} onChange={updateJourney} />} />
        <Route path="/guider" element={<Guides />} />
        <Route path="/partnere" element={<Partners />} />
        <Route path="/partnerportal" element={<PartnerPortal />} />
        <Route path="/profil" element={<Profile state={journeyState} onChange={updateJourney} onClear={clearAll} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Shell>
  );
}

function NotFound() {
  return (
    <div className="page page-narrow">
      <h1 tabIndex={-1}>Fant ikke siden</h1>
      <p>Lenken kan være feil, eller siden finnes ikke lenger.</p>
      <Link className="btn btn-primary" to="/">Til forsiden</Link>
    </div>
  );
}
