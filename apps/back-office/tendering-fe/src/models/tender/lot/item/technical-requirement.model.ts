export interface TechnicalRequirement {
  id?: string;
  itemId: string;
  category: string;
  requirement: string;
  condition: string;
  requirementType: 'exact' | 'minimum';
  formLink: string;
}
