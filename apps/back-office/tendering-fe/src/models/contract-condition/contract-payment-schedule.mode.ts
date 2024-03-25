export interface ContractPaymentScheduleForm {
  id: string;
  paymentSchedule: string;
  paymentPercentage: number;
  order: number;
  requiredDocuments: string[];
}
