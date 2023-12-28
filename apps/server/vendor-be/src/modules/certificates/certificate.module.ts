import { Module } from '@nestjs/common';
import { CertificateController } from './controllers/certificate.controller';
import { CertificateService } from './services/certificate.service';
import { VendorRegistrationModule } from '../vendor-registration/vendor-registration.module';
import { ServicePricingModule } from '../pricing/pricing.module';
import { BpmModule } from '../bpm/bpm.module';
import { AuthorizationModule } from 'src/shared/authorization';
import { HandlingModule } from '../handling/handling.module';

@Module({
  imports: [VendorRegistrationModule, BpmModule, AuthorizationModule, ServicePricingModule],
  controllers: [CertificateController],
  providers: [CertificateService],
})
export class CertificateModule { }
