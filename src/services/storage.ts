import { initialDemoState, isValidDemoState, type DemoState } from '../domain/journey';

const FAVORITES_KEY = 'little-babylove:favorites:v1';
const JOURNEY_KEY = 'little-babylove:journey:v1';
const TRIP_PLAN_KEY = 'little-babylove:trip-plan:v1';
const TRIP_SELECTION_KEY = 'little-babylove:trip-selection:v1';
const FEEDBACK_KEY = 'little-babylove:feedback:v1';
const REPORTS_KEY = 'little-babylove:place-reports:v1';

export interface TripPlan {
  placeIds: string[];
  date: string;
  note: string;
}

export interface DemoFeedback {
  rating: 'useful' | 'unclear' | 'missing';
  comment: string;
}

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
  localStorage.removeItem(TRIP_PLAN_KEY);
  localStorage.removeItem(TRIP_SELECTION_KEY);
  localStorage.removeItem(FEEDBACK_KEY);
  localStorage.removeItem(REPORTS_KEY);
};

export const readTripPlan = (): TripPlan | null => {
  try {
    const raw = localStorage.getItem(TRIP_PLAN_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : null;
    if (!parsed || typeof parsed !== 'object') return null;
    const plan = parsed as Partial<TripPlan> & { placeId?: string };
    const placeIds = Array.isArray(plan.placeIds)
      ? plan.placeIds.filter((id): id is string => typeof id === 'string')
      : typeof plan.placeId === 'string' ? [plan.placeId] : [];
    return placeIds.length > 0 && typeof plan.date === 'string' && typeof plan.note === 'string'
      ? { placeIds, date: plan.date, note: plan.note }
      : null;
  } catch {
    return null;
  }
};

export const writeTripPlan = (plan: TripPlan) => {
  localStorage.setItem(TRIP_PLAN_KEY, JSON.stringify(plan));
};

export const readTripSelection = (): string[] => {
  try {
    const raw = localStorage.getItem(TRIP_SELECTION_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) && parsed.every((id) => typeof id === 'string') ? parsed.slice(0, 3) : [];
  } catch {
    return [];
  }
};

export const writeTripSelection = (placeIds: string[]) => {
  localStorage.setItem(TRIP_SELECTION_KEY, JSON.stringify(placeIds.slice(0, 3)));
};

export const readFeedback = (): DemoFeedback | null => {
  try {
    const raw = localStorage.getItem(FEEDBACK_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : null;
    if (!parsed || typeof parsed !== 'object') return null;
    const feedback = parsed as Partial<DemoFeedback>;
    return (feedback.rating === 'useful' || feedback.rating === 'unclear' || feedback.rating === 'missing')
      && typeof feedback.comment === 'string'
      ? feedback as DemoFeedback
      : null;
  } catch {
    return null;
  }
};

export const writeFeedback = (feedback: DemoFeedback) => {
  localStorage.setItem(FEEDBACK_KEY, JSON.stringify(feedback));
};

/** En melding fra en bruker om et sted. I demoen lagres den bare lokalt. */
export interface PlaceReport {
  placeId: string;
  kind: 'confirm' | 'error';
  message: string;
  createdAt: string;
}

export const readPlaceReports = (): PlaceReport[] => {
  try {
    const raw = localStorage.getItem(REPORTS_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is PlaceReport => Boolean(item)
      && typeof item.placeId === 'string'
      && (item.kind === 'confirm' || item.kind === 'error')
      && typeof item.message === 'string'
      && typeof item.createdAt === 'string');
  } catch {
    return [];
  }
};

export const addPlaceReport = (report: PlaceReport) => {
  localStorage.setItem(REPORTS_KEY, JSON.stringify([...readPlaceReports(), report]));
};
