export interface ContractConditions {
  id: string;
  rfxId: string;
  deliveryPeriod: number;
  deliverySite: string;
  warrantyPeriod: string;
  liquidityDamage: number;
  liquidityDamageLimit: number;
  paymentTerm: string;
  paymentMode: string[];
  paymentReleasePeriod: number;
}
