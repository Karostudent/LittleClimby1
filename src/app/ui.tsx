import { useEffect, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import type { TriState } from '../domain/places';

export type IconName =
  | 'home' | 'map' | 'route' | 'heart' | 'user' | 'check' | 'close' | 'question' | 'search'
  | 'back' | 'chevron' | 'up' | 'down' | 'plus' | 'star' | 'navigate' | 'shield' | 'info' | 'lock';

const paths: Record<IconName, ReactNode> = {
  home: <path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z" />,
  map: <><path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2-6-2z" /><path d="M9 4v14M15 6v14" /></>,
  route: <><circle cx="6" cy="19" r="2" /><circle cx="18" cy="5" r="2" /><path d="M8 19h7a3.5 3.5 0 0 0 0-7H9a3.5 3.5 0 0 1 0-7h7" /></>,
  heart: <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
  check: <path d="M5 12l5 5L20 7" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  question: <path d="M9 9a3 3 0 1 1 4 2.8c-.7.3-1 .9-1 1.7V14M12 18h.01" />,
  search: <><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></>,
  back: <path d="M15 5l-7 7 7 7" />,
  chevron: <path d="M9 5l7 7-7 7" />,
  up: <path d="M6 15l6-6 6 6" />,
  down: <path d="M6 9l6 6 6-6" />,
  plus: <path d="M12 5v14M5 12h14" />,
  star: <path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z" />,
  navigate: <path d="M3 11l18-8-8 18-2-8z" />,
  shield: <><path d="M12 3l8 3v6c0 4.5-3.4 8-8 9-4.6-1-8-4.5-8-9V6z" /><path d="M8.5 12l2.5 2.5 4.5-5" /></>,
  info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v6M12 7.5h.01" /></>,
  lock: <><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></>,
};

/** Dekorativt ikon. Navnet på knappen eller lenken må alltid stå i teksten ved siden av. */
export function Icon({ name, size = 20, strokeWidth = 2 }: { name: IconName; size?: number; strokeWidth?: number }) {
  return (
    <svg className="icon" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      {paths[name]}
    </svg>
  );
}

export function BrandMark({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <circle cx="16" cy="16" r="16" fill="#92CEC7" />
      <path d="M8 21c3-5 6-7 8-7s5 2 8 7" fill="none" stroke="#3F2E2E" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="16" cy="10" r="3" fill="#fff" />
    </svg>
  );
}

const statusText: Record<TriState, string> = { yes: 'Ja', no: 'Nei', unknown: 'Ukjent' };
const statusIcon: Record<TriState, IconName> = { yes: 'check', no: 'close', unknown: 'question' };

/** Status vises alltid med både ikon og tekst, ikke bare farge. */
export function StatusChip({ value, label }: { value: TriState; label?: string }) {
  return (
    <span className={`chip chip-${value}`}>
      <Icon name={statusIcon[value]} size={13} strokeWidth={3} />
      {label ? `${label}: ${statusText[value]}` : statusText[value]}
    </span>
  );
}

export function DataBadge({ real }: { real: boolean }) {
  return real ? <span className="badge badge-real">Reelt sted</span> : <span className="badge badge-demo">Eksempeldata</span>;
}

export function BackLink({ to, children }: { to: string; children: ReactNode }) {
  return <Link className="back-link" to={to}><Icon name="back" strokeWidth={2.4} />{children}</Link>;
}

export function PageHeader({ eyebrow, title, lead, children }: { eyebrow?: string; title: string; lead?: string; children?: ReactNode }) {
  return (
    <header className="page-header">
      <div className="page-header-inner">
        {children}
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1 tabIndex={-1}>{title}</h1>
        {lead && <p className="page-lead">{lead}</p>}
      </div>
    </header>
  );
}

export function usePageTitle(title: string) {
  useEffect(() => {
    document.title = `${title} – Enklere babyliv`;
  }, [title]);
}

export const formatLongDate = (value: string) =>
  new Date(`${value}T12:00:00`).toLocaleDateString('nb-NO', { day: 'numeric', month: 'long', year: 'numeric' });

/** Dagens dato som ÅÅÅÅ-MM-DD i lokal tid. */
export const today = () => {
  const date = new Date();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
};
