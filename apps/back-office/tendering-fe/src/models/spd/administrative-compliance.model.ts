export interface SpdAdministrativeCompliance {
  id?: string;
  spdId?: string;
  itbDescription: string;
  attribute: string;
  value: string;
  mandate: string;
  order: number;
  isRequired: boolean;
}
export const Attributes = [
  'documentaryEvidence',
  'bidLanguage',
  'bidSecurity',
  'bidCurrency',
  'customAttribute',
];
