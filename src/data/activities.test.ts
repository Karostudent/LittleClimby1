import { describe, expect, it } from 'vitest';
import { activitiesForAge } from './activities';

describe('age-adapted activities', () => {
  it('returns different suggestions for infant and toddler ages', () => {
    const infantIds = activitiesForAge(0).map((activity) => activity.id);
    const toddlerIds = activitiesForAge(2).map((activity) => activity.id);
    expect(infantIds).toContain('activity-baby-sensory');
    expect(toddlerIds).toContain('activity-toddler-outdoor');
    expect(toddlerIds).not.toContain('activity-baby-sensory');
  });

  it('does not show activities outside their declared age range', () => {
    expect(activitiesForAge(6)).toEqual([]);
  });
});
