export interface ProcurementRequisition {
  id: string;
  organization: any;
  name: string;
  description: string;
  requisitionReferenceNumber: string;
  userReferncceNumber: string;
  budgetYear: any;
  totalEstimatedAmount: string;
  calculatedAmount: number;
  currency: string;
  status: string;
  procurementType: any;
  budgetCode: any;
  isPlanned: boolean;
  isMultiYear: boolean;
  remark: string;
  isFundAvaliable: boolean;
}
