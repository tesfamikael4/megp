export interface SpdTechnicalScoring {
  id: string;
  spdId: string;
  orderNo: number;
  parentId: string;
  requirement: string;
  specification: string;
  requirementCondition: string;
  point: number;
  formLink: string;
  additionalRequirements: string;
  validation: {
    min: number;
    max: number;
  };
  isProfessional?: boolean;
  hasProfessional?: boolean;
}
