export interface TechnicalScoring {
  id: string;
  lotId: string;
  order: number;
  parentId?: string;
  requirement: string;
  requirementCondition: string;
  point: number;
  formLink: any;
  spdTechnicalScoringId?: string;
  spdTechnicalScoringParentId?: string;
  isProfessional?: boolean;
  hasProfessional?: boolean;
  validation?: {
    min: number;
    max: number;
  };
  isRequired: boolean;
}
export const RequirementCondition = [
  'Must meet',
  'Has to meet',
  'Not applicable',
];
