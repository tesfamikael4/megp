import { Boq } from './bill-of-quantity.model';
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
  billOfMaterial: Boq[];
  labor: DayWork[];
  equipment: DayWork[];
  incidentalCosts: ServiceCost[];
}
