export interface TechnicalRequirement {
  id: string;
  itemId: string;
  category: string;
  requirement: string;
  condition: string;
  requirementType: 'exact' | 'minimum';
  formLink: string;
}

export enum SorType {
  SPECIFICATION = 'specification',
  DELIVERY = 'delivery',
  PERSONAL = 'personal',
  PACKAGING = 'packing and labeling',
  WARRANTY = 'warranty ans support',
  INCIDENTAL = 'incidental requirement',
}
