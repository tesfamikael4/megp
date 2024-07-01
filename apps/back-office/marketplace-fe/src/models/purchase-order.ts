export interface PurchaseOrder {
  id: string;
  vendorName: string;

  organization: any;
  referenceNumber: string;
  procurementReference: string;
  version: string;

  description?: string;
  contactPerson: {
    name: string;
    phone: string;
  };
  expectedDeliveryDate: Date;
  status: string;
}
