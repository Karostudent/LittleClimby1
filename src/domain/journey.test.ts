import { describe, expect, it } from 'vitest';
import {
  getCurrentMilestone,
  getJourneyWeek,
  checklistItems,
  checklistItemsForAge,
  pregnancyChecklistForWeek,
  getAgeDescription,
  milestones,
  getParentAdvice,
  getChildAgeMonths,
  formatAgeMonths,
  pregnancyWeekFromDueDate,
  pregnancyWeekFromEntry,
  type DemoProfile,
} from './journey';

const expectingProfile: DemoProfile = {
  stage: 'expecting',
  dueDate: '2027-01-01',
  contentPreference: 'dad',
  notificationPreference: 'preview_only',
};

describe('journey calculations', () => {
  it('calculates the same week from local calendar dates across a date boundary', () => {
    expect(pregnancyWeekFromDueDate('2027-01-01', '2026-11-04')).toBe(32);
    expect(getJourneyWeek(expectingProfile, '2026-11-04')).toBe(32);
  });

  it('supports an entered week as an alternative to a due date', () => {
    expect(pregnancyWeekFromEntry(20, '2026-11-04', '2026-11-18')).toBe(22);
  });

  it('updates the milestone and dad tip when the phase changes', () => {
    expect(getCurrentMilestone(expectingProfile, '2026-11-04')?.dadTip).toBeTruthy();
    expect(getCurrentMilestone(expectingProfile, '2026-09-01')?.id).not.toBe(getCurrentMilestone(expectingProfile, '2026-11-04')?.id);
    const born: DemoProfile = { ...expectingProfile, stage: 'baby_born', dueDate: undefined, childBirthDate: '2026-10-01' };
    expect(getCurrentMilestone(born, '2026-11-04')?.id).toBe('postpartum-first');
  });

  it('uses the entered age in months to pick the postpartum milestone', () => {
    const base: DemoProfile = { ...expectingProfile, stage: 'baby_born', dueDate: undefined, childBirthDate: undefined };
    expect(getCurrentMilestone({ ...base, childAgeMonths: 0 }, '2026-11-04')?.id).toBe('postpartum-first');
    expect(getCurrentMilestone({ ...base, childAgeMonths: 3 }, '2026-11-04')?.id).toBe('postpartum-out');
    expect(getCurrentMilestone({ ...base, childAgeMonths: 9 }, '2026-11-04')?.id).toBe('postpartum-explore');
  });

  it('calculates age in months from birth date, capped to the first year', () => {
    const born: DemoProfile = { ...expectingProfile, stage: 'baby_born', dueDate: undefined, childBirthDate: '2026-08-01' };
    expect(getChildAgeMonths(born, '2026-11-15')).toBe(3);
    expect(getChildAgeMonths({ ...born, childBirthDate: '2024-01-01' }, '2026-11-15')).toBe(12);
    expect(getChildAgeMonths({ ...born, childAgeMonths: 5 }, '2026-11-15')).toBe(5);
    expect(getChildAgeMonths(expectingProfile, '2026-11-15')).toBeUndefined();
    expect(formatAgeMonths(0)).toBe('under én måned');
    expect(formatAgeMonths(1)).toBe('1 måned');
    expect(formatAgeMonths(7)).toBe('7 måneder');
  });

  it('keeps both checklist tracks and at least three practical dad tips available', () => {
    expect(new Set(checklistItems.map((item) => item.listId))).toEqual(new Set(['equipment', 'practical']));
    expect(milestones.filter((milestone) => milestone.dadTip).length).toBeGreaterThanOrEqual(3);
    expect(milestones.every((milestone) => milestone.medicalClaim === false)).toBe(true);
  });

  it('returns age-appropriate checklist suggestions', () => {
    const newbornIds = checklistItemsForAge(1).map((item) => item.id);
    const olderBabyIds = checklistItemsForAge(8).map((item) => item.id);
    expect(newbornIds).toContain('practical-route');
    expect(newbornIds).not.toContain('practical-play');
    expect(olderBabyIds).toContain('practical-play');
    expect(checklistItemsForAge(13)).toHaveLength(0);
  });

  it('provides a short, non-clinical description for the selected age', () => {
    expect(getAgeDescription(1)).toContain('nærhet');
    expect(getAgeDescription(10)).toContain('utforske');
    expect(getAgeDescription(18)).toContain('utvikler seg ulikt');
  });

  it('returns only practical pregnancy preparation tips from the current week', () => {
    expect(pregnancyChecklistForWeek(27)).toHaveLength(0);
    expect(pregnancyChecklistForWeek(35).map((item) => item.id)).toContain('pregnancy-hospital-bag');
    expect(pregnancyChecklistForWeek(35).every((item) => item.fromWeek <= 35)).toBe(true);
  });

  it('provides separate practical advice for pregnant parent and dad/co-parent', () => {
    const advice = getParentAdvice(expectingProfile, '2026-11-04');
    expect(advice.pregnantParent).toBeTruthy();
    expect(advice.dadOrCoParent).toBeTruthy();
    expect(advice.pregnantParent).not.toBe(advice.dadOrCoParent);
  });
});
