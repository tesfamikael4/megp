export interface InvoiceData {
  amount: string;
  applicationNo: null;
  attachment: null;
  createdOn: string;
  expired: boolean;
  refNumber: string;
  id: string;
  instanceId: null;
  payToAccName: string;
  payToAccNo: string;
  payToBank: string;
  payerName: string;
  paymentStatus: string;
  pricingId: string;
  remark: string;
  serviceId: string;
  serviceName: string;
  taskId: null;
  taskName: null;
  userId: string;
  paymentDetail: [
    {
      bc: string;
      name: string;
      fee: string;
      category: string;
    },
  ];
}
