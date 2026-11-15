import { describe, expect, it } from 'vitest';
import { activitiesForAge } from './activities';

describe('age-adapted activities', () => {
  it('returns different suggestions for a newborn and an older baby', () => {
    const newbornIds = activitiesForAge(0).map((activity) => activity.id);
    const olderBabyIds = activitiesForAge(9).map((activity) => activity.id);
    expect(newbornIds).toContain('activity-baby-sensory');
    expect(newbornIds).not.toContain('activity-baby-stroll');
    expect(olderBabyIds).toContain('activity-baby-stroll');
    expect(olderBabyIds).not.toContain('activity-baby-sensory');
  });

  it('does not show activities outside the first year', () => {
    expect(activitiesForAge(13)).toEqual([]);
  });
});
