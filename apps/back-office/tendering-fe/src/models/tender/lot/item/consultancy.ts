import { Fee } from './fee.model';
import { Item } from '../item';
import { ServiceCost } from './service-cost.model';
import { ReimburseableExpense } from './reimburseable-expense.model';
import { TechnicalRequirement } from './technical-requirement.model';

export interface ConsultancyItem extends Item {
  scheduleOfRequirement: Requirement[];
  scheduleOfPrice: ScheduleOfPrice;
}

export interface Requirement extends TechnicalRequirement {
  sorType: 'specification' | 'personal' | 'incidental requirement';
}
export interface ScheduleOfPrice {
  reimburseableExpense: ReimburseableExpense[];
  fee: Fee[];
  incidentalCosts: ServiceCost[];
}
