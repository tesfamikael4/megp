import { Expose } from 'class-transformer';

export class TaxpayerCertificate {
  @Expose({ name: 'CertificateNumber' })
  certificateNumber: string;
  @Expose({ name: 'TpFullName' })
  tpFullName: string;
  @Expose({ name: 'TradingName' })
  tradingName: string;
  @Expose({ name: 'TPIN' })
  tPIN: string;
  @Expose({ name: 'NatureOfPayment' })
  natureOfPayment: string;
  @Expose({ name: 'Amount' })
  amount: number;
  @Expose({ name: 'AmountInWords' })
  amountInWords: string;
  @Expose({ name: 'Branch' })
  branch: string;
  @Expose({ name: 'CommercialBank' })
  commercialBank: string;
  @Expose({ name: 'DateIssued' })
  dateIssued: string;
  @Expose({ name: 'TaxYearStartDate' })
  taxYearStartDate: string;
  @Expose({ name: 'TaxYearEndDate' })
  taxYearEndDate: string;
  @Expose({ name: 'ClearancePurpose' })
  clearancePurpose: string;
  @Expose({ name: 'RecipientName' })
  recipientName: string;
  @Expose({ name: 'IdentityDescription' })
  identityDescription: string;
  @Expose({ name: 'IdentificationNumber' })
  identificationNumber: string;
  @Expose({ name: 'ValidityEndDate' })
  validityEndDate: string;
  @Expose({ name: 'RecipientAddress' })
  recipientAddress: string;
  @Expose({ name: 'AccountNumber' })
  accountNumber: string;
  @Expose({ name: 'SwiftCode' })
  swiftCode: string;
  @Expose({ name: 'Reason' })
  reason: string;
}
