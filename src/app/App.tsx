import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, NavLink, Route, Routes, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import { divIcon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { buildExternalDirectionsUrl, categoryLabels, facilityLabels, formatCheckedDate, isFictional, matchesPlace, type FacilityName, type FacilityClaim, type Place, type PlaceCategory, type TriState } from '../domain/places';
import { places } from '../data/places';
import { activitiesForAge } from '../data/activities';
import { checklistItemsForAge, getAgeDescription, getBabyAgeDescription, getChildAgeMonths, getChildAgeYears, getCurrentMilestone, getJourneyWeek, initialDemoState, kindergartenChecklistForAge, pregnancyChecklistForWeek, type ContentPreference, type DemoProfile, type DemoState, type JourneyStage } from '../domain/journey';
import { addPlaceReport, clearDemoState, readDemoState, readFavoriteIds, readFeedback, readTripPlan, readTripSelection, removeTripPlan, writeDemoState, writeFavoriteIds, writeFeedback, writeTripPlan, writeTripSelection, type DemoFeedback, type TripPlan } from '../services/storage';
import './styles.css';

const primaryFilters: FacilityName[] = ['stroller_space', 'changing_table', 'changing_access_all_caregivers', 'step_free_access'];
const additionalFilters: FacilityName[] = ['stroller_suitable_route', 'free_activity'];
const quickFilters: FacilityName[] = ['changing_table', 'stroller_space', 'free_activity'];

const realPlaceMarker = divIcon({ className: 'place-marker place-marker-real', html: '<span aria-hidden="true">●</span>', iconSize: [32, 32], iconAnchor: [16, 16], popupAnchor: [0, -16] });
const demoPlaceMarker = divIcon({ className: 'place-marker place-marker-demo', html: '<span aria-hidden="true">●</span>', iconSize: [32, 32], iconAnchor: [16, 16], popupAnchor: [0, -16] });

type NavigationIconName = 'home' | 'map' | 'route' | 'heart' | 'info' | 'star' | 'user' | 'bot';

const primaryNavigation = [
  { path: '/', label: 'Hjem', icon: 'home' as NavigationIconName },
  { path: '/utforsk', label: 'Utforsk', icon: 'map' as NavigationIconName },
  { path: '/planlegg', label: 'Min tur', icon: 'route' as NavigationIconName },
  { path: '/reise', label: 'Min baby', icon: 'heart' as NavigationIconName },
];

const secondaryNavigation = [
  { path: '/guider', label: 'Guider', icon: 'info' as NavigationIconName },
  { path: '/partnere', label: 'Partnertilbud', icon: 'star' as NavigationIconName },
  { path: '/little-babybot', label: 'Little BabyBot', icon: 'bot' as NavigationIconName },
  { path: '/profil', label: 'Profil og innstillinger', icon: 'user' as NavigationIconName },
];

function NavigationIcon({ name }: { name: NavigationIconName }) {
  const paths = {
    home: <path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z" />,
    map: <><path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2-6-2z" /><path d="M9 4v14M15 6v14" /></>,
    route: <><circle cx="6" cy="19" r="2" /><circle cx="18" cy="5" r="2" /><path d="M8 19h7a3.5 3.5 0 0 0 0-7H9a3.5 3.5 0 0 1 0-7h7" /></>,
    heart: <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />,
    info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></>,
    star: <path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z" />,
    user: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
    bot: <><rect x="5" y="7" width="14" height="12" rx="4" /><path d="M12 7V3M9 3h6M9 12h.01M15 12h.01M9 16h6" /></>,
  }[name];

  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">{paths}</svg>;
}

function MoreMenu() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const firstItemRef = useRef<HTMLAnchorElement>(null);
  const moreActive = location.pathname === '/partnerportal' || secondaryNavigation.some((item) => location.pathname.startsWith(item.path));
  const closeMenu = (restoreFocus = false) => {
    setOpen(false);
    if (restoreFocus) triggerRef.current?.focus();
  };

  useEffect(() => {
    if (!open) return;
    firstItemRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeMenu(true);
      }
    };
    const handlePointerDown = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) closeMenu();
    };
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handlePointerDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handlePointerDown);
    };
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return <div ref={menuRef} className={`more-menu${moreActive ? ' active' : ''}`}><button ref={triggerRef} className="more-trigger" type="button" aria-expanded={open} aria-haspopup="menu" onClick={() => setOpen((isOpen) => !isOpen)}><span className="mobile-nav-icon"><NavigationIcon name="info" /></span><span>Mer</span></button>{open && <div className="more-panel" role="menu" aria-label="Flere valg">{secondaryNavigation.map((item, index) => <NavLink ref={index === 0 ? firstItemRef : undefined} key={item.path} to={item.path} role="menuitem" onClick={() => closeMenu()}><NavigationIcon name={item.icon} /><span>{item.label}</span></NavLink>)}</div>}</div>;
}

function BrandLogo() {
  return <span className="brand-lockup"><span className="brand-tree" aria-hidden="true">✦</span><span>Enklere Babyliv</span></span>;
}

function FarmAnimal({ animal, label }: { animal: 'pig' | 'cow' | 'chicken'; label: string }) {
  return <span className={`farm-animal farm-${animal}`} role="img" aria-label={label}><span className="farm-ear ear-left" /><span className="farm-ear ear-right" /><span className="farm-face"><i /><i /></span><span className="farm-muzzle" /></span>;
}

const formatChildAge = (months: number | undefined, years: number | undefined): string => {
  if (months !== undefined && months < 12) return `${months} ${months === 1 ? 'måned' : 'måneder'}`;
  return years === undefined ? 'alder ikke oppgitt' : `${years} år`;
};

