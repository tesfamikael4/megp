export interface BudgetPlanActivities {
  id: string;
  preBudgetPlanId: string;
  name: string;
  procurementReference: string;
  description: string;
  totalEstimatedAmount: number;
  calculatedAmount: number;
  currency: string;
  fundingSource: string;
  procurementMethod: string;
  procurementType: string;
  procurementStatus: string;
  donor: object;
  isMultiYear: boolean;
  multiYearBudget: object;
  preference: string;
  procurementProcess: string;
  remark: string;
}
