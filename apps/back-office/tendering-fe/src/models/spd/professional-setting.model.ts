export interface SpdProfessionalSetting {
  id: string;
  spdId: string;
  requirement: string;
  formLink: string;
  validation: {
    min: number;
    max: number;
  };
}