function Shell({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  useEffect(() => {
    const titles: Record<string, string> = {
      '/': 'Hjem',
      '/utforsk': 'Utforsk',
      '/planlegg': 'Min tur',
      '/reise': 'Min baby',
      '/guider': 'Guider',
      '/partnere': 'Partnertilbud',
      '/little-babybot': 'Little BabyBot',
      '/profil': 'Profil og innstillinger',
    };
    document.title = `${titles[location.pathname] ?? 'Enklere Babyliv'} – Enklere Babyliv`;
    const heading = document.querySelector<HTMLElement>('#main-content h1');
    heading?.setAttribute('tabindex', '-1');
    heading?.focus();
  }, [location.pathname, location.search]);
  return <><a className="skip-link" href="#main-content">Hopp til hovedinnhold</a><header className="topbar"><Link to="/" className="brand" aria-label="Enklere Babyliv hjem"><BrandLogo /><span>DEMO</span></Link><nav className="desktop-nav" aria-label="Hovedmeny">{primaryNavigation.map((item) => <NavLink key={item.path} to={item.path} end={item.path === '/'}>{item.label}</NavLink>)}<MoreMenu /></nav><nav className="mobile-nav" aria-label="Mobilmeny">{primaryNavigation.map((item) => <NavLink key={item.path} to={item.path} end={item.path === '/'}><span className="mobile-nav-icon"><NavigationIcon name={item.icon} /></span><span>{item.label}</span></NavLink>)}<MoreMenu /></nav></header><main id="main-content" tabIndex={-1}>{children}</main><footer>Enklere Babyliv · Studentprototype · Eksempeldata er ikke en offentlig tjeneste.</footer></>;
}

function ExploreShortcuts() {
  return <nav className="explore-shortcuts" aria-label="Raske filtre i Utforsk"><p className="eyebrow">Finn raskt</p><div><Link className="text-button" to="/utforsk?filter=changing_table">Steder med stellerom</Link><Link className="text-button" to="/utforsk?filter=stroller_space">Steder med plass til barnevogn</Link><Link className="text-button" to="/utforsk?filter=free_activity">Gratis aktiviteter</Link></div></nav>;
}

function Home() {
  const plan = readTripPlan();
  const plannedPlaces = plan ? plan.placeIds.map((id) => places.find((place) => place.id === id)).filter((place): place is Place => Boolean(place)) : [];
  return <section className="page welcome-page">
    <div className="welcome-hero">
      <div className="welcome-copy">
        <p className="eyebrow">Enklere babyliv, hjemme og ute</p>
        <h1>Enklere Babyliv - Gjør turen god for liten og stor!</h1>
        <p className="lead">Se barnevennlige steder og aktiviteter i Kristiansand.</p>
        <div className="actions"><Link className="button primary" to="/utforsk">Utforsk barnevennlige steder</Link><Link className="button secondary" to="/reise">Min baby</Link></div>
        <p className="welcome-note">Du kan starte uten innlogging. Alt du legger inn i demoen, lagres bare lokalt i nettleseren.</p>
      </div>
      <div className="welcome-illustration" aria-label="Egne illustrasjoner laget for Enklere Babyliv">
        <span className="illustration-sun" aria-hidden="true" />
        <span className="illustration-cloud cloud-one" aria-hidden="true" />
        <span className="illustration-cloud cloud-two" aria-hidden="true" />
        <div className="illustration-card"><span className="illustration-pin">●</span><div><strong>En god dag ute</strong><small>Finn et sted som passer dere</small></div></div>
        <div className="farm-hello" aria-hidden="true"><FarmAnimal animal="pig" label="Søt gårdsgris" /><FarmAnimal animal="chicken" label="Søt gårdshøne" /></div>
        <span className="illustration-hill hill-back" aria-hidden="true" />
        <span className="illustration-hill hill-front" aria-hidden="true" />
      </div>
    </div>

    <section className="welcome-section home-shortcuts" aria-label="Snarveier">
      {plannedPlaces.length > 0 ? <article className="card home-plan"><p className="eyebrow">Min tur</p><h2>{plannedPlaces.length} stopp planlagt</h2><p>{plannedPlaces.map((place) => place.name).join(' · ')}</p><Link className="text-button" to="/planlegg">Åpne Min tur</Link></article> : <article className="card home-plan"><p className="eyebrow">Min tur</p><h2>Planlegg når det passer</h2><p>Velg opptil tre stopp fra Utforsk, og legg til dato og huskelapp.</p><Link className="text-button" to="/planlegg">Åpne Min tur</Link></article>}
      <ExploreShortcuts />
      <p className="home-how-it-works"><strong>Slik fungerer det:</strong> Finn et sted, sjekk praktisk informasjon og legg det eventuelt til i Min tur.</p>
    </section>
  </section>;
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

function SponsorShowcase() {
  return <section className="sponsor-showcase" aria-labelledby="sponsor-title">
    <div className="section-intro"><div><p className="eyebrow">Eksempel på samarbeid</p><h2 id="sponsor-title">Relevant inspirasjon, tydelig merket</h2></div><span className="ad-label">Annonse</span></div>
    <p className="sponsor-intro">Her kan lokale aktører løfte frem tilbud som passer familier. Kortene under er fiktive og viser en mulig annonseflate – de er ikke anbefalinger eller betalte samarbeid.</p>
    <div className="sponsor-grid">
      <article className="sponsor-card sponsor-event"><div className="sponsor-card-top"><span className="ad-label">Sponset arrangement</span><span className="sponsor-mark">Lokalt</span></div><p className="sponsor-date">Lørdag · 10:00–12:00</p><h3>Familielørdag ved sjøen</h3><p>Rolig formiddag med sang, lek og god plass til barnevogn. Et fiktivt eksempel på et relevant arrangement.</p><div className="sponsor-footer"><span>Fiktiv partner · Kristiansand</span><Link className="text-button" to="/utforsk">Se eksempel</Link></div></article>
      <article className="sponsor-card sponsor-product"><div className="sponsor-card-top"><span className="ad-label">Annonse</span><span className="sponsor-mark">Tips til turen</span></div><h3>Gjør turen litt enklere</h3><p>Praktisk utstyr for små turer, valgt for familier som vil ut i nærmiljøet. Produktomtalen er et fiktivt demoeksempel.</p><div className="sponsor-footer"><span>Fiktiv butikk · Betalt plassering</span><span className="text-button">Les mer</span></div></article>
    </div>
    <p className="sponsor-disclosure">I en ferdig løsning skal annonser alltid merkes tydelig, være relevante for målgruppen og holdes adskilt fra appens egne råd og steddata.</p>
  </section>;
}

function PartnerEntry() {
  return <section className="partner-entry card"><div><p className="eyebrow">Valgfritt å utforske</p><h2>Tilbud fra lokale partnere</h2><p>Finn kurs, babysvømming, arrangementer og andre tilbud som kan bestilles direkte. Partnerinnhold ligger samlet her – ikke som reklame rundt i appen.</p></div><div className="partner-entry-action"><FarmAnimal animal="cow" label="Søt gårdsku" /><Link className="button secondary" to="/partnere">Se partnertilbud</Link></div></section>;
}

function PartnerOffers() {
  return <section className="page partner-page"><div className="section-intro"><div><p className="eyebrow">Partnertilbud</p><h1>Finn noe dere kan gjøre sammen</h1></div><div><Link className="button secondary" to="/utforsk">Utforsk steder</Link><Link className="text-button partner-portal-link" to="/partnerportal">Er du partner? Legg inn tilbud</Link></div></div><div className="farm-page-greeting"><FarmAnimal animal="pig" label="Søt gårdsgris" /><p className="lead">Her samler vi relevante tilbud fra lokale aktører. Bestilling kan på sikt skje direkte i appen; Enklere Babyliv kan da få provisjon fra partneren.</p></div><div className="partner-disclosure"><strong>Dette er en demo</strong><span>Alle tilbudene under er fiktive og ikke bookbare.</span></div><div className="partner-offer-grid"><article className="partner-offer-card"><span className="demo-label">Fiktivt tilbud</span><p className="muted">Sponset plassering · tydelig merket</p><h2>Babysvømming for nybegynnere</h2><p>Et rolig introduksjonskurs med liten gruppe, god tid og plass til foreldre. Fiktivt eksempel på et bookbart partnertilbud.</p><div className="offer-meta"><span>6 samlinger · fra 3 måneder</span><strong>Provisjon ved booking</strong></div><button className="button primary" disabled>Book tilbud (demo)</button></article><article className="partner-offer-card"><span className="demo-label">Fiktivt tilbud</span><p className="muted">Lokalt arrangement</p><h2>Åpen lekestund på kafé</h2><p>En uformell formiddag for små barn og omsorgspersoner, med barnevognplass og enkel servering.</p><div className="offer-meta"><span>Lørdag · Kristiansand</span><strong>Provisjon ved booking</strong></div><button className="button primary" disabled>Book tilbud (demo)</button></article></div><section className="partner-how card"><p className="eyebrow">Slik kan det fungere</p><h2>En enkel vei fra tilbud til booking</h2><ol><li>Partneren legger inn tilbud, kapasitet, pris og praktisk informasjon.</li><li>Brukeren finner tilbudet på denne siden og velger selv om det er relevant.</li><li>Booking og betaling skjer via en trygg partnerløsning.</li><li>Enklere Babyliv får avtalt provisjon – uten at partnerinnhold blandes med appens egne råd.</li></ol></section><SponsorShowcase /></section>;
}

function PartnerPortal() {
  return <section className="page partner-portal"><div className="section-intro"><div><p className="eyebrow">Partnerside · konseptskisse</p><h1>Legg inn et tilbud</h1></div><Link className="button secondary" to="/partnere">Se brukersiden</Link></div><p className="lead">En kafé, et kurs eller en arrangør kan sende inn tilbud som passer familier. En godkjenning bør skje før tilbudet blir synlig.</p><form className="partner-form" onSubmit={(event) => event.preventDefault()}><label>Navn på virksomhet<input placeholder="For eksempel Lille Kafé" /></label><label>Hva tilbyr dere?<input placeholder="For eksempel babysvømming eller familielunsj" /></label><label>Beskriv tilbudet<textarea rows={4} placeholder="Kort og konkret informasjon til foreldre" /></label><div className="partner-form-grid"><label>Pris<input placeholder="For eksempel 250 kr" /></label><label>Kapasitet<input placeholder="For eksempel 12 plasser" /></label></div><label className="choice"><input type="checkbox" />Jeg bekrefter at tilbudet kan vurderes for målgruppen.</label><button className="button primary" type="submit">Send inn til vurdering (demo)</button><p className="muted">Demoen sender ikke inn data. I en ferdig løsning må partneren godta vilkår, provisjon og merking.</p></form></section>;
}

function LittleBabyBot() {
  const examples = [
    {
      label: 'Lokale aktiviteter',
      question: 'Hva kan vi finne på med en ettåring i Kristiansand?',
      answer: 'Jeg kan hjelpe deg med å finne barnevennlige aktiviteter som passer barnets alder. Du kan også bruke Utforsk for å finne steder med stellemuligheter og plass til barnevogn.',
    },
    {
      label: 'Praktiske forberedelser',
      question: 'Hva bør vi huske før babyen kommer?',
      answer: 'Jeg kan hjelpe dere med praktiske sjekklister og påminnelser, tilpasset hvor dere er i graviditeten. I Min baby finner dere eksempler på slike sjekklister.',
    },
    {
      label: 'Planlegging',
      question: 'Kan du hjelpe oss å planlegge en tur?',
      answer: 'I en fremtidig versjon kan jeg foreslå passende steder og hjelpe dere med å sette sammen en tur. Foreløpig kan dere planlegge turer selv i Min tur.',
    },
  ];
  const [activeExample, setActiveExample] = useState(0);
  const example = examples[activeExample];
  const futureFeatures = [
    'Foreslå aktiviteter og babyvennlige steder basert på barnets alder.',
    'Hjelpe med praktiske sjekklister, påminnelser og forberedelser.',
    'Foreslå steder fra kartet og bidra til turplanlegging.',
    'Hjelpe brukeren å finne relevant informasjon og kvalitetssikrede kilder.',
  ];

  return <section className="page babybot-page">
    <div className="section-intro babybot-heading">
      <div><p className="eyebrow">Fremtidig utvidelse</p><h1>Little BabyBot</h1></div>
      <span className="demo-label">Konseptdemo · Kommer senere</span>
    </div>
    <p className="lead babybot-intro">Se hvordan en fremtidig assistent kan gjøre praktisk barnefamilieinformasjon enklere å finne.</p>

    <div className="babybot-demo" aria-label="Forhåndsvist samtaledemo">
      <div className="babybot-demo-header">
        <div className="babybot-avatar" aria-hidden="true"><NavigationIcon name="bot" /></div>
        <div><strong>Little BabyBot</strong><p className="muted">Forhåndsdefinerte eksempelsvar</p></div>
        <span className="demo-label">Ikke aktiv</span>
      </div>
      <div className="babybot-example-tabs" role="tablist" aria-label="Velg eksempelsamtale">
        {examples.map((item, index) => <button key={item.label} type="button" role="tab" aria-selected={activeExample === index} className={activeExample === index ? 'selected' : ''} onClick={() => setActiveExample(index)}>{item.label}</button>)}
      </div>
      <div className="babybot-messages" role="tabpanel" aria-live="polite">
        <div className="babybot-message babybot-user"><span className="babybot-message-label">Bruker</span><p>{example.question}</p></div>
        <div className="babybot-message babybot-answer"><span className="babybot-message-label">Little BabyBot</span><p>{example.answer}</p></div>
      </div>
      <div className="babybot-compose">
        <input type="text" value="" placeholder="Skriv et spørsmål …" disabled aria-label="Meldingsfeltet er deaktivert i konseptdemoen" />
        <button type="button" disabled aria-label="Send melding">↑</button>
      </div>
    </div>

    <section className="babybot-future" aria-labelledby="babybot-future-title">
      <p className="eyebrow">Konsept</p>
      <h2 id="babybot-future-title">Hva kan Little BabyBot gjøre i fremtiden?</h2>
      <div className="babybot-future-grid">
        {futureFeatures.map((feature) => <article className="card" key={feature}><p>{feature}</p></article>)}
      </div>
    </section>

    <aside className="babybot-trust" aria-label="Begrensning og tillit">
      <strong>Foreløpig bare et konsept</strong>
      <p>Little BabyBot er foreløpig bare et konsept. En fremtidig versjon skal hjelpe med praktisk informasjon og veivise til pålitelige kilder, men ikke erstatte råd fra helsepersonell.</p>
      <p>Ved helserelaterte spørsmål skal dette rettes til helsestasjon, lege eller offentlige helsekilder som Helsenorge.</p>
    </aside>
  </section>;
}

function TrustNote() {
  return <aside className="trust-note" aria-label="Om data og demo"><strong>Slik leser du informasjonen</strong><span><b className="legend-dot confirmed" />Bekreftet av oppføringens kilde</span><span><b className="legend-dot unknown" />Ukjent betyr at vi ikke har bevis</span><span><b className="legend-dot demo" />Fiktivt demosted er kun eksempeldata</span></aside>;
}

function Guides() {
  return <section className="page guides"><div className="section-intro"><div><p className="eyebrow">Guider og Pappasporet</p><h1>Praktisk støtte, uten fasit.</h1></div><Link className="button secondary" to="/utforsk">Finn steder</Link></div><p className="lead">Generelle råd for pappa, medforelder og andre omsorgspersoner. Lokale steder og aktiviteter finner du i Utforsk.</p><div className="guide-grid"><article className="card guide-card"><p className="eyebrow">Pappasporet</p><h2>For pappa og medforelder</h2><p>Velg et sted med enkel adkomst, og sjekk fasiliteter før dere drar. En plan B kan være å snu eller ta en kortere tur.</p><ul><li>Ta med det dere faktisk bruker.</li><li>Finn ut hvem som kan hjelpe hvis dagen endrer seg.</li><li>La begge omsorgspersoner få eie sin måte å gjøre ting på.</li></ul><Link className="text-button" to="/reise">Se sjekklister i Min baby</Link></article><article className="card guide-card"><p className="eyebrow">Generelt råd</p><h2>Gjør første tur enkel</h2><p>Start med et rolig mål og god tid. Kartet viser fasilitetsstatus der den er kjent, men tilgjengelighet kan endre seg.</p><ul><li>Se etter plass til barnevogn.</li><li>Bruk listevisningen hvis kartfliser ikke lastes.</li><li>Åpne ekstern karttjeneste for vei – dette er ikke appens egen ruteplanlegger.</li></ul><Link className="text-button" to="/utforsk">Finn et sted i Utforsk</Link></article></div><p className="source-note">Guidene er generelle designhypoteser for studentprototypen og ikke medisinsk rådgivning.</p></section>;
}

function FacilityStatus({ name, claim }: { name: FacilityName; claim?: FacilityClaim }) {
  const value: TriState = claim?.value ?? 'unknown';
  const mark = value === 'yes' ? '✓' : value === 'no' ? '–' : '?';
  const label = value === 'yes' ? 'Ja' : value === 'no' ? 'Nei' : 'Ukjent';
  return <span className={`status ${value}`}><span className="status-mark" aria-hidden="true">{mark}</span>{label} · {facilityLabels[name]}</span>;
}

function MapViewport({ visiblePlaces }: { visiblePlaces: Place[] }) {
  const map = useMap();
  useEffect(() => {
    const coordinates = visiblePlaces
      .filter((place) => place.coordinates)
      .map((place) => [place.coordinates!.lat, place.coordinates!.lng] as [number, number]);
    if (!coordinates.length) return;
    if (coordinates.length === 1) {
      map.setView(coordinates[0], 14, { animate: false });
    } else {
      map.fitBounds(coordinates, { padding: [28, 28], maxZoom: 12, animate: false });
    }
  }, [map, visiblePlaces]);
  return null;
}

function PlaceCard({ place, favorite, inTrip, canAdd, onFavorite, onSelect, onToggleTrip }: { place: Place; favorite: boolean; inTrip: boolean; canAdd: boolean; onFavorite: () => void; onSelect: () => void; onToggleTrip: () => void }) {
  return <article className="place-card"><div className="card-heading"><div><h3>{place.name}</h3><p className="muted">{categoryLabels[place.category]} · {place.addressOrArea}</p></div><button className="icon-button" aria-label={favorite ? `Fjern ${place.name} fra favoritter` : `Lagre ${place.name} som favoritt`} onClick={onFavorite}>{favorite ? '★' : '☆'}</button></div>{isFictional(place) && <span className="demo-label">Fiktivt demosted</span>}<p>{place.shortDescription}</p>{place.routeInfo && <p className="route-summary"><strong>{place.routeInfo.lengthKm} km</strong> · {place.routeInfo.surfaceText} · Ikke verifisert</p>}<div className="facility-list">{primaryFilters.map((name) => <FacilityStatus key={name} name={name} claim={place.facilities[name]} />)}</div><div className="place-card-actions"><button className="text-button" onClick={onSelect}>Se detaljer</button><button className={`trip-add-button ${inTrip ? 'selected' : ''}`} onClick={onToggleTrip} disabled={!inTrip && !canAdd}>{inTrip ? '✓ I Min tur' : 'Legg til i Min tur'}</button></div></article>;
}

function TripSelectionBar({ selectedIds, onClear, onCreatePlan }: { selectedIds: string[]; onClear: () => void; onCreatePlan: () => void }) {
  if (!selectedIds.length) return null;
  return <aside className="trip-selection" aria-label="Valgte stopp for Min tur"><div><strong>{selectedIds.length}/3 stopp valgt</strong><p className="muted">{selectedIds.length ? 'Velg opptil tre steder og lag Min tur.' : 'Velg steder fra listen for å bygge Min tur.'}</p></div><div className="trip-selection-actions">{selectedIds.length > 0 && <button className="text-button" onClick={onClear}>Nullstill valg</button>}<button className="button primary" disabled={!selectedIds.length} onClick={onCreatePlan}>Åpne Min tur</button></div></aside>;
}

function PlaceDetails({ place, inTrip, canAdd, onClose, onToggleTrip }: { place: Place; inTrip: boolean; canAdd: boolean; onClose: () => void; onToggleTrip: () => void }) {
  const [reportMode, setReportMode] = useState<'confirm' | 'error' | null>(null);
  const [reportMessage, setReportMessage] = useState('');
  const [reportSent, setReportSent] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null;
    const header = document.querySelector<HTMLElement>('.topbar');
    const main = document.querySelector<HTMLElement>('#main-content');
    const footer = document.querySelector<HTMLElement>('footer');
    [header, main, footer].forEach((element) => element?.setAttribute('inert', ''));
    [header, main, footer].forEach((element) => element?.setAttribute('aria-hidden', 'true'));
    closeRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key === 'Tab' && panelRef.current) {
        const focusable = Array.from(panelRef.current.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), summary, [tabindex]:not([tabindex="-1"])')).filter((element) => !element.hasAttribute('disabled'));
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.classList.add('detail-open');
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.classList.remove('detail-open');
      [header, main, footer].forEach((element) => {
        element?.removeAttribute('inert');
        element?.removeAttribute('aria-hidden');
      });
      previousFocus?.focus();
    };
  }, [onClose]);
  const submitReport = (event: React.FormEvent) => {
    event.preventDefault();
    if (!reportMode || (reportMode === 'error' && !reportMessage.trim())) return;
    addPlaceReport({ placeId: place.id, kind: reportMode, message: reportMessage.trim(), createdAt: new Date().toISOString() });
    setReportSent(true);
    setReportMode(null);
    setReportMessage('');
  };
  return createPortal(<><div className="detail-backdrop" aria-hidden="true" onMouseDown={onClose} /><div ref={panelRef} className="detail-panel" role="dialog" aria-modal="true" aria-labelledby="detail-title"><div className="detail-panel-header"><button ref={closeRef} className="close-button" type="button" onClick={onClose}>Lukk</button></div><div className="detail-panel-scroll"><h2 id="detail-title">{place.name}</h2>{isFictional(place) ? <p className="demo-label">Fiktivt demosted – kun eksempeldata</p> : <p className="verified-label">Reell stedsidentitet · fasiliteter må verifiseres separat</p>}<p className="muted">{place.addressOrArea}</p><p>{place.shortDescription}</p>{place.routeInfo && <p className="route-summary"><strong>Rute:</strong> {place.routeInfo.lengthKm} km · {place.routeInfo.surfaceText}. Rutedata er ikke verifisert.</p>}<h3>Fasiliteter</h3><ul>{Object.entries(place.facilities).map(([name, claim]) => <li key={name}><FacilityStatus name={name as FacilityName} claim={claim} />{claim?.note && ` – ${claim.note}`}</li>)}</ul><button className={`trip-add-button ${inTrip ? 'selected' : ''}`} onClick={onToggleTrip} disabled={!inTrip && !canAdd}>{inTrip ? '✓ I Min tur' : 'Legg til i Min tur'}</button><details className="info-details"><summary>Om informasjonen</summary>{isFictional(place) ? <p>Dette er et fiktivt demosted. Opplysningene er kun laget for å vise hvordan prototypen fungerer.</p> : <><p>Stedsidentiteten er reell, men fasiliteter og tilgjengelighet må kontrolleres separat.</p><ul>{place.identitySourceUrl && <li>Stedsidentitet: <a href={place.identitySourceUrl} target="_blank" rel="noreferrer">åpen kilde</a>{place.identityCheckedAt && ` (kontrollert ${formatCheckedDate(place.identityCheckedAt)})`}</li>}{place.coordinatesSourceUrl && <li>Posisjon: <a href={place.coordinatesSourceUrl} target="_blank" rel="noreferrer">åpen kilde</a>{place.coordinatesCheckedAt && ` (kontrollert ${formatCheckedDate(place.coordinatesCheckedAt)})`}</li>}</ul></>}</details><details className="place-feedback"><summary>Meld fra eller bekreft informasjon</summary><p className="muted">Tilbakemeldingen lagres bare lokalt i denne prototypen.</p><div className="feedback-actions"><button className="text-button" type="button" onClick={() => setReportMode('confirm')}>Bekreft opplysninger</button><button className="text-button" type="button" onClick={() => setReportMode('error')}>Meld fra om feil</button></div>{reportMode && <form onSubmit={submitReport}><label>{reportMode === 'confirm' ? 'Hva vil du bekrefte? (valgfritt)' : 'Hva er feil?'}<textarea rows={3} value={reportMessage} required={reportMode === 'error'} onChange={(event) => setReportMessage(event.target.value)} /></label><button className="button secondary" type="submit">Lagre lokalt</button></form>}{reportSent && <p className="saved-note" role="status">Takk. Tilbakemeldingen er lagret lokalt.</p>}</details>{place.coordinates && !isFictional(place) && <a className="button secondary" href={`https://www.openstreetmap.org/?mlat=${place.coordinates.lat}&mlon=${place.coordinates.lng}#map=17/${place.coordinates.lat}/${place.coordinates.lng}`} target="_blank" rel="noreferrer">Vis vei (ekstern)</a>}</div></div></>, document.body);
}

