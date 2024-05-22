export interface Item {
  id: string;
  lotId: string;
  itemCode: string;
  itemType: string;
  procurementCategory: string;
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
  isOpen: boolean;
  status: string;
}
