export interface Item {
  id: string;
  lotId: string;
  itemCode: string;
  itemType: string;
  procurementCategory: 'Goods' | 'Works';
  name: string;
  description: string;
  quantity: number;
  unitOfMeasure: string;
  estimatedPrice: number;
  estimatedPriceCurrency: string;
  marketPrice: number;
  marketPriceCurrency: string;
  hasBom: boolean;
  metadata: { [key: string]: any };
}
export enum ProcurementCategory {
  GOODS = 'goods',
  WORKS = 'works',
  CONSULTANCYSERVICES = 'consultancy services',
  NONCONSUTANCYSERVICES = 'non-consultancy services',
}
