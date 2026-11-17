import { describe, expect, it } from 'vitest';
import { buildExternalDirectionsUrl, matchesPlace } from './places';
import { places } from '../data/places';

describe('place filtering', () => {
  it('requires explicit yes and excludes unknown values', () => {
    const result = places.filter((place) => matchesPlace(place, '', 'all', ['changing_table', 'stroller_space', 'changing_access_all_caregivers']));
    expect(result.map((place) => place.id)).toEqual(['demo-solglott']);
  });

  it('matches text and category', () => {
    expect(places.filter((place) => matchesPlace(place, 'barseltreff', 'activity', [])).map((place) => place.id)).toEqual(['demo-barseltreff']);
  });

  it('keeps reference coordinates and sources for real places', () => {
    const bystranda = places.find((place) => place.id === 'real-bystranda');
    const fiskebrygga = places.find((place) => place.id === 'real-fiskebrygga');
    expect(bystranda?.coordinates).toEqual({ lat: 58.14639, lng: 8.007667 });
    expect(bystranda?.coordinatesSourceUrl).toContain('wikipedia.org');
    expect(fiskebrygga?.coordinates).toEqual({ lat: 58.14083, lng: 7.99583 });
    expect(fiskebrygga?.coordinatesSourceUrl).toContain('wikipedia.org');
  });

  it('includes the documented real place expansion', () => {
    const realIds = [
      'real-ravnedalen',
      'real-baneheia',
      'real-otterdalsparken',
      'real-peisestuen-park',
      'real-aquarama',
      'real-leos-lekeland',
      'real-hamresanden',
      'real-dyreparken',
    ];
    realIds.forEach((id) => {
      const place = places.find((item) => item.id === id);
      expect(place?.dataKind).toBe('real_place_identity');
      expect(place?.coordinates).not.toBeNull();
      expect(place?.coordinatesSourceUrl).toBeTruthy();
    });
  });

  it('keeps all unverified new-place facilities unknown', () => {
    const newPlaceIds = [
      'real-ravnedalen',
      'real-baneheia',
      'real-otterdalsparken',
      'real-peisestuen-park',
      'real-aquarama',
      'real-leos-lekeland',
      'real-hamresanden',
      'real-dyreparken',
    ];
    newPlaceIds.forEach((id) => {
      const place = places.find((item) => item.id === id);
      expect(place).toBeDefined();
      Object.values(place?.facilities ?? {}).forEach((claim) => {
        expect(claim?.value).toBe('unknown');
      });
    });
  });

  it('builds external directions in selected stop order for real places only', () => {
    const realPlaces = places.filter((place) => place.id === 'real-bystranda' || place.id === 'real-fiskebrygga');
    const url = buildExternalDirectionsUrl(realPlaces);
    expect(url).toContain('origin=58.14639%2C8.007667');
    expect(url).toContain('destination=58.14083%2C7.99583');
    expect(buildExternalDirectionsUrl([places[0]])).toBeNull();
  });

  it('builds a Google Maps search URL for one real place', () => {
    const bystranda = places.find((place) => place.id === 'real-bystranda');
    expect(bystranda).toBeDefined();
    const url = buildExternalDirectionsUrl([bystranda!]);
    expect(url).toBe('https://www.google.com/maps/search/?api=1&query=58.14639%2C8.007667');
  });

  it('preserves stop order when both real places are reversed', () => {
    const bystranda = places.find((place) => place.id === 'real-bystranda')!;
    const fiskebrygga = places.find((place) => place.id === 'real-fiskebrygga')!;
    const url = buildExternalDirectionsUrl([fiskebrygga, bystranda]);
    expect(url).toContain('origin=58.14083%2C7.99583');
    expect(url).toContain('destination=58.14639%2C8.007667');
    expect(url).not.toContain('waypoints=');
  });

  it('includes the middle stop in a three-place Google Maps route', () => {
    const bystranda = places.find((place) => place.id === 'real-bystranda')!;
    const otterdalsparken = places.find((place) => place.id === 'real-otterdalsparken')!;
    const fiskebrygga = places.find((place) => place.id === 'real-fiskebrygga')!;
    const url = buildExternalDirectionsUrl([bystranda, otterdalsparken, fiskebrygga]);
    expect(url).toContain('origin=58.14639%2C8.007667');
    expect(url).toContain('waypoints=58.1430441%2C7.9997846');
    expect(url).toContain('destination=58.14083%2C7.99583');
  });

  it('does not create a Google Maps URL containing fictional places', () => {
    const bystranda = places.find((place) => place.id === 'real-bystranda')!;
    expect(buildExternalDirectionsUrl([bystranda, places[0]])).toBeNull();
  });
});
