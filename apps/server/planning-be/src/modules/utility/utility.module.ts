import { Module } from '@nestjs/common';
import { QrCodeService } from './services/qr-generator.service';
import { QrCodeController } from './controllers/qr-generator.controller';
import { ReasonController } from './controllers/reason.controller';
import { ReasonService } from './services/reason.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reason } from 'src/entities/reason.entity';
import { PdfGeneratorService } from './services/pdf-generator.service';
import { DocumentService } from './services/document.service';
import { Document } from 'src/entities/document.entity';
import { MinIOModule } from 'src/shared/min-io/min-io.module';
import { DocumentController } from './controllers/document.controller';
import { SubmittedPlanService } from './services/submitted-plan.service';
import { SubmittedPlanController } from './controllers/submitted-plan.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Reason, Document]), MinIOModule],
  providers: [
    QrCodeService,
    ReasonService,
    PdfGeneratorService,
    DocumentService,
    SubmittedPlanService,
  ],
  controllers: [
    QrCodeController,
    ReasonController,
    DocumentController,
    SubmittedPlanController,
  ],
  exports: [
    ReasonService,
    PdfGeneratorService,
    DocumentService,
    SubmittedPlanService,
  ],
})
export class UtilityModule {}
