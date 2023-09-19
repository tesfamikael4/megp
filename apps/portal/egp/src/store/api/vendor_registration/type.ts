/* Types */
export interface Payment {
  paymentMethodEnum: string;
  orderId: number;
}

export interface BoaPaymentPayload extends Payment {
  totalAmount: number;
}
export interface EthSwitchPaymentPayload extends Payment {
  totalAmount: number;
}
