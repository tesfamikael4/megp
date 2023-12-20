export interface Mandate {
  id: string;
  name: string;
  description: string;
  isSingleAssignment: boolean | string;
}
export interface MyMandate {
  id: string;
  name: string;
  description: string;
  isSingleAssignment: boolean | string;
  mandate: any;
  mandateId: string;
}
