export interface GuaranteeRelease {
  id: string;
  vendorId: string;
  guarantorId: string;
  guarantorBranchId: string;
  amount: number;
  remark: string;
  status?: string;
  createdAt?: string;
}
