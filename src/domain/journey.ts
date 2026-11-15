export type JourneyStage = 'expecting' | 'baby_born' | 'prefer_not_to_say';
export type ContentPreference = 'dad' | 'pregnant_parent' | 'both' | 'general';

export interface DemoProfile {
  stage: JourneyStage;
  dueDate?: string;
  enteredPregnancyWeek?: number;
  enteredWeekAnchorDate?: string;
  childBirthDate?: string;
  /** Barnets alder i hele måneder (0–12). Appen er avgrenset til første leveår. */
  childAgeMonths?: number;
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
  ageMinMonths: number;
  ageMaxMonths: number;
}

export interface PregnancyChecklistItem {
  id: string;
  fromWeek: number;
  label: string;
  category: 'practical' | 'preparation' | 'economy' | 'work';
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
  { id: 'postpartum-explore', stage: 'postpartum', minWeekOrMonth: 6, title: 'Utvid turradiusen litt', body: 'Mange familier får etter hvert lyst på litt lengre turer og nye steder. Velg steder der dere vet hva som finnes av stell og plass til vogn.', dadTip: 'Ta ansvar for å planlegge én tur i uka – sted, rute og hva som skal være med.', pregnantParentTip: 'Si hva slags tur som gir deg et avbrekk, og hva som bare blir slitsomt.', checklistIds: ['equipment', 'practical'], medicalClaim: false },
];

export const checklistItems: ChecklistItem[] = [
  { id: 'equipment-bag', listId: 'equipment', label: 'Finn fram det dere allerede har til en enkel babytur', category: 'must_have', ageMinMonths: 0, ageMaxMonths: 12 },
  { id: 'equipment-change', listId: 'equipment', label: 'Legg et ekstra skift og bleier i turbagen', category: 'must_have', ageMinMonths: 0, ageMaxMonths: 12 },
  { id: 'equipment-reuse', listId: 'equipment', label: 'Vurder om noe kan lånes eller gjenbrukes', category: 'can_wait', ageMinMonths: 0, ageMaxMonths: 12 },
  { id: 'equipment-blanket', listId: 'equipment', label: 'Ta med et teppe dere kan legge babyen på når dere tar en pause', category: 'practical', ageMinMonths: 4, ageMaxMonths: 12 },
  { id: 'practical-food', listId: 'practical', label: 'Avtal hvem som ordner et måltid på en travel dag', category: 'practical', ageMinMonths: 0, ageMaxMonths: 12 },
  { id: 'practical-route', listId: 'practical', label: 'Finn et rolig sted dere kan besøke med baby', category: 'practical', ageMinMonths: 0, ageMaxMonths: 12 },
  { id: 'practical-play', listId: 'practical', label: 'Finn et sted med plass til å ligge og utforske på gulvet', category: 'practical', ageMinMonths: 6, ageMaxMonths: 12 },
  { id: 'practical-support', listId: 'practical', label: 'Skriv ned én person dere kan spørre om hjelp', category: 'practical', ageMinMonths: 0, ageMaxMonths: 12 },
];

export const checklistItemsForAge = (ageMonths: number): ChecklistItem[] =>
  checklistItems.filter((item) => ageMonths >= item.ageMinMonths && ageMonths <= item.ageMaxMonths);

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

const ageDescriptions: { maxMonths: number; text: string }[] = [
  { maxMonths: 2, text: 'Et lite barn som ofte utforsker verden gjennom nærhet, lyder og korte våkne perioder.' },
  { maxMonths: 5, text: 'Mange babyer er lenger våkne og nysgjerrige på det de ser og hører. Korte turer med pauser passer ofte godt.' },
  { maxMonths: 8, text: 'Mange babyer liker å se på andre barn og nye omgivelser. Et sted med plass til å stoppe opp kan gjøre turen enklere.' },
  { maxMonths: 12, text: 'Mange babyer er aktive og vil utforske selv. Steder med plass på gulvet eller på et teppe kan være fine.' },
];

export const getAgeDescription = (ageMonths: number): string =>
  ageDescriptions.find((entry) => ageMonths >= 0 && ageMonths <= entry.maxMonths)?.text
  ?? 'Barn utvikler seg ulikt, og denne beskrivelsen er bare et generelt eksempel.';

/** Alder i måneder: valgt alder går foran fødselsdato. Avgrenset til 0–12. */
export const getChildAgeMonths = (profile: DemoProfile, today: string): number | undefined => {
  if (profile.stage !== 'baby_born') return undefined;
  if (profile.childAgeMonths !== undefined) return profile.childAgeMonths;
  if (!profile.childBirthDate) return undefined;
  const months = Math.floor(daysBetween(dateOnly(profile.childBirthDate), dateOnly(today)) / 30.44);
  return Math.max(0, Math.min(12, months));
};

export const formatAgeMonths = (months: number): string =>
  months === 0 ? 'under én måned' : months === 1 ? '1 måned' : `${months} måneder`;

export const getCurrentMilestone = (profile: DemoProfile, today: string): Milestone | null => {
  if (profile.stage === 'expecting') {
    const week = getJourneyWeek(profile, today);
    if (!week) return null;
    return [...milestones].filter((milestone) => milestone.stage === 'pregnancy' && milestone.minWeekOrMonth <= week).pop() ?? milestones[0];
  }
  if (profile.stage === 'baby_born') {
    const month = getChildAgeMonths(profile, today) ?? 0;
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
