export type JourneyStage = 'expecting' | 'baby_born' | 'prefer_not_to_say';
export type ContentPreference = 'dad' | 'pregnant_parent' | 'both' | 'general';

export interface DemoProfile {
  stage: JourneyStage;
  dueDate?: string;
  enteredPregnancyWeek?: number;
  enteredWeekAnchorDate?: string;
  childBirthDate?: string;
  childAgeYears?: number;
  contentPreference: ContentPreference;
  notificationPreference: 'off' | 'preview_only';
}

export interface Milestone {
  id: string;
  stage: 'pregnancy' | 'postpartum';
  minWeekOrMonth: number;
  title: string;
  body: string;
  dadTip?: string;
  pregnantParentTip?: string;
  checklistIds: string[];
  medicalClaim: false;
}

export interface ChecklistItem {
  id: string;
  listId: string;
  label: string;
  category: 'must_have' | 'nice_to_have' | 'can_wait' | 'practical';
  ageMinYears: number;
  ageMaxYears: number;
}

export interface PregnancyChecklistItem {
  id: string;
  fromWeek: number;
  label: string;
  category: 'practical' | 'preparation' | 'economy' | 'work';
  sourceUrl: string;
}

export interface KindergartenChecklistItem {
  id: string;
  ageMinYears: number;
  ageMaxYears: number;
  label: string;
  category: 'clothing' | 'comfort' | 'routine';
  sourceUrl: string;
}

export interface DemoState {
  schemaVersion: 1;
  profile: DemoProfile | null;
  checkedItemIds: string[];
  notificationPreviewSeenIds: string[];
}

export const initialDemoState: DemoState = {
  schemaVersion: 1,
  profile: null,
  checkedItemIds: [],
  notificationPreviewSeenIds: [],
};

const dateOnly = (value: string): Date => {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
};

const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const daysBetween = (from: Date, to: Date) => Math.round((to.getTime() - from.getTime()) / 86_400_000);

export const pregnancyWeekFromDueDate = (dueDate: string, today: string): number => {
  const daysUntilDue = daysBetween(dateOnly(today), dateOnly(dueDate));
  return Math.max(1, Math.min(42, Math.floor((280 - daysUntilDue) / 7) + 1));
};

export const pregnancyWeekFromEntry = (
  enteredWeek: number,
  anchorDate: string,
  today: string,
): number => {
  const elapsedWeeks = Math.floor(daysBetween(dateOnly(anchorDate), dateOnly(today)) / 7);
  return Math.max(1, Math.min(42, enteredWeek + elapsedWeeks));
};

export const dueDateFromWeek = (week: number, anchorDate: string): string => {
  const date = dateOnly(anchorDate);
  date.setDate(date.getDate() + (40 - week) * 7);
  return formatDate(date);
};

export const getJourneyWeek = (profile: DemoProfile, today: string): number | null => {
  if (profile.stage !== 'expecting') return null;
  if (profile.dueDate) return pregnancyWeekFromDueDate(profile.dueDate, today);
  if (profile.enteredPregnancyWeek && profile.enteredWeekAnchorDate) {
    return pregnancyWeekFromEntry(profile.enteredPregnancyWeek, profile.enteredWeekAnchorDate, today);
  }
  return null;
};

