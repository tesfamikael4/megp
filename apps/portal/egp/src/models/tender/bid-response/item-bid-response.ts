export interface ItemBidResponse {
  lotId: string;
  itemId: string;
  documentType: ResponseType;
  values: Values[];
  password: string;
}
export interface GetItemBidResponse {
  lotId: string;
  itemId: string;
  documentType: ResponseType;
  key: string;
  password: string;
}
export type ResponseType =
  | 'RESPONSE'
  | 'FINANCIALRESPONSE'
  | 'TECHNICALRESPONSE';

export interface Values {
  key: string;
  value: any;
}
