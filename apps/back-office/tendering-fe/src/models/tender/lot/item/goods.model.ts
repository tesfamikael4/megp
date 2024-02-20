import { Boq } from './bill-of-quantity.model';
import { Item } from '../item';
import { ServiceCost } from './service-cost.model';
import { TechnicalRequirement } from './technical-requirement.model';

export interface GoodsItemSor extends Item {
  scheduleOfRequirement: Requirement[];
  scheduleOfPrice?: ScheduleOfPrice;
  document: any;
}

export interface Requirement extends TechnicalRequirement {
  sorType:
    | 'specification'
    | 'delivery'
    | 'packaging and labeling'
    | 'warranty and support'
    | 'incidental requirement';
}
export interface ScheduleOfPrice {
  billOfMaterial: Boq[];
  incidentalCosts: ServiceCost[];
}
