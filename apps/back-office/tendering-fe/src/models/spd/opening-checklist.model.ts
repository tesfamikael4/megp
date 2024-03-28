export interface OpeningChecklist {
  id: string;
  spdId: string;
  name: string;
  isBoolean: boolean;
  type: 'technical' | 'financial';
}
