export interface Activity {
  id: string;
  title: string;
  description: string;
  ageMinYears: number;
  ageMaxYears: number;
  locationLabel: string;
  demoOnly: true;
}

export const activities: Activity[] = [
  {
    id: 'activity-baby-sensory',
    title: 'Sansestund for de minste',
    description: 'En rolig, fiktiv aktivitet med sang, nærhet og enkle sanseinntrykk.',
    ageMinYears: 0,
    ageMaxYears: 1,
    locationLabel: 'Demo Møteplass Havbris',
    demoOnly: true,
  },
  {
    id: 'activity-toddler-outdoor',
    title: 'Liten oppdagertur ute',
    description: 'Et kort, fiktivt turforslag med god tid til pauser og utforsking.',
    ageMinYears: 1,
    ageMaxYears: 3,
    locationLabel: 'Demo Lilleparken',
    demoOnly: true,
  },
  {
    id: 'activity-family-meetup',
    title: 'Familietreff i nærmiljøet',
    description: 'En fiktiv møteplass for familier med barn i flere aldre.',
    ageMinYears: 0,
    ageMaxYears: 6,
    locationLabel: 'Demo Barseltreff ved sjøen',
    demoOnly: true,
  },
  {
    id: 'activity-kindergarten-play',
    title: 'Åpen lekestund for større barn',
    description: 'En fiktiv aktivitet med enkel lek, fantasi og tid til å bli kjent med andre.',
    ageMinYears: 3,
    ageMaxYears: 6,
    locationLabel: 'Demo Åpen lekestund',
    demoOnly: true,
  },
];

export const activitiesForAge = (ageYears: number): Activity[] =>
  activities.filter((activity) => ageYears >= activity.ageMinYears && ageYears <= activity.ageMaxYears);
