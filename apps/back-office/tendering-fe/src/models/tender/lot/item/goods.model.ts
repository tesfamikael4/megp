import { Boq } from './bill-of-quantity.model';
import { Item, NonTechnicalRequirement, TechnicalRequirement } from './item';

export interface GoodsItem extends Item {
  expectedPeriod: any;
  technicalRequirement: TechnicalRequirement[];
  nonTechnicalRequirement: NonTechnicalRequirement[];
  billOfMaterial: Boq[];
}
