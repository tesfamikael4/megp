export interface SpdQualification {
  id?: string;
  spdId: string;
  category: string;
  factor: string;
  requirement: string;
  attribute: string;
  value: string;
  singleEntityCondition: Condition;
  jvCominedCondition: Condition;
  jvEachPartherCondition: Condition;
  jvAtleastOnePartnerCondition: Condition;
  order: string;
  formLink: string;
  mandate: string;
  itbDescription: string;
}
export interface Condition {
  value: string;
  additionalRequirements?: string;
}
export enum RequirementCondition {
  MustMeet = 'Must meet',
  HasToMeet = 'Has to meet',
  NotApplicable = 'Not applicable',
}
export const Attributes = {
  legal: [
    'Nationality',
    'Conflict of interest',
    'General experience',
    'Specific experience',
  ],
  professional: [
    'General experience',
    'Specific experience',
    'Personnel for the key positions',
  ],
  technical: ['General experience', 'Specific experience'],
  financial: ['General experience', 'Specific experience'],
};
