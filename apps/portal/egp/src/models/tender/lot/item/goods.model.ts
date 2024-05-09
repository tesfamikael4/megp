import { BillOfMaterial } from './bill-of-material.model';
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
  billOfMaterial: BillOfMaterial[];
  incidentalCosts: ServiceCost[];
}
export enum SorType {
  specification = 'specification',
  delivery = 'delivery',
  packagingAndLabeling = 'packaging and labeling',
  warrantyAndSupport = 'warranty and support',
  incidentalRequirement = 'incidental requirement',
}