function Explore() {
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<PlaceCategory | 'all'>('all');
  const [filters, setFilters] = useState<FacilityName[]>([]);
  const [favoriteOnly, setFavoriteOnly] = useState(false);
  const [showAdditionalFilters, setShowAdditionalFilters] = useState(false);
  const [view, setView] = useState<'map' | 'list'>('map');
  const [selected, setSelected] = useState<Place | null>(null);
  const [favorites, setFavorites] = useState(readFavoriteIds);
  const [tripSelection, setTripSelection] = useState(readTripSelection);
  const navigate = useNavigate();
  useEffect(() => {
    const urlFilter = searchParams.get('filter');
    const nextFilter = quickFilters.includes(urlFilter as FacilityName) ? [urlFilter as FacilityName] : [];
    setFilters(nextFilter);
    setShowAdditionalFilters(urlFilter === 'free_activity');
  }, [searchParams]);
  const results = useMemo(() => places.filter((place) => matchesPlace(place, search, category, filters) && (!favoriteOnly || favorites.includes(place.id))), [search, category, filters, favoriteOnly, favorites]);
  const toggleFavorite = (id: string) => { const next = favorites.includes(id) ? favorites.filter((item) => item !== id) : [...favorites, id]; setFavorites(next); writeFavoriteIds(next); };
  const reset = () => {
    setSearch('');
    setCategory('all');
    setFilters([]);
    setFavoriteOnly(false);
    setShowAdditionalFilters(false);
    navigate('/utforsk');
  };
  const toggleTripSelection = (id: string) => {
    const next = tripSelection.includes(id)
      ? tripSelection.filter((item) => item !== id)
      : tripSelection.length < 3 ? [...tripSelection, id] : tripSelection;
    setTripSelection(next);
    writeTripSelection(next);
  };
  const createTripPlan = () => { writeTripSelection(tripSelection); navigate('/planlegg'); };
  return <section className="page explore">
    <div className="section-intro"><div><p className="eyebrow">Kristiansand og nærområdene</p><h1>Utforsk steder</h1></div><span className="result-count">{results.length} treff</span></div>
    <p className="explore-trust-note">Ja og Nei kommer fra oppføringens informasjon. Ukjent betyr at vi ikke har bekreftet opplysningen. <span className="marker-legend"><span className="legend-dot real" aria-hidden="true" />Reelt sted <span className="legend-dot demo" aria-hidden="true" />Demosted</span></p>
    {filters.length > 0 && <p className="filter-status-note" role="status">{results.length === 0 ? 'Ingen treff med bekreftet «Ja». Steder med «Ukjent» inngår ikke i filtreringen.' : 'Fasilitetsfilteret viser bare steder med bekreftet «Ja». Steder med «Ukjent» inngår ikke i resultatene.'}</p>}
    <div className="controls explore-controls">
      <label className="search-field">Søk etter sted<input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Navn, område eller tag" /></label>
      <div className="filter-group primary-filters"><span className="label">Praktiske behov</span>{primaryFilters.map((filter) => <label className="checkbox" key={filter}><input type="checkbox" checked={filters.includes(filter)} onChange={() => setFilters(filters.includes(filter) ? filters.filter((item) => item !== filter) : [...filters, filter])} />{facilityLabels[filter]}</label>)}</div>
      <div className="explore-filter-actions"><label className="checkbox favorite-filter"><input type="checkbox" checked={favoriteOnly} onChange={(event) => setFavoriteOnly(event.target.checked)} />Kun favoritter</label><button className="text-button" type="button" onClick={() => setShowAdditionalFilters((open) => !open)} aria-expanded={showAdditionalFilters}>{showAdditionalFilters ? 'Skjul flere filtre' : 'Flere filtre'}</button></div>
      {showAdditionalFilters && <div className="additional-filters"><label>Kategori<select value={category} onChange={(event) => setCategory(event.target.value as PlaceCategory | 'all')}><option value="all">Alle kategorier</option>{Object.entries(categoryLabels).map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label><div className="filter-group">{additionalFilters.map((filter) => <label className="checkbox" key={filter}><input type="checkbox" checked={filters.includes(filter)} onChange={() => setFilters(filters.includes(filter) ? filters.filter((item) => item !== filter) : [...filters, filter])} />{facilityLabels[filter]}</label>)}</div></div>}
      {(search || category !== 'all' || filters.length > 0 || favoriteOnly) && <button className="text-button reset-filters" type="button" onClick={reset}>Nullstill filtre</button>}
    </div>
    <div className="view-toggle" role="group" aria-label="Visning"><button className={view === 'map' ? 'active' : ''} onClick={() => setView('map')}>Kart</button><button className={view === 'list' ? 'active' : ''} onClick={() => setView('list')}>Liste</button></div>
    <TripSelectionBar selectedIds={tripSelection} onClear={() => { setTripSelection([]); writeTripSelection([]); }} onCreatePlan={createTripPlan} />
    <div className={`explore-layout ${view}`}><div className="map-area" aria-label="Kart over Kristiansand"><MapContainer center={[58.1467, 7.9956]} zoom={13} scrollWheelZoom><TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" /><MapViewport visiblePlaces={results} />{results.filter((place) => place.coordinates).map((place) => <Marker position={[place.coordinates!.lat, place.coordinates!.lng]} icon={isFictional(place) ? demoPlaceMarker : realPlaceMarker} key={place.id}><Popup><strong>{place.name}</strong><br />{isFictional(place) ? 'Fiktivt demosted' : 'Reell stedsidentitet'}<br /><button onClick={() => setSelected(place)}>Se detaljer</button></Popup></Marker>)}</MapContainer></div><div className="results" aria-live="polite"><div className="results-heading"><h2>Steder i området</h2><span className="muted">{results.length} treff</span></div>{results.length ? results.map((place) => <PlaceCard key={place.id} place={place} favorite={favorites.includes(place.id)} inTrip={tripSelection.includes(place.id)} canAdd={tripSelection.length < 3} onFavorite={() => toggleFavorite(place.id)} onSelect={() => setSelected(place)} onToggleTrip={() => toggleTripSelection(place.id)} />) : <div className="empty-state"><h2>Ingen treff</h2><p>Prøv et annet søk eller fjern noen filtre.</p><button className="button secondary" onClick={reset}>Nullstill filtre</button></div>}</div></div>{selected && <PlaceDetails place={selected} inTrip={tripSelection.includes(selected.id)} canAdd={tripSelection.length < 3} onClose={() => setSelected(null)} onToggleTrip={() => toggleTripSelection(selected.id)} />}</section>;
}

function TripPlanner() {
  const [plan, setPlan] = useState<TripPlan | null>(readTripPlan);
  const savedSelection = readTripSelection();
  const [placeIds, setPlaceIds] = useState(savedSelection.length > 0 ? savedSelection : plan?.placeIds ?? []);
  const [date, setDate] = useState(plan?.date ?? '');
  const [note, setNote] = useState(plan?.note ?? '');
  const selectedPlaces = placeIds.map((id) => places.find((place) => place.id === id)).filter((place): place is Place => Boolean(place));
  const isSaved = Boolean(plan && plan.date === date && plan.note === note && plan.placeIds.length === placeIds.length && plan.placeIds.every((id, index) => id === placeIds[index]));
  const togglePlace = (id: string) => setPlaceIds((current) => {
    const next = current.includes(id) ? current.filter((item) => item !== id) : current.length < 3 ? [...current, id] : current;
    writeTripSelection(next);
    return next;
  });
  const movePlace = (index: number, direction: -1 | 1) => {
    setPlaceIds((current) => {
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= current.length) return current;
      const next = [...current];
      [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
      writeTripSelection(next);
      return next;
    });
  };
  const removeAll = () => {
    setPlaceIds([]);
    writeTripSelection([]);
  };
  const startNew = () => {
    removeTripPlan();
    writeTripSelection([]);
    setPlan(null);
    setPlaceIds([]);
    setDate('');
    setNote('');
  };
  const directionsUrl = buildExternalDirectionsUrl(selectedPlaces);
  const hasFictionalStops = selectedPlaces.some((place) => isFictional(place));
  const save = () => {
    const next = { placeIds, date, note };
    writeTripPlan(next);
    setPlan(next);
    writeTripSelection([]);
  };
  return <section className="page trip-planner"><div className="section-intro"><div><p className="eyebrow">Min tur</p><h1>Sett sammen en liten tur</h1></div>{selectedPlaces.length > 0 && <Link className="button secondary" to="/utforsk">Endre stopp</Link>}</div><p className="lead">Velg opptil tre stopp fra Utforsk. Dato og notat kan legges til når dere er klare.</p><div className="planner-grid"><section className="card"><h2>Valgte stopp</h2>{selectedPlaces.length === 0 ? <div className="empty-plan"><p className="muted">Ingen stopp er valgt i dette utkastet.</p><Link className="button primary" to="/utforsk">Finn steder til turen</Link><p className="directions-hint">Vil du prøve veibeskrivelse? Velg Bystranda og Fiskebrygga i Utforsk.</p>{plan && <button className="text-button" type="button" onClick={startNew}>Start ny tur og slett lagret tur</button>}</div> : <><div className="selected-stops">{selectedPlaces.map((place, index) => <div className="selected-stop" key={place.id}><span className="stop-number">{index + 1}</span><div><strong>{place.name}</strong><p className="muted">{categoryLabels[place.category]} · {place.addressOrArea}</p><div className="stop-actions"><button className="text-button" type="button" onClick={() => movePlace(index, -1)} disabled={index === 0} aria-label={`Flytt ${place.name} opp`}>↑ Opp</button><button className="text-button" type="button" onClick={() => movePlace(index, 1)} disabled={index === selectedPlaces.length - 1} aria-label={`Flytt ${place.name} ned`}>↓ Ned</button><button className="text-button" type="button" onClick={() => togglePlace(place.id)}>Fjern</button></div></div></div>)}</div><button className="text-button" type="button" onClick={removeAll}>Fjern alle stopp</button></>}<label>Når passer det?<input type="date" value={date} onChange={(event) => setDate(event.target.value)} /></label><label>Hva vil dere huske?<textarea rows={4} value={note} onChange={(event) => setNote(event.target.value)} placeholder="For eksempel: ta med ekstra skift." /></label><button className="button primary" disabled={!selectedPlaces.length} onClick={save}>Lagre Min tur</button>{plan && !isSaved && <p className="unsaved-note" role="status">Tidligere lagret tur er uendret. Endringer i dette utkastet er ikke lagret.</p>}{!plan && savedSelection.length > 0 && <p className="unsaved-note" role="status">Dette er ulagret valg fra Utforsk.</p>}<div className="directions-block">{directionsUrl ? <><p className="directions-ready"><strong>Veibeskrivelse er klar.</strong> Google Maps åpnes i en ny fane og bruker stopprekkefølgen.</p><a className="button primary external-directions" href={directionsUrl} target="_blank" rel="noreferrer">Åpne veibeskrivelse i Google Maps</a></> : selectedPlaces.length > 0 ? <p className="muted directions-unavailable">{hasFictionalStops ? 'Veibeskrivelse er ikke tilgjengelig fordi turen inneholder fiktive demosteder. Veibeskrivelse opprettes bare for reelle steder.' : 'Ekstern veibeskrivelse er bare tilgjengelig for reelle steder med kontrollert posisjon.'}</p> : <p className="directions-hint">Vil du prøve veibeskrivelse? Velg Bystranda og Fiskebrygga i Utforsk.</p>}</div></section><section className="card plan-preview"><p className="eyebrow">Oversikt</p>{selectedPlaces.length === 0 ? <h2>Min tur er tom</h2> : <ol className="plan-stop-list">{selectedPlaces.map((place) => <li key={place.id}><h2>{place.name}</h2><p className="muted">{place.addressOrArea} · {categoryLabels[place.category]}</p><p>{place.shortDescription}</p>{place.routeInfo && <p className="route-summary"><strong>Trilletur:</strong> {place.routeInfo.lengthKm} km · {place.routeInfo.surfaceText}</p>}<ul>{Object.entries(place.facilities).slice(0, 4).map(([name, claim]) => <li key={name}><strong>{facilityLabels[name as FacilityName]}:</strong> {claim?.value === 'yes' ? 'Ja' : claim?.value === 'no' ? 'Nei' : 'Ukjent'}</li>)}</ul></li>)}</ol>}{isSaved && <p className="saved-note" role="status">Min tur er lagret lokalt.</p>}</section></div></section>;
}

const today = () => {
  const date = new Date();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
};

function JourneySetup({ onSave, initialProfile, onCancel, submitLabel = 'Lagre lokal demoprofil' }: { onSave: (profile: DemoProfile) => void; initialProfile?: DemoProfile; onCancel?: () => void; submitLabel?: string }) {
  const [stage, setStage] = useState<JourneyStage>(initialProfile?.stage ?? 'expecting');
  const [inputMode, setInputMode] = useState<'dueDate' | 'week'>(initialProfile?.enteredPregnancyWeek ? 'week' : 'dueDate');
  const [dueDate, setDueDate] = useState(initialProfile?.dueDate ?? '');
  const [week, setWeek] = useState(initialProfile?.enteredPregnancyWeek?.toString() ?? '');
  const [birthDate, setBirthDate] = useState(initialProfile?.childBirthDate ?? '');
  const [ageYears, setAgeYears] = useState(initialProfile?.childAgeYears?.toString() ?? '');
  const [childAgeMode, setChildAgeMode] = useState<'birthDate' | 'age'>(initialProfile?.childBirthDate ? 'birthDate' : 'age');
  const [preference, setPreference] = useState<ContentPreference>(initialProfile?.contentPreference ?? 'general');
  const canSave = stage !== 'expecting' || (inputMode === 'dueDate' ? Boolean(dueDate) : Number(week) >= 1 && Number(week) <= 42);
  const save = () => {
    if (!canSave) return;
    onSave({
      stage,
      ...(stage === 'expecting' && inputMode === 'dueDate' ? { dueDate } : {}),
      ...(stage === 'expecting' && inputMode === 'week' ? { enteredPregnancyWeek: Number(week), enteredWeekAnchorDate: today() } : {}),
      ...(stage === 'baby_born' && childAgeMode === 'birthDate' && birthDate ? { childBirthDate: birthDate } : {}),
      ...(stage === 'baby_born' && childAgeMode === 'age' && ageYears ? { childAgeYears: Number(ageYears) } : {}),
      contentPreference: preference,
      notificationPreference: 'preview_only',
    });
  };
  return <div className="journey-setup card"><p className="eyebrow">{initialProfile ? 'Endre opplysninger' : 'Frivillig demoprofil'}</p><h2>{initialProfile ? 'Oppdater det som skal styre Min baby' : 'Hva passer for deg nå?'}</h2><p className="muted">Du kan utforske kartet uten profil. Opplysningene lagres bare lokalt i denne nettleseren.</p><div className="choice-grid"><label className="choice"><input type="radio" checked={stage === 'expecting'} onChange={() => setStage('expecting')} />Jeg venter barn</label><label className="choice"><input type="radio" checked={stage === 'baby_born'} onChange={() => setStage('baby_born')} />Jeg har fått barn</label><label className="choice"><input type="radio" checked={stage === 'prefer_not_to_say'} onChange={() => setStage('prefer_not_to_say')} />Jeg vil bare utforske</label></div>{stage === 'expecting' && <fieldset><legend>Velg én inngang</legend><div className="choice-grid"><label className="choice"><input type="radio" checked={inputMode === 'dueDate'} onChange={() => setInputMode('dueDate')} />Termindato</label><label className="choice"><input type="radio" checked={inputMode === 'week'} onChange={() => setInputMode('week')} />Svangerskapsuke</label></div>{inputMode === 'dueDate' ? <label>Termindato (obligatorisk)<input type="date" required value={dueDate} onChange={(event) => setDueDate(event.target.value)} /></label> : <label>Aktuell svangerskapsuke (1–42, obligatorisk)<input type="number" min="1" max="42" required value={week} onChange={(event) => setWeek(event.target.value)} /></label>}<p className="muted">Visningen er omtrentlig og ikke en klinisk vurdering.</p></fieldset>}{stage === 'baby_born' && <fieldset><legend>Barnets alder</legend><p className="muted">Velg én metode, slik at opplysningene ikke gir motstridende alder.</p><div className="choice-grid"><label className="choice"><input type="radio" checked={childAgeMode === 'birthDate'} onChange={() => setChildAgeMode('birthDate')} />Fødselsdato</label><label className="choice"><input type="radio" checked={childAgeMode === 'age'} onChange={() => setChildAgeMode('age')} />Omtrentlig alder</label></div>{childAgeMode === 'birthDate' ? <label>Fødselsdato (valgfritt)<input type="date" value={birthDate} onChange={(event) => setBirthDate(event.target.value)} /></label> : <label>Barnets alder i hele år<select value={ageYears} onChange={(event) => setAgeYears(event.target.value)}><option value="">Velg alder (valgfritt)</option>{[0, 1, 2, 3, 4, 5, 6].map((age) => <option value={age} key={age}>{age} år</option>)}</select></label>}</fieldset>}<label>Innholdspreferanse<select value={preference} onChange={(event) => setPreference(event.target.value as ContentPreference)}><option value="general">Generelt</option><option value="dad">Pappa/medforelder</option><option value="pregnant_parent">Den gravide</option><option value="both">Begge</option></select></label><p className="form-hint" role="status">{!canSave && stage === 'expecting' ? 'Velg termindato eller svangerskapsuke for å lagre profilen.' : 'Du kan endre opplysningene senere i Profil.'}</p><div className="form-actions"><button className="button primary" disabled={!canSave} onClick={save}>{submitLabel}</button>{onCancel && <button className="text-button" type="button" onClick={onCancel}>Avbryt</button>}</div></div>;
}

function ChecklistProgress({ items, checkedItemIds }: { items: { id: string }[]; checkedItemIds: string[] }) {
  const completed = items.filter((item) => checkedItemIds.includes(item.id)).length;
  return <span className="checklist-progress">{completed} av {items.length} klart</span>;
}

function Journey({ state, onChange }: { state: DemoState; onChange: (state: DemoState) => void }) {
  const profile = state.profile;
  const currentDate = today();
  const week = profile ? getJourneyWeek(profile, currentDate) : null;
  const milestone = profile ? getCurrentMilestone(profile, currentDate) : null;
  const childAgeMonths = profile?.stage === 'baby_born' ? getChildAgeMonths(profile, currentDate) : undefined;
  const childAgeYears = profile?.stage === 'baby_born' ? getChildAgeYears(profile, currentDate) : undefined;
  const childAgeLabel = formatChildAge(childAgeMonths, childAgeYears);
  const ageActivities = childAgeYears === undefined ? [] : activitiesForAge(childAgeYears);
  const kindergartenItems = profile?.stage === 'baby_born' && childAgeYears !== undefined
    ? kindergartenChecklistForAge(childAgeYears)
    : [];
  const ageDescription = childAgeMonths !== undefined && childAgeMonths < 12
    ? getBabyAgeDescription(childAgeMonths)
    : childAgeYears !== undefined ? getAgeDescription(childAgeYears) : null;
  const pregnancyItems = profile?.stage === 'expecting' && week ? pregnancyChecklistForWeek(week) : [];
  const toggleItem = (id: string) => onChange({ ...state, checkedItemIds: state.checkedItemIds.includes(id) ? state.checkedItemIds.filter((item) => item !== id) : [...state.checkedItemIds, id] });
  if (!profile) return <section className="page"><p className="eyebrow">Min baby</p><h1>En rolig oversikt over det praktiske.</h1><p className="lead">Velg selv om du vil bruke en liten, lokal demoprofil. Ingen innlogging eller e-post er nødvendig.</p><JourneySetup onSave={(next) => onChange({ ...initialDemoState, profile: next })} /></section>;
  const relevantItems = childAgeYears === undefined
    ? checklistItemsForAge(0)
    : checklistItemsForAge(childAgeYears);
  const phaseLabel = profile.stage === 'expecting' ? 'Du venter barn' : profile.stage === 'baby_born' ? `Barnet er ${childAgeLabel}` : 'Du utforsker uten valgt fase';
  return (
    <section className="page journey">
      <div className="section-intro">
        <div><p className="eyebrow">Min baby · lokal demo</p><h1>Din personlige oversikt</h1></div>
      </div>
      <article className="card journey-overview"><div><p className="eyebrow">Dette gjelder for dere</p><h2>{phaseLabel}</h2><p>{profile.stage === 'expecting' ? `Omtrentlig svangerskapsuke ${week ?? 'ukjent'}` : profile.stage === 'baby_born' && ageDescription ? ageDescription : 'Du kan utforske uten å velge en fase.'}</p>{profile.stage === 'baby_born' && <p className="muted">Et generelt eksempel – barn utvikler seg ulikt.</p>}<p className="muted">Dette er generell demo-informasjon, ikke medisinsk rådgivning.</p></div><Link className="button secondary" to="/profil">Endre opplysninger</Link></article>
      {milestone && <article className="card milestone"><p className="eyebrow">Mest relevant nå</p><h2>{milestone.title}</h2><p>{milestone.body}</p>{profile.contentPreference === 'dad' && milestone.dadTip && <p><strong>Råd til far/medforelder:</strong> {milestone.dadTip}</p>}{profile.contentPreference !== 'dad' && milestone.pregnantParentTip && <p><strong>Råd til mor/den gravide:</strong> {milestone.pregnantParentTip}</p>}{profile.contentPreference !== 'dad' && milestone.dadTip && <p><strong>Råd til far/medforelder:</strong> {milestone.dadTip}</p>}{profile.contentPreference === 'dad' && milestone.pregnantParentTip && <p><strong>Også relevant for den gravide:</strong> {milestone.pregnantParentTip}</p>}<Link className="button secondary" to="/utforsk">Finn steder å besøke</Link></article>}
      <ExploreShortcuts />
      {profile.stage === 'expecting' && week && <section className="card pregnancy-source-card">
        <div className="section-intro"><div><p className="eyebrow">Praktiske steg fra uke {week}</p><h2>Forberedelser dere kan vurdere</h2></div><span className="demo-label">Kildebelagte prototypetips</span></div>
        <p className="muted">Dette er praktiske påminnelser, ikke medisinske råd. Snakk med jordmor eller annet helsepersonell om spørsmål som gjelder helse eller oppfølging.</p>
        <div className="checklist-grid">{['practical', 'preparation', 'economy', 'work'].map((category) => { const items = pregnancyItems.filter((item) => item.category === category); return <div key={category}><h3>{{ practical: 'Praktisk', preparation: 'Forberedelse', economy: 'Økonomi', work: 'Jobb og studier' }[category as 'practical' | 'preparation' | 'economy' | 'work']} <ChecklistProgress items={items} checkedItemIds={state.checkedItemIds} /></h3>{items.map((item) => <label className="check-item" key={item.id}><input type="checkbox" checked={state.checkedItemIds.includes(item.id)} onChange={() => toggleItem(item.id)} />{item.label}</label>)}</div>; })}</div>
        <p className="source-note">Kilder: <a href="https://www.helsenorge.no/gravid/" target="_blank" rel="noreferrer">Helsenorge – graviditet</a>, <a href="https://www.nav.no/foreldrepenger" target="_blank" rel="noreferrer">NAV – foreldrepenger</a> og <a href="https://www.helsenorge.no/gravid/svangerskapskontroller/" target="_blank" rel="noreferrer">svangerskapskontroller</a>. Innholdet er bearbeidet og avgrenset for studentprototypen.</p>
      </section>}
      {profile.stage === 'baby_born' && <section className="card age-activities">
        <details><summary>Aktiviteter for deres aldersgruppe</summary><p className="muted">{childAgeYears === undefined ? 'Velg barnets alder på profilsiden for å få tilpassede forslag.' : `Forslag for barn på ${childAgeYears} år`}</p>
        {ageActivities.length ? <div className="activity-list">{ageActivities.map((activity) => <article className="activity-card" key={activity.id}><h3>{activity.title}</h3><p>{activity.description}</p><p className="muted">Tilpasset {childAgeLabel}</p><span className="demo-label">Fiktiv aktivitet</span></article>)}</div> : <p>Ingen forslag for denne alderen i demoen ennå.</p>}
        </details>
      </section>}
      {profile.stage === 'baby_born' && kindergartenItems.length > 0 && <section className="card kindergarten-source-card">
        <details><summary>Forbered barnehage og skolestart</summary><p className="muted">Praktisk sjekkliste for barnehagebarn · Tilpasset {childAgeLabel}</p>
        <p className="muted">Tipsene er forslag, ikke en universell kravliste. Sjekk også hva deres barnehage eller skole ønsker at barnet har med.</p>
        <div className="checklist-grid">{['clothing', 'comfort', 'routine'].map((category) => { const items = kindergartenItems.filter((item) => item.category === category); return <div key={category}><h3>{{ clothing: 'Klær og vær', comfort: 'Trygghet', routine: 'Rutiner' }[category as 'clothing' | 'comfort' | 'routine']} <ChecklistProgress items={items} checkedItemIds={state.checkedItemIds} /></h3>{items.map((item) => <label className="check-item" key={item.id}><input type="checkbox" checked={state.checkedItemIds.includes(item.id)} onChange={() => toggleItem(item.id)} />{item.label}</label>)}</div>; })}</div>
        <p className="source-note">Kilde: <a href="https://www.udir.no/laring-og-trivsel/rammeplan-for-barnehagen/" target="_blank" rel="noreferrer">Utdanningsdirektoratet – rammeplan for barnehagen</a>. Innholdet er bearbeidet for studentprototypen.</p>
        </details>
      </section>}
      <section className="card">
        <div className="section-intro"><div><p className="eyebrow">Neste steg</p><h2>Sjekklister</h2><p className="muted">{profile.stage === 'baby_born' && childAgeYears !== undefined ? `Forslag for barn på ${childAgeLabel}` : 'Generelle forslag for den første tiden'}</p></div></div>
        <div className="checklist-grid">{['equipment', 'practical'].map((listId) => { const items = relevantItems.filter((item) => item.listId === listId); return <div key={listId}><h3>{listId === 'equipment' ? 'Utstyr og tur' : 'Praktisk støtte'} <ChecklistProgress items={items} checkedItemIds={state.checkedItemIds} /></h3>{items.map((item) => <label className="check-item" key={item.id}><input type="checkbox" checked={state.checkedItemIds.includes(item.id)} onChange={() => toggleItem(item.id)} />{item.label}</label>)}</div>; })}</div>
      </section>
      <details className="card notification-preview"><summary>Varslingsforhåndsvisning</summary><p className="demo-label">Ikke sendt – prototype</p><p>En rolig påminnelse om neste praktiske steg kan vises her. Appen sender ingen e-post eller pushvarsler.</p></details>
    </section>
  );
}

function Profile({ state, onChange, onClear }: { state: DemoState; onChange: (state: DemoState) => void; onClear: () => void }) {
  const profile = state.profile;
  const [editing, setEditing] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [cleared, setCleared] = useState(false);
  const clearAll = () => {
    onClear();
    setConfirming(false);
    setCleared(true);
  };
  if (editing && profile) return <section className="page profile-page"><p className="eyebrow">Profil og innstillinger</p><h1>Endre opplysninger</h1><p className="lead">Oppdater fase, alder eller innholdspreferanse. Min baby bruker endringene med én gang.</p><JourneySetup key="profile-editor" initialProfile={profile} onSave={(next) => { onChange({ ...state, profile: next }); setEditing(false); }} onCancel={() => setEditing(false)} submitLabel="Lagre opplysninger" /></section>;
  const profileAgeMonths = profile?.stage === 'baby_born' ? getChildAgeMonths(profile, today()) : undefined;
  const profileAgeYears = profile?.stage === 'baby_born' ? getChildAgeYears(profile, today()) : undefined;
  const phaseLabel = profile?.stage === 'expecting' ? 'Jeg venter barn' : profile?.stage === 'baby_born' ? `Barnet er ${formatChildAge(profileAgeMonths, profileAgeYears)}` : 'Jeg vil bare utforske';
  return <section className="page profile-page"><p className="eyebrow">Profil og innstillinger</p><h1>Lokale opplysninger</h1><p className="lead">Her endrer du det som brukes for å tilpasse Min baby. Ingenting sendes videre.</p>{profile ? <section className="card profile-summary"><p className="eyebrow">Din profil</p><h2>{phaseLabel}</h2><p className="muted">Innhold: {profile.contentPreference === 'dad' ? 'Pappa/medforelder' : profile.contentPreference === 'pregnant_parent' ? 'Den gravide' : profile.contentPreference === 'both' ? 'Begge' : 'Generelt'}</p><button className="button primary" onClick={() => setEditing(true)}>Endre opplysninger</button><Link className="text-button" to="/reise">Tilbake til Min baby</Link></section> : <section className="card profile-summary"><h2>Ingen lagret profil</h2><p>Du kan opprette en frivillig lokal profil når du vil ha personlig oversikt i Min baby.</p><Link className="button primary" to="/reise">Opprett profil i Min baby</Link></section>}<section className="card privacy-card" aria-labelledby="privacy-title"><p className="eyebrow">Lokal lagring</p><h2 id="privacy-title">Data på denne enheten</h2><p>Alder, favoritter, Min tur og tilbakemeldinger lagres bare i denne nettleseren.</p>{!confirming ? <button className="danger-button" onClick={() => { setConfirming(true); setCleared(false); }}>Slett alle mine data</button> : <div className="privacy-confirm"><p><strong>Er du sikker?</strong> Dette kan ikke angres.</p><div><button className="danger-button" onClick={clearAll}>Ja, slett alt</button><button className="text-button" onClick={() => setConfirming(false)}>Avbryt</button></div></div>}<div role="status">{cleared && <p className="status-message">Alle dine data er slettet fra denne nettleseren.</p>}</div></section></section>;
}

function Placeholder({ title, text }: { title: string; text: string }) {
  return <section className="page placeholder"><p className="eyebrow">Kommer i neste fase</p><h1>{title}</h1><p className="lead">{text}</p><Link className="button primary" to="/utforsk">Utforsk kartet</Link></section>;
}

export function App() {
  const [journeyState, setJourneyState] = useState<DemoState>(readDemoState);
  const updateJourney = (next: DemoState) => { setJourneyState(next); writeDemoState(next); };
  const clearJourney = () => { clearDemoState(); setJourneyState(initialDemoState); };
  return <Shell><Routes><Route path="/" element={<Home />} /><Route path="/utforsk" element={<Explore />} /><Route path="/planlegg" element={<TripPlanner />} /><Route path="/reise" element={<Journey state={journeyState} onChange={updateJourney} />} /><Route path="/guider" element={<Guides />} /><Route path="/partnere" element={<PartnerOffers />} /><Route path="/little-babybot" element={<LittleBabyBot />} /><Route path="/partnerportal" element={<PartnerPortal />} /><Route path="/profil" element={<Profile state={journeyState} onChange={updateJourney} onClear={clearJourney} />} /></Routes></Shell>;
}
