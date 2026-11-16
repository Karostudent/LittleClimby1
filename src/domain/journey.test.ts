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
  kindergartenChecklistForAge,
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

  it('switches postpartum advice to toddler-focused guidance after one year', () => {
    const toddler: DemoProfile = {
      ...expectingProfile,
      stage: 'baby_born',
      dueDate: undefined,
      childBirthDate: undefined,
      childAgeYears: 2,
    };
    const milestone = getCurrentMilestone(toddler, '2026-11-04');
    expect(milestone?.id).toBe('postpartum-toddler');
    expect(milestone?.body).toContain('lek');
    expect(milestone?.dadTip).toContain('oppgaver');
  });

  it('keeps both checklist tracks and at least three practical dad tips available', () => {
    expect(new Set(checklistItems.map((item) => item.listId))).toEqual(new Set(['equipment', 'practical']));
    expect(milestones.filter((milestone) => milestone.dadTip).length).toBeGreaterThanOrEqual(3);
    expect(milestones.every((milestone) => milestone.medicalClaim === false)).toBe(true);
  });

  it('returns age-appropriate checklist suggestions', () => {
    const infantIds = checklistItemsForAge(0).map((item) => item.id);
    const toddlerIds = checklistItemsForAge(2).map((item) => item.id);
    expect(infantIds).toContain('practical-route');
    expect(toddlerIds).toContain('practical-play');
    expect(toddlerIds).not.toContain('practical-route');
  });

  it('returns kindergarten preparation tips only for preschool ages', () => {
    expect(kindergartenChecklistForAge(2)).toHaveLength(0);
    expect(kindergartenChecklistForAge(3).map((item) => item.id)).toContain('kindergarten-label-everything');
    expect(kindergartenChecklistForAge(5).every((item) => item.ageMinYears <= 5 && item.ageMaxYears >= 5)).toBe(true);
    expect(kindergartenChecklistForAge(6).map((item) => item.id)).toContain('school-start-routines');
  });

  it('uses the school-start milestone from age five', () => {
    const child: DemoProfile = {
      ...expectingProfile,
      stage: 'baby_born',
      dueDate: undefined,
      childBirthDate: undefined,
      childAgeYears: 6,
    };
    expect(getCurrentMilestone(child, '2026-11-04')?.id).toBe('postpartum-school-start');
  });

  it('provides a short, non-clinical description for the selected age', () => {
    expect(getAgeDescription(2)).toContain('tempo');
    expect(getAgeDescription(9)).toContain('utvikler seg ulikt');
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
