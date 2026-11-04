import { initialDemoState, isValidDemoState, type DemoState } from '../domain/journey';

const FAVORITES_KEY = 'little-babylove:favorites:v1';
const JOURNEY_KEY = 'little-babylove:journey:v1';

export const readFavoriteIds = (): string[] => {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) && parsed.every((id) => typeof id === 'string') ? parsed : [];
  } catch {
    return [];
  }
};

export const writeFavoriteIds = (ids: string[]) => {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids));
};

export const readDemoState = (): DemoState => {
  try {
    const raw = localStorage.getItem(JOURNEY_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : null;
    return isValidDemoState(parsed) ? parsed : initialDemoState;
  } catch {
    return initialDemoState;
  }
};

export const writeDemoState = (state: DemoState) => {
  localStorage.setItem(JOURNEY_KEY, JSON.stringify(state));
};

export const clearDemoState = () => {
  localStorage.removeItem(JOURNEY_KEY);
  localStorage.removeItem(FAVORITES_KEY);
};
