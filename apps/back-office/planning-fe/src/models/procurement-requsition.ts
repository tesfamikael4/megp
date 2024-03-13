export interface ProcurementRequisition {
  id: string;
  organization: any;
  name: string;
  description: string;
  requisitionReferenceNumber: string;
  userReferenceNumber: string;
  budgetId: string | null;
  postBudgetPlanId: string;
  budgetCode: {
    name: string;
    endDate: Date;
    startDate: Date;
  };
  totalEstimatedAmount: number;
  calculatedAmount: number;
  currency: string;
  status: string;
  procurementApplication: any;

  isPlanned: boolean;
  isMultiYear: boolean;
  remark: string;
  isFundAvaliable: boolean;
}
