export interface BidDataSheet {
  id?: string;
  lotId?: string;
  packageId?: string;
  category: string;
  itbReference: string;
  attribute: string;
  value: any;
  mandate: string;
  inputType: string;
  order: number;
  description: string;
  readOnly: boolean;
  isRequired: boolean;
  spdBdsId?: string;
  isInternalUse: boolean;
  prefix?: string;
  dependency?: string[];
  notApplicable?: boolean;
  metadata: { [data: string]: any };
}
