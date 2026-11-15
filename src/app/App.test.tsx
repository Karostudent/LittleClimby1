import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { App } from './App';

// Kartet (Leaflet) trenger en ekte nettleser. I testene erstatter vi det med enkle elementer.
vi.mock('react-leaflet', () => ({
  MapContainer: ({ children }: { children: React.ReactNode }) => <div data-testid="map">{children}</div>,
  TileLayer: () => null,
  Marker: () => <span data-testid="pin" />,
}));

const renderAt = (path: string) => render(<MemoryRouter initialEntries={[path]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><App /></MemoryRouter>);

describe('app shell', () => {
  beforeEach(() => localStorage.clear());

  it('has one main menu with five destinations and a skip link', () => {
    renderAt('/');
    const nav = screen.getByRole('navigation', { name: 'Hovedmeny' });
    expect(within(nav).getAllByRole('link')).toHaveLength(5);
    expect(screen.getByRole('link', { name: 'Hopp til innholdet' })).toHaveAttribute('href', '#main');
  });
});

describe('Utforsk', () => {
  beforeEach(() => localStorage.clear());

  it('announces only the number of results and drops places with unknown facilities when filtering', () => {
    renderAt('/utforsk');
    const status = screen.getByRole('status');
    expect(status).toHaveTextContent('15 steder');
    expect(screen.getByRole('heading', { name: 'Bystranda' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Stellerom' }));
    expect(screen.getByRole('button', { name: /Stellerom/ })).toHaveAttribute('aria-pressed', 'true');
    expect(status.textContent).not.toBe('15 steder');
    expect(screen.queryByRole('heading', { name: 'Bystranda' })).not.toBeInTheDocument();
  });

  it('reads filters from the address so the home page can link straight to a filter', () => {
    renderAt('/utforsk?filter=changing_table,stroller_space,changing_access_all_caregivers');
    expect(screen.getByRole('status')).toHaveTextContent('1 sted');
    expect(screen.getByRole('heading', { name: 'Demokafé Solgløtt' })).toBeInTheDocument();
  });

  it('adds at most three places to the trip and shows the count in the menu', () => {
    renderAt('/utforsk');
    const addButtons = screen.getAllByRole('button', { name: /^Legg til tur/ });
    addButtons.slice(0, 3).forEach((button) => fireEvent.click(button));
    expect(screen.getByText('3', { selector: '.nav-badge' })).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /^Turen er full/ })[0]).toBeDisabled();
  });
});

describe('Stedsdetalj', () => {
  beforeEach(() => localStorage.clear());

  it('shows check dates, sources and directions for a real place', () => {
    renderAt('/utforsk/real-bystranda');
    expect(screen.getByRole('heading', { level: 1, name: 'Bystranda' })).toBeInTheDocument();
    expect(screen.getByText('4. november 2026')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Vis vei i kartappen/ })).toHaveAttribute('href', expect.stringContaining('google.com/maps/dir'));
  });

  it('does not offer directions for a fictional place', () => {
    renderAt('/utforsk/demo-solglott');
    expect(screen.queryByRole('link', { name: /Vis vei/ })).not.toBeInTheDocument();
    expect(screen.getByText(/Ingenting her er kontrollert/)).toBeInTheDocument();
  });

  it('lets the user report an error, stored locally', () => {
    renderAt('/utforsk/real-bystranda');
    fireEvent.click(screen.getByRole('button', { name: 'Meld fra om feil' }));
    fireEvent.change(screen.getByRole('textbox', { name: /Hva er feil/ }), { target: { value: 'Stellerommet er stengt' } });
    fireEvent.click(screen.getByRole('button', { name: 'Send' }));
    expect(screen.getByText(/lagres meldingen bare i denne nettleseren/)).toBeInTheDocument();
    expect(localStorage.getItem('little-babylove:place-reports:v1')).toContain('Stellerommet er stengt');
  });
});
