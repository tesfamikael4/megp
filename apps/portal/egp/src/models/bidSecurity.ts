export interface BidSecurity {
  id: string;
  GuarantorId: string;
  GuarantorBranchId: string;
  amount: number;
  remark: string;
  status?: string;
  createdAt?: string;
}
