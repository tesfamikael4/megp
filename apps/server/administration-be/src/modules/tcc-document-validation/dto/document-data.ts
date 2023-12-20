import { Expose, Type } from 'class-transformer';
import { TaxpayerCertificate } from './taxpayer-certificate';

export class DocumentData {
  @Type(() => TaxpayerCertificate)
  @Expose({ name: 'TCC' })
  tcc: TaxpayerCertificate[];
}
