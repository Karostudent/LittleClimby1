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

  it('builds external directions in selected stop order for real places only', () => {
    const realPlaces = places.filter((place) => place.id === 'real-bystranda' || place.id === 'real-fiskebrygga');
    const url = buildExternalDirectionsUrl(realPlaces);
    expect(url).toContain('origin=58.14639%2C8.007667');
    expect(url).toContain('destination=58.14083%2C7.99583');
    expect(buildExternalDirectionsUrl([places[0]])).toBeNull();
  });
});