export const milestones: Milestone[] = [
  { id: 'pregnancy-start', stage: 'pregnancy', minWeekOrMonth: 1, title: 'Start rolig og finn oversikten', body: 'Velg én liten praktisk ting å gjøre sammen, og finn informasjon fra kilder dere stoler på.', dadTip: 'Avtal hvordan du kan være til stede på en måte som passer dere begge.', pregnantParentTip: 'Velg hva slags støtte som faktisk vil gjøre dagen lettere.', checklistIds: ['practical'], medicalClaim: false },
  { id: 'pregnancy-middle', stage: 'pregnancy', minWeekOrMonth: 13, title: 'Planlegg hverdagen sammen', body: 'Se på transport, hvile og hvem dere kan spørre om praktisk hjelp.', dadTip: 'Ta ansvar for én konkret oppgave, uten å vente på en detaljert bestilling.', pregnantParentTip: 'Del hva du ønsker hjelp til, og hva du helst vil gjøre selv.', checklistIds: ['practical'], medicalClaim: false },
  { id: 'pregnancy-prep', stage: 'pregnancy', minWeekOrMonth: 25, title: 'Gjør det viktigste klart', body: 'Gå gjennom det dere allerede har, og velg gjenbruk før nye kjøp.', dadTip: 'Pakk en enkel bag eller lag en plan for turen til fødestedet sammen.', pregnantParentTip: 'Velg bare det praktiske dere trenger nå; resten kan vente.', checklistIds: ['equipment'], medicalClaim: false },
  { id: 'pregnancy-near', stage: 'pregnancy', minWeekOrMonth: 35, title: 'Forbered den første tiden', body: 'Avtal besøk, mat og pauser slik at begge får støtte etter fødselen.', dadTip: 'Vær en rolig portvakt for besøk og hjelp til med det praktiske.', pregnantParentTip: 'Snakk sammen om pauser, besøk og hvordan dere ber om hjelp.', checklistIds: ['equipment', 'practical'], medicalClaim: false },
  { id: 'pregnancy-ready', stage: 'pregnancy', minWeekOrMonth: 39, title: 'Ta én dag av gangen', body: 'Hold planen enkel og sjekk inn med hverandre om hva som er nyttig akkurat nå.', dadTip: 'Spør hva som vil gjøre dagen litt lettere, og lytt til svaret.', pregnantParentTip: 'Ta én dag av gangen og velg bort det som ikke haster.', checklistIds: ['practical'], medicalClaim: false },
  { id: 'postpartum-first', stage: 'postpartum', minWeekOrMonth: 0, title: 'Den første tiden hjemme', body: 'Prioriter hvile, mat og støtte. Det finnes ingen fasit for hvordan de første dagene skal se ut.', dadTip: 'Ta initiativ til mat, rydding og kontakt med nettverket deres.', pregnantParentTip: 'Si tydelig fra når du trenger hvile, mat eller avlastning.', checklistIds: ['practical'], medicalClaim: false },
  { id: 'postpartum-out', stage: 'postpartum', minWeekOrMonth: 2, title: 'Finn en liten tur sammen', body: 'Når det passer for dere, kan en kort tur til et rolig sted være et lite avbrekk.', dadTip: 'Finn et sted med praktiske fasiliteter, og ha en plan B uten at det blir et nederlag.', pregnantParentTip: 'Velg et tempo og et sted som føles overkommelig for dere.', checklistIds: ['equipment'], medicalClaim: false },
  { id: 'postpartum-toddler', stage: 'postpartum', minWeekOrMonth: 12, title: 'Hverdagen med et større barn', body: 'Når barnet er over ett år, kan hverdagen romme mer lek, bevegelse og små valg. Lag enkle rutiner, gi tid til utforsking og velg aktiviteter som passer barnets dagsform.', dadTip: 'Inviter barnet med i små oppgaver og følg initiativet deres i lek og utforsking.', pregnantParentTip: 'Legg inn pauser for deg selv, og la barnet få prøve i sitt eget tempo.', checklistIds: ['practical', 'equipment'], medicalClaim: false },
];

export const checklistItems: ChecklistItem[] = [
  { id: 'equipment-bag', listId: 'equipment', label: 'Finn fram det dere allerede har til en enkel babytur', category: 'must_have', ageMinYears: 0, ageMaxYears: 1 },
  { id: 'equipment-change', listId: 'equipment', label: 'Legg en ekstra skift og bleier i turbagen', category: 'must_have', ageMinYears: 0, ageMaxYears: 2 },
  { id: 'equipment-reuse', listId: 'equipment', label: 'Vurder om noe kan lånes eller gjenbrukes', category: 'can_wait', ageMinYears: 0, ageMaxYears: 5 },
  { id: 'equipment-toddler-snack', listId: 'equipment', label: 'Planlegg en enkel matbit og drikke til turen', category: 'practical', ageMinYears: 1, ageMaxYears: 5 },
  { id: 'practical-food', listId: 'practical', label: 'Avtal hvem som ordner et måltid på en travel dag', category: 'practical', ageMinYears: 0, ageMaxYears: 5 },
  { id: 'practical-route', listId: 'practical', label: 'Finn et rolig sted dere kan besøke med baby', category: 'practical', ageMinYears: 0, ageMaxYears: 1 },
  { id: 'practical-play', listId: 'practical', label: 'Finn et trygt sted med plass til lek og utforsking', category: 'practical', ageMinYears: 1, ageMaxYears: 5 },
  { id: 'practical-support', listId: 'practical', label: 'Skriv ned én person dere kan spørre om hjelp', category: 'practical', ageMinYears: 0, ageMaxYears: 5 },
];

