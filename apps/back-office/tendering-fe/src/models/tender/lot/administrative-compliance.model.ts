export interface AdministrativeCompliance {
  id: string;
  lotId?: string;
  itbDescription: string;
  attribute: string;
  value: any;
  mandate: string;
  order: number;
  isRequired: boolean;
  type?: 'technical' | 'financial';
  spdAdministrativeComplianceId?: string;
}
