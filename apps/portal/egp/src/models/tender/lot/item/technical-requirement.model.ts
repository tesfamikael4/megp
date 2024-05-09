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
  specification = 'specification',
  delivery = 'delivery',
  personal = 'personal',
  packagingAndLabeling = 'packaging and labeling',
  warrantyAndSupport = 'warranty and support',
  incidentalRequirement = 'incidental requirement',
}
