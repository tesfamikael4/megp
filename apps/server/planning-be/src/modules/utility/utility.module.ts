import { Module } from '@nestjs/common';
import { QrCodeService } from './services/qr-generator.service';
import { QrCodeController } from './controllers/qr-generator.controller';
import { ReasonController } from './controllers/reason.controller';
import { ReasonService } from './services/reason.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reason } from 'src/entities/reason.entity';
import { PdfGeneratorService } from './services/pdf-generator.service';
import { DocumentService } from './services/document.service';

@Module({
  imports: [TypeOrmModule.forFeature([Reason, Document])],
  providers: [
    QrCodeService,
    ReasonService,
    PdfGeneratorService,
    DocumentService,
  ],
  controllers: [QrCodeController, ReasonController],
  exports: [ReasonService, PdfGeneratorService, DocumentService],
})
export class UtilityModule {}
