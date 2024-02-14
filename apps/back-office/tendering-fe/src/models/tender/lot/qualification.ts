export interface Qualification {
  id: string;
  technicalEvaluationId: string;
  financialEvaluationId: string;
  lotInPackageId: string;
  category: string;
  factor: string;
  requirement: string;
  attribute: string;
  value: any;
  singleEntityCondition: string;
  jvCominedCondition: string;
  jvEachPartherCondition: string;
  jvAtleastOnePartnerCondition: string;
  order: string;
  formLink: string;
  mandate: string;
  itbDescription: string;
  spdQualificationId: string;
}
export interface QualificationDetail {
  id: string;
  orderNo: number;
  factor: string;
  requirement: string;
  sectionLink: any;
  singleRequirementCondition?: string;
  jointVentureType?: string;
  jointVentureRequirementCondition?: string;
  additionalRequirements: string;
}
export const Attributes = [
  'documentaryEvidence',
  'powerOfAttorney',
  'bidLanguage',
  'bidSecurity',
  'bidCurrency',
];
