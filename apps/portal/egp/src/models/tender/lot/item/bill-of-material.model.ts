export interface BillOfMaterial {
  id: string;
  code: string;
  itemId: string;
  payItem: string;
  amount: number;
  description: string;
  parentCode: string;
  quantity: number;
  rate: number;
  unit: string;
}
