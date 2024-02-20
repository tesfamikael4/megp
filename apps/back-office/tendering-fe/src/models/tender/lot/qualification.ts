export interface Qualification {
  id: string;
  lotId: string;
  category: string;
  factor: string;
  requirement: string;
  singleEntityCondition: string;
  jvCominedCondition: string;
  jvEachPartherCondition: string;
  jvAtleastOnePartnerCondition: string;
  order: string;
  formLink: string;
  itbDescription: string;
  itbReference: string;
  isRequired: boolean;
  spdQualificationId: string;
}
