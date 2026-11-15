import { describe, expect, it } from 'vitest';
import { directionsUrl, isFictional, matchesPlace, verificationSummary } from './places';
import { places } from '../data/places';

describe('place filtering', () => {
  it('requires explicit yes and excludes unknown values', () => {
    const result = places.filter((place) => matchesPlace(place, '', 'all', ['changing_table', 'stroller_space', 'changing_access_all_caregivers']));
    expect(result.map((place) => place.id)).toEqual(['demo-solglott']);
  });

  it('matches text and category', () => {
    expect(places.filter((place) => matchesPlace(place, 'barseltreff', 'activity', [])).map((place) => place.id)).toEqual(['demo-barseltreff']);
  });

  it('never marks fictional places as confirmed or dated', () => {
    const fictional = places.filter(isFictional);
    expect(fictional.length).toBeGreaterThan(0);
    for (const place of fictional) {
      for (const claim of Object.values(place.facilities)) {
        expect(claim?.evidenceStatus).not.toBe('venue_confirmed');
        expect(claim?.checkedAt).toBeUndefined();
      }
      expect(verificationSummary(place)).toBe('Eksempeldata · ikke kontrollert');
    }
  });

  it('shows real places on the map with a source for position and a check date', () => {
    const real = places.filter((place) => !isFictional(place));
    expect(real).toHaveLength(2);
    for (const place of real) {
      expect(place.coordinates).not.toBeNull();
      expect(place.coordinatesSourceUrl).toMatch(/^https:\/\//);
      expect(verificationSummary(place)).toContain('Sted kontrollert');
      expect(verificationSummary(place)).toContain('fasiliteter ikke kontrollert');
    }
  });
});

describe('directions link', () => {
  it('opens Google Maps with destination and optional waypoints', () => {
    const single = new URL(directionsUrl([{ lat: 58.1, lng: 8.0 }]));
    expect(single.hostname).toBe('www.google.com');
    expect(single.searchParams.get('destination')).toBe('58.1,8');
    expect(single.searchParams.get('waypoints')).toBeNull();
    const multi = new URL(directionsUrl([{ lat: 1, lng: 2 }, { lat: 3, lng: 4 }, { lat: 5, lng: 6 }]));
    expect(multi.searchParams.get('destination')).toBe('5,6');
    expect(multi.searchParams.get('waypoints')).toBe('1,2|3,4');
  });

  it('refuses an empty route', () => {
    expect(() => directionsUrl([])).toThrow();
  });
});
