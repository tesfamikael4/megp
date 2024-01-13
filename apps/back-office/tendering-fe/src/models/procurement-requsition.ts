export interface ProcurementRequisition {
  id: string;
  name: string;
  description: string;
  totalEstimatedAmount: number;
  organizationId: string;
  calculatedAmount: number;
}
