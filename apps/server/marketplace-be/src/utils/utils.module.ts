import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PdfGeneratorService } from './services/pdf-generator.service';
import { DocumentService } from './services/document.service';
import { Document } from 'src/entities/document.entity';
import { DocumentController } from './controllers/document.controller';
import { MinIOModule, MinIOService } from 'megp-shared-be';
// import { MinioService } from 'nestjs-minio-client';

@Module({
  imports: [TypeOrmModule.forFeature([Document]), MinIOModule],
  providers: [
    PdfGeneratorService,
    DocumentService,
    // MinIOService,
  ],
  controllers: [DocumentController],
  exports: [PdfGeneratorService, DocumentService],
})
export class UtilityModule {}
