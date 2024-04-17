export interface BidSecurity {
  id: string;
  lotId: string;
  guarantorId: string;
  guarantorName: string;
  guarantorBranchId: string;
  guarantorBranchName: string;
  revisedValidityDate: number;
  contactPerson: {
    email?: string;
    fullName?: string;
    phoneNumber?: string;
  };
  name: string;
  title: string;
  amount: number;
  currency: string;
  description: string;
  document: {};
  status: string;
  createdAt: string;
}
