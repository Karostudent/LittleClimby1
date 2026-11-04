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
  evidenceStatus: 'venue_confirmed' | 'public_source' | 'unverified' | 'not_applicable';
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
  const haystack = `${place.name} ${place.addressOrArea} ${place.tags.join(' ')}`.toLocaleLowerCase('nb-NO');
  const searchMatches = !search.trim() || haystack.includes(search.trim().toLocaleLowerCase('nb-NO'));
  const categoryMatches = category === 'all' || place.category === category;
  const filterMatches = filters.every((filter) => place.facilities[filter]?.value === 'yes');
  return searchMatches && categoryMatches && filterMatches;
};
