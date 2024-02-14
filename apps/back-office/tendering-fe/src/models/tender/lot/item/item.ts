import { Fee, ReimburseableExpense } from './consultancy';
import { Boq } from './bill-of-quantity.model';
import { ServiceCost } from './non-consultancy.model';

export interface Item {
  id?: string;
  lotId: string;
  itemCode: string;
  itemType: string;
  commodity: any;
  family: any;
  procurementCategory: string;
  productNumber: string;
  name: string;
  description: string;
  specifications: any;
  quantity: number;
  unitOfMeasure: string;
  estimatedPrice: number;
  estimatedPriceCurrency: string;
  serviceCost: ServiceCost[];
}

export interface TechnicalRequirement {
  id?: string;
  itemId: string;
  category: string;
  attribute?: string;
  value?: string;
  lotInPackageId?: string;
  requirement: string;
  condition: string;
  requirementType: string;
  order: number;
  formLink: string;
}
export interface NonTechnicalRequirement {
  id: string;
  itemId: string;
  category: string;
  attribute: string;
  value: string;
  order: number;
}
