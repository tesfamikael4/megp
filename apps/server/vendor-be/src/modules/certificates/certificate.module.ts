import { Module } from '@nestjs/common';
import { CertificateController } from './controllers/certificate.controller';
import { CertificateService } from './services/certificate.service';
import { VendorRegistrationModule } from '../vendor-registration/vendor-registration.module';
import { ServicePricingModule } from '../pricing/pricing.module';
import { BpmModule } from '../bpm/bpm.module';

@Module({
  imports: [VendorRegistrationModule, BpmModule, ServicePricingModule],
  controllers: [CertificateController],
  providers: [CertificateService],
})
export class CertificateModule {}
