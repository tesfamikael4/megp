import { Expose } from 'class-transformer';

export class TaxpayerData {
  @Expose({ name: 'TIN' })
  tin: string;
  @Expose({ name: 'TaxpayerName' })
  taxpayerName: string;
  @Expose({ name: 'TradingNames' })
  tradingNames: string[];
  @Expose({ name: 'PostalAddress' })
  postalAddress: string;
  @Expose({ name: 'BusinessSectorISIC' })
  businessSectorISIC: string;
  @Expose({ name: 'TaxpayerSegment' })
  taxpayerSegment: string;
  @Expose({ name: 'RegistrationDate' })
  registrationDate: string;
}
