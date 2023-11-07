export interface PreBudgetPlanActivities {
  id: string;
  preBudgetPlanId: string;
  name: string;
  procurementReference: string;
  description: string;
  totalEstimatedAmount: number;
  currency: string;
  fundingSource: string;
  procurementMethod: string;
  procurementType: string;
  procurementStatus: string;
  donor: object;
  isMultiYear: boolean;
  multiYearBudget: object;
  indigenousPreference: boolean;
  preferenceValue: object;
  remark: string;
}
