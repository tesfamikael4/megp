export interface SpdTechnicalScoring {
  id: string;
  spdId: string;
  parentId: string;
  requirement: string;
  formLink: string;
  validation: {
    min: number;
    max: number;
  };
  isProfessional?: boolean;
}
