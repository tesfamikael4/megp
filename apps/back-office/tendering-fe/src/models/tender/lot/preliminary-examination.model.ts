export interface PreliminaryExamination {
  id: string;
  lotId?: string;
  criteria: string;
  order: number;
  itbDescription: string;
  itbReference: string;
  isRequired: boolean;
  requirementCondition: string;
  type?: 'technical' | 'financial';
  formLink: string;
  spdAdministrativeComplianceId?: string;
}
