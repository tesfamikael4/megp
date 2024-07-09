import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PdfGeneratorService } from './services/pdf-generator.service';
import { DocumentService } from './services/document.service';
import { Document } from 'src/entities/document.entity';
import { DocumentController } from './controllers/document.controller';
import { MinIOModule } from 'megp-shared-be';
import { SchedulerService } from './services/scheduler.service';
import { EncryptionHelperService } from './services/encryption-helper.service';
import { WorkflowItemService } from './services/workflow-item.service';
import { WorkflowItemDetailService } from './services/workflow-item-detail.service';
import { WorkflowItemController } from './controllers/workflow-item.controller';
import { WorkflowItemDetailController } from './controllers/workflow-item-detail.controller';
import { WorkflowItem, WorkflowItemDetail } from 'src/entities';
// import { MinioService } from 'nestjs-minio-client';

@Module({
  imports: [
    TypeOrmModule.forFeature([Document, WorkflowItem, WorkflowItemDetail]),
    MinIOModule,
  ],
  providers: [
    PdfGeneratorService,
    DocumentService,
    SchedulerService,
    EncryptionHelperService,
    WorkflowItemService,
    WorkflowItemDetailService,
    // MinIOService,
  ],
  controllers: [
    DocumentController,
    WorkflowItemController,
    WorkflowItemDetailController,
  ],
  exports: [
    PdfGeneratorService,
    DocumentService,
    SchedulerService,
    EncryptionHelperService,
    WorkflowItemService,
    WorkflowItemDetailService,
  ],
})
export class UtilityModule {}
