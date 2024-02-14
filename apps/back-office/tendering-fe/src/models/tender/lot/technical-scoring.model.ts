export interface TechnicalScoring {
  technicalEvaluationId: string;
  id?: string;
  orderNo: number;
  parentId?: string;
  requirement: any[];
  specification: string;
  requirementCondition: string;
  point: number;
  formLink: any;
  spdTechnicalScoringId?: string;
  spdTechnicalScoringParentId?: string;
  additionalRequirements: string;
  children?: [];
  isProfessional?: boolean;
  hasProfessional?: boolean;
  isRangeBasedCriteria: boolean;
  validation?: {
    min: number;
    max: number;
  };
  isRequired: boolean;
}
export const RequirementType = ['Merit Based', 'Compliant Based'];
export const RequirementCondition = ['MustMeet', 'HasToMeet', 'Not Applicable'];
export const ScoringBases = [
  'Education',
  'EducationForSurveys',
  'FirmExperience',
  'MethodologyBeyondTheMinimumRequirement',
  'WorkPlanAndStaffing',
  'SiteVisitKnowledgeAndAppreciationOfProjectArea',
  'SitePersonnelExperience',
  'TorCompliance',
];
export const JointVentureType = [
  'All Combined Partner',
  'Each Partner',
  'At Least One Partner',
];
