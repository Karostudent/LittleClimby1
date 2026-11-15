import { beforeEach, describe, expect, it } from 'vitest';
import { initialDemoState } from '../domain/journey';
import { addPlaceReport, clearDemoState, readDemoState, readPlaceReports, readTripPlan, readTripSelection, writeDemoState, writeTripPlan, writeTripSelection } from './storage';

describe('demo storage', () => {
  beforeEach(() => localStorage.clear());

  it('round-trips the profile and checklist state', () => {
    const state = { ...initialDemoState, checkedItemIds: ['practical-food'] };
    writeDemoState(state);
    expect(readDemoState()).toEqual(state);
  });

  it('falls back to a safe state for invalid saved data and clears all demo data', () => {
    localStorage.setItem('little-babylove:journey:v1', '{"schemaVersion":99}');
    localStorage.setItem('little-babylove:favorites:v1', '["demo-solglott"]');
    expect(readDemoState()).toEqual(initialDemoState);
    clearDemoState();
    expect(localStorage.length).toBe(0);
  });

  it('stores up to three selected trip stops and supports multi-stop plans', () => {
    writeTripSelection(['one', 'two', 'three', 'four']);
    expect(readTripSelection()).toEqual(['one', 'two', 'three']);
    writeTripPlan({ placeIds: ['one', 'two'], date: '', note: '' });
    expect(readTripPlan()?.placeIds).toEqual(['one', 'two']);
  });

  it('reads legacy single-stop plans', () => {
    localStorage.setItem('little-babylove:trip-plan:v1', JSON.stringify({ placeId: 'legacy', date: '', note: '' }));
    expect(readTripPlan()?.placeIds).toEqual(['legacy']);
  });

  it('stores place reports locally and clears them with the rest of the demo data', () => {
    addPlaceReport({ placeId: 'real-bystranda', kind: 'error', message: 'Stellerommet er stengt', createdAt: '2026-11-15' });
    expect(readPlaceReports()).toHaveLength(1);
    localStorage.setItem('little-babylove:place-reports:v1', '{"broken":true}');
    expect(readPlaceReports()).toEqual([]);
    addPlaceReport({ placeId: 'real-bystranda', kind: 'confirm', message: '', createdAt: '2026-11-15' });
    clearDemoState();
    expect(readPlaceReports()).toEqual([]);
  });
});
