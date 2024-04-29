import { BillOfMaterial } from './bill-of-material.model';
import { DayWork } from './day-work';
import { Item } from '../item';
import { ServiceCost } from './service-cost.model';
import { TechnicalRequirement } from './technical-requirement.model';

export interface INonConsultancy extends Item {
  scheduleOfRequirement: Requirement[];
  scheduleOfPrice: ScheduleOfPrice;
}

export interface Requirement extends TechnicalRequirement {
  sorType: 'specification' | 'personal' | 'incidental requirement';
}
export interface ScheduleOfPrice {
  billOfMaterial: BillOfMaterial[];
  labor: DayWork[];
  equipment: DayWork[];
  incidentalCosts: ServiceCost[];
}
export enum SorType {
  specification = 'specification',
  personal = 'personal',
  incidentalRequirement = 'incidental requirement',
}
