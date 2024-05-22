export interface Qualification {
  id: string;
  lotId: string;
  category: string;
  factor: string;
  requirement: string;
  singleEntityCondition: any;
  jvCominedCondition: any;
  jvEachPartherCondition: any;
  jvAtleastOnePartnerCondition: any;
  order: string;
  formLink: string;
  itbDescription: string;
  itbReference: string;
  isRequired: boolean;
  spdQualificationId: string;
}
