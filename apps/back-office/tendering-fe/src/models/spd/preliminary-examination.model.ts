export interface SpdPreliminaryExamination {
  id: string;
  spdId: string;
  criteria: string;
  type: 'technical' | 'financial';
  itbDescription: string;
  itbReference: string;
  formLink: string;
}
