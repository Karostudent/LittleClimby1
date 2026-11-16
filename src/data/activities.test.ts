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

  it('shows activities declared for the school-start age', () => {
    const schoolStartIds = activitiesForAge(6).map((activity) => activity.id);
    expect(schoolStartIds).toContain('activity-family-meetup');
    expect(schoolStartIds).toContain('activity-kindergarten-play');
    expect(schoolStartIds).not.toContain('activity-toddler-outdoor');
  });
});
