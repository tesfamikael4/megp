import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PdfGeneratorService } from './services/pdf-generator.service';
import { DocumentService } from './services/document.service';
import { Document } from 'src/entities/document.entity';
import { DocumentController } from './controllers/document.controller';
import { MinIOModule } from 'megp-shared-be';
import { SchedulerService } from './services/scheduler.service';
import { EncryptionHelperService } from './services/encryption-helper.service';
// import { MinioService } from 'nestjs-minio-client';

@Module({
  imports: [TypeOrmModule.forFeature([Document]), MinIOModule],
  providers: [
    PdfGeneratorService,
    DocumentService,
    SchedulerService,
    EncryptionHelperService,
    // MinIOService,
  ],
  controllers: [DocumentController],
  exports: [
    PdfGeneratorService,
    DocumentService,
    SchedulerService,
    EncryptionHelperService,
  ],
})
export class UtilityModule {}