export const checklistItemsForAge = (ageYears: number): ChecklistItem[] =>
  checklistItems.filter((item) => ageYears >= item.ageMinYears && ageYears <= item.ageMaxYears);

export const kindergartenChecklistItems: KindergartenChecklistItem[] = [
  { id: 'kindergarten-change-of-clothes', ageMinYears: 3, ageMaxYears: 5, label: 'Legg klart et merket skift med klær som tåler aktiv lek og vær.', category: 'clothing', sourceUrl: 'https://laringsverkstedet.no/barnehagestart/kl%C3%A6r-og-utstyrsliste' },
  { id: 'kindergarten-weather-clothes', ageMinYears: 3, ageMaxYears: 5, label: 'Sjekk at yttertøy, sko og hodeplagg passer til sesongen.', category: 'clothing', sourceUrl: 'https://laringsverkstedet.no/barnehagestart/kl%C3%A6r-og-utstyrsliste' },
  { id: 'kindergarten-indoor-shoes', ageMinYears: 3, ageMaxYears: 5, label: 'Avklar om barnehagen trenger tøfler eller innesko.', category: 'routine', sourceUrl: 'https://laringsverkstedet.no/barnehagestart/kl%C3%A6r-og-utstyrsliste' },
  { id: 'kindergarten-water-bottle', ageMinYears: 3, ageMaxYears: 5, label: 'Merk drikkeflaske og annet som skal være med i hverdagen.', category: 'routine', sourceUrl: 'https://laringsverkstedet.no/barnehagestart/kl%C3%A6r-og-utstyrsliste' },
  { id: 'kindergarten-comfort-item', ageMinYears: 3, ageMaxYears: 5, label: 'Avtal om barnet kan ha med smokk, koseklut eller en annen trygg ting ved behov.', category: 'comfort', sourceUrl: 'https://laringsverkstedet.no/barnehagestart/kl%C3%A6r-og-utstyrsliste' },
  { id: 'kindergarten-label-everything', ageMinYears: 3, ageMaxYears: 5, label: 'Merk klær, sko og utstyr med barnets navn før oppstart.', category: 'routine', sourceUrl: 'https://laringsverkstedet.no/barnehagestart/kl%C3%A6r-og-utstyrsliste' },
  { id: 'kindergarten-reuse', ageMinYears: 3, ageMaxYears: 5, label: 'Vurder brukt eller arvet utstyr der det passer, siden barn vokser raskt.', category: 'clothing', sourceUrl: 'https://laringsverkstedet.no/barnehagestart/kl%C3%A6r-og-utstyrsliste' },
];

export const kindergartenChecklistForAge = (ageYears: number): KindergartenChecklistItem[] =>
  kindergartenChecklistItems.filter((item) => ageYears >= item.ageMinYears && ageYears <= item.ageMaxYears);

export const pregnancyChecklistItems: PregnancyChecklistItem[] = [
  { id: 'pregnancy-course', fromWeek: 28, label: 'Undersøk fødselsforberedende kurs som passer for dere.', category: 'preparation', sourceUrl: 'https://www.gravidhjelpen.no/sjekkliste' },
  { id: 'pregnancy-equipment-list', fromWeek: 30, label: 'Lag en rolig liste over nødvendig babyutstyr, og vurder hva som kan lånes eller vente.', category: 'practical', sourceUrl: 'https://www.gravidhjelpen.no/sjekkliste' },
  { id: 'pregnancy-leave-plan', fromWeek: 30, label: 'Snakk sammen om hvordan permisjonen kan fordeles, og sjekk informasjonen på nav.no.', category: 'economy', sourceUrl: 'https://www.gravidhjelpen.no/sjekkliste' },
  { id: 'pregnancy-birth-preferences', fromWeek: 31, label: 'Skriv ned spørsmål og ønsker dere vil ta opp med jordmor eller fødestedet.', category: 'preparation', sourceUrl: 'https://www.gravidhjelpen.no/sjekkliste' },
  { id: 'pregnancy-car-seat', fromWeek: 31, label: 'Finn en godkjent bilstol og planlegg hvordan den skal monteres før hjemreisen.', category: 'practical', sourceUrl: 'https://www.gravidhjelpen.no/sjekkliste' },
  { id: 'pregnancy-birth-network', fromWeek: 32, label: 'Undersøk barselgruppe eller annet lokalt nettverk via helsestasjonen.', category: 'practical', sourceUrl: 'https://www.gravidhjelpen.no/sjekkliste' },
  { id: 'pregnancy-work-study', fromWeek: 34, label: 'Avklar eventuell tilrettelegging av jobb eller studier i god tid.', category: 'work', sourceUrl: 'https://www.gravidhjelpen.no/sjekkliste' },
  { id: 'pregnancy-route', fromWeek: 34, label: 'Planlegg ruten til fødestedet og ha en enkel plan B.', category: 'practical', sourceUrl: 'https://www.gravidhjelpen.no/sjekkliste' },
  { id: 'pregnancy-hospital-bag', fromWeek: 35, label: 'Pakk en enkel bag med klær, toalettsaker, lader og det dere trenger.', category: 'preparation', sourceUrl: 'https://www.gravidhjelpen.no/sjekkliste' },
  { id: 'pregnancy-support', fromWeek: 36, label: 'Avtal hvem som kan hjelpe med mat, praktiske oppgaver og støtte den første tiden.', category: 'practical', sourceUrl: 'https://www.gravidhjelpen.no/sjekkliste' },
  { id: 'pregnancy-contact-list', fromWeek: 36, label: 'Lag en liste over hvem som skal varsles når fødselen starter.', category: 'practical', sourceUrl: 'https://www.gravidhjelpen.no/sjekkliste' },
  { id: 'pregnancy-home-ready', fromWeek: 39, label: 'Sjekk at det viktigste er klart hjemme: klær, bleier, soveplass og bilstol.', category: 'practical', sourceUrl: 'https://www.gravidhjelpen.no/sjekkliste' },
];

