export interface PreBudgetPlanItems {
  id: string;
  preBudgetPlanActivityId: string;
  itemCodeReferenceType: string;
  itemCode: string;
  metaData: object;
  description: string;
  specification: object;
  unitPrice: number;
  currency: string;
  quantity: number;
  measurement: string;
  UoM: string;
}
