export interface GuaranteeRequest {
  id: string;
  tenantId: string;
  vendorId: string;
  vendorName: string;
  guarantorId: string;
  guarantorName: string;
  guarantorBranchId: string;
  guarantorBranchName: string;
  startDate: Date;
  endDate: Date;
  type: string;
  objectId: string;
  objectType: string;
  minValidityDate: Date;
  garantorValidityDate: Date;
  name: string;
  title: string;
  amount: number;
  currencyType: string;
  remark: string;
  attachment: any;
  status: string;
  createdAt?: string;
}
