export interface Activity {
  id: string;
  title: string;
  description: string;
  ageMinMonths: number;
  ageMaxMonths: number;
  locationLabel: string;
  demoOnly: true;
}

export const activities: Activity[] = [
  {
    id: 'activity-baby-sensory',
    title: 'Sansestund for de minste',
    description: 'En rolig, fiktiv aktivitet med sang, nærhet og enkle sanseinntrykk.',
    ageMinMonths: 0,
    ageMaxMonths: 6,
    locationLabel: 'Demo Møteplass Havbris',
    demoOnly: true,
  },
  {
    id: 'activity-baby-stroll',
    title: 'Trilletur med kaffestopp',
    description: 'Et kort, fiktivt turforslag med fast dekke, benker og et rolig sted å ta pause.',
    ageMinMonths: 1,
    ageMaxMonths: 12,
    locationLabel: 'Demotur Ved Elva',
    demoOnly: true,
  },
  {
    id: 'activity-family-meetup',
    title: 'Barseltreff i nærmiljøet',
    description: 'En fiktiv møteplass for foreldre i permisjon og babyer under ett år.',
    ageMinMonths: 0,
    ageMaxMonths: 12,
    locationLabel: 'Demo Barseltreff ved sjøen',
    demoOnly: true,
  },
];

export const activitiesForAge = (ageMonths: number): Activity[] =>
  activities.filter((activity) => ageMonths >= activity.ageMinMonths && ageMonths <= activity.ageMaxMonths);
