export type TriState = 'yes' | 'no' | 'unknown';
export type PlaceCategory = 'cafe' | 'walking_route' | 'outdoor_area' | 'activity';
export type DataKind = 'real_place_identity' | 'fictional_demo';
export type FacilityName =
  | 'stroller_space'
  | 'changing_table'
  | 'changing_access_all_caregivers'
  | 'step_free_access'
  | 'stroller_suitable_route'
  | 'free_activity'
  | 'benches';

export interface FacilityClaim {
  value: TriState;
  evidenceStatus: 'venue_confirmed' | 'public_source' | 'unverified' | 'not_applicable' | 'demo_example';
  evidenceUrl?: string;
  checkedAt?: string;
  note?: string;
}

export interface Place {
  id: string;
  name: string;
  category: PlaceCategory;
  dataKind: DataKind;
  coordinates: { lat: number; lng: number } | null;
  addressOrArea: string;
  shortDescription: string;
  identitySourceUrl?: string;
  identityCheckedAt?: string;
  coordinatesSourceUrl?: string;
  coordinatesCheckedAt?: string;
  facilities: Partial<Record<FacilityName, FacilityClaim>>;
  tags: string[];
  routeInfo?: { lengthKm?: number; surfaceText?: string; routeVerified: boolean };
}

export const categoryLabels: Record<PlaceCategory, string> = {
  cafe: 'Kafé og møteplass',
  walking_route: 'Trilletur',
  outdoor_area: 'Uteområde',
  activity: 'Aktivitet',
};

export const facilityLabels: Record<FacilityName, string> = {
  stroller_space: 'Plass til barnevogn',
  changing_table: 'Stellerom',
  changing_access_all_caregivers: 'Stelleplass for alle omsorgspersoner',
  step_free_access: 'Trappefri adkomst',
  stroller_suitable_route: 'Egnet for barnevogn',
  free_activity: 'Gratis aktivitet',
  benches: 'Sittebenker',
};

export const isFictional = (place: Place) => place.dataKind === 'fictional_demo';

export const matchesPlace = (
  place: Place,
  search: string,
  category: PlaceCategory | 'all',
  filters: FacilityName[],
) => {
  const haystack = `${place.name} ${place.addressOrArea} ${categoryLabels[place.category]} ${place.tags.join(' ')}`.toLocaleLowerCase('nb-NO');
  const searchMatches = !search.trim() || haystack.includes(search.trim().toLocaleLowerCase('nb-NO'));
  const categoryMatches = category === 'all' || place.category === category;
  const filterMatches = filters.every((filter) => place.facilities[filter]?.value === 'yes');
  return searchMatches && categoryMatches && filterMatches;
};

export const formatCheckedDate = (value: string) =>
  new Date(`${value}T12:00:00`).toLocaleDateString('nb-NO', { day: 'numeric', month: 'long', year: 'numeric' });

/** Kort tekst om hva som er kontrollert, og når. Fiktive steder får aldri «bekreftet». */
export const verificationSummary = (place: Place): string => {
  if (isFictional(place)) return 'Eksempeldata · ikke kontrollert';
  const confirmed = Object.values(place.facilities)
    .filter((claim): claim is FacilityClaim => Boolean(claim && claim.checkedAt && (claim.evidenceStatus === 'venue_confirmed' || claim.evidenceStatus === 'public_source')))
    .map((claim) => claim.checkedAt as string)
    .sort();
  const identity = place.identityCheckedAt ? `Sted kontrollert ${formatCheckedDate(place.identityCheckedAt)}` : 'Sted ikke kontrollert';
  const facilities = confirmed.length ? `fasiliteter sist kontrollert ${formatCheckedDate(confirmed[confirmed.length - 1])}` : 'fasiliteter ikke kontrollert';
  return `${identity} · ${facilities}`;
};

/** Lenke som åpner veibeskrivelse i Google Maps fra brukerens posisjon. Brukeren velger selv gange, kollektiv eller bil der. */
export const directionsUrl = (stops: { lat: number; lng: number }[]): string => {
  if (!stops.length) throw new Error('Minst ett stopp trengs for veibeskrivelse');
  const destination = stops[stops.length - 1];
  const params = new URLSearchParams({ api: '1', destination: `${destination.lat},${destination.lng}`, travelmode: 'walking' });
  const waypoints = stops.slice(0, -1).map((stop) => `${stop.lat},${stop.lng}`).join('|');
  if (waypoints) params.set('waypoints', waypoints);
  return `https://www.google.com/maps/dir/?${params.toString()}`;
};