export const pregnancyChecklistForWeek = (week: number): PregnancyChecklistItem[] =>
  pregnancyChecklistItems.filter((item) => item.fromWeek <= week);

const ageDescriptions: Record<number, string> = {
  0: 'Et lite barn som ofte utforsker verden gjennom nærhet, lyder og korte våkne perioder.',
  1: 'Et barn som gjerne utforsker mer aktivt, og kan ha glede av korte turer med pauser.',
  2: 'Et nysgjerrig barn som ofte liker å bevege seg, leke og oppdage ting i eget tempo.',
  3: 'Et barn som gjerne deltar mer i enkel lek, samtaler og små oppdagelser sammen med andre.',
  4: 'Et barn som ofte liker å prøve selv, bruke fantasi og være med på aktiviteter med litt struktur.',
  5: 'Et barn som gjerne kombinerer lek, fantasi og mer selvstendig utforsking i kjente omgivelser.',
};

export const getAgeDescription = (ageYears: number): string =>
  ageDescriptions[ageYears] ?? 'Barn utvikler seg ulikt, og denne beskrivelsen er bare et generelt eksempel.';

export const getCurrentMilestone = (profile: DemoProfile, today: string): Milestone | null => {
  if (profile.stage === 'expecting') {
    const week = getJourneyWeek(profile, today);
    if (!week) return null;
    return [...milestones].filter((milestone) => milestone.stage === 'pregnancy' && milestone.minWeekOrMonth <= week).pop() ?? milestones[0];
  }
  if (profile.stage === 'baby_born') {
    if (profile.childAgeYears !== undefined && profile.childAgeYears > 1) {
      return milestones.find((milestone) => milestone.id === 'postpartum-toddler') ?? null;
    }
    const month = profile.childBirthDate ? Math.max(0, Math.floor(daysBetween(dateOnly(profile.childBirthDate), dateOnly(today)) / 30)) : 0;
    return [...milestones].filter((milestone) => milestone.stage === 'postpartum' && milestone.minWeekOrMonth <= month).pop() ?? milestones.find((milestone) => milestone.stage === 'postpartum') ?? null;
  }
  return null;
};

export const getParentAdvice = (profile: DemoProfile, today: string) => {
  const milestone = getCurrentMilestone(profile, today);
  return {
    pregnantParent: milestone?.pregnantParentTip ?? 'Velg det som føles nyttig og overkommelig for dere.',
    dadOrCoParent: milestone?.dadTip ?? 'Spør hva du kan ta ansvar for, og lytt til svaret.',
  };
};

export const isValidDemoState = (value: unknown): value is DemoState => {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<DemoState>;
  return candidate.schemaVersion === 1
    && (candidate.profile === null || typeof candidate.profile === 'object')
    && Array.isArray(candidate.checkedItemIds)
    && candidate.checkedItemIds.every((id) => typeof id === 'string')
    && Array.isArray(candidate.notificationPreviewSeenIds)
    && candidate.notificationPreviewSeenIds.every((id) => typeof id === 'string');
};
