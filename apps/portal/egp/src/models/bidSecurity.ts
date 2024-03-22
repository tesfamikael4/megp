export interface BidSecurity {
  id: string;
  guarantorId: string;
  guarantorBranchId: string;
  amount: number;
  remark: string;
  status?: string;
  createdAt?: string;
}
