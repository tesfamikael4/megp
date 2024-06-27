import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Document } from 'src/entities/document.entity';
import { SubmittedEvaluation } from 'src/entities/submitted-evaluations.entity';
import { MinIOModule } from 'src/shared/min-io/min-io.module';
import { PdfGeneratorService } from './pdf-generator/service/pdf-generator.service';
import { DocumentService } from './pdf-generator/service/document.service';
import { DocumentController } from './pdf-generator/controller/document.controller';
@Module({
  imports: [
    TypeOrmModule.forFeature([Document, SubmittedEvaluation]),
    MinIOModule,
  ],
  providers: [PdfGeneratorService, DocumentService],
  controllers: [DocumentController],
  exports: [PdfGeneratorService, DocumentService],
})
export class UtilityModule {}
