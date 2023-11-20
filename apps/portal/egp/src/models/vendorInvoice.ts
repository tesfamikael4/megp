export interface InvoiceData {
  id: string;
  InstanceId: string;
  applicationNo: string;
  taskName: string;
  taskId: string;
  serviceName: string;
  payerName: string;
  payerAccountId: string;
  payToAccNo: string;
  payToAccName: string;
  payToBank: string;
  amount: number;
  createdOn: string; // You can use a date-time library like moment.js for date parsing and formatting
  paymentStatus: string;
  remark: string;
  attachment: string;
}
