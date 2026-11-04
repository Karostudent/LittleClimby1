import { beforeEach, describe, expect, it } from 'vitest';
import { initialDemoState } from '../domain/journey';
import { clearDemoState, readDemoState, writeDemoState } from './storage';

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
});
