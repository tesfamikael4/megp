import { Boq } from './bill-of-quantity.model';
import { DayWork } from './day-work';
import { Item } from '../item';
import { TechnicalRequirement } from './technical-requirement.model';
import { Document } from './document.model';
import { ServiceCost } from './service-cost.model';

export interface Works extends Item {
  scheduleOfRequirement: Requirement[];
  scheduleOfPrice: ScheduleOfPrice[];
  document: Document[];
}

export interface Requirement extends TechnicalRequirement {
  sorType: 'specification' | 'personal' | 'incidental requirement';
}
export interface ScheduleOfPrice {
  billOfQuantity: Boq[];
  labor: DayWork[];
  material: DayWork[];
  equipment: DayWork[];
  incidentalCosts: ServiceCost[];
}
