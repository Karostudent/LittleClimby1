import { describe, expect, it } from 'vitest';
import { matchesPlace } from './places';
import { places } from '../data/places';

describe('place filtering', () => {
  it('requires explicit yes and excludes unknown values', () => {
    const result = places.filter((place) => matchesPlace(place, '', 'all', ['changing_table', 'stroller_space', 'changing_access_all_caregivers']));
    expect(result.map((place) => place.id)).toEqual(['demo-solglott']);
  });

  it('matches text and category', () => {
    expect(places.filter((place) => matchesPlace(place, 'barseltreff', 'activity', [])).map((place) => place.id)).toEqual(['demo-barseltreff']);
  });
});
