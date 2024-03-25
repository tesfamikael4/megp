export interface GuaranteeRequest {
  id: string;
  vendorId: string;
  guarantorId: string;
  guarantorBranchId: string;
  type: string;
  attachment: any;
  presignedUrl?: any;
  minValidityDate: Date;
  remark?: string;
  status: string;
}
