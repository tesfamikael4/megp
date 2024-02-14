export interface SpdProfessionalSetting {
  id: string;
  spdId: string;
  requirement: string;
  point: number;
  formLink: string;
  requirementCondition: string;
  validation: {
    min: number;
    max: number;
  };
}
