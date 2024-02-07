import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusinessAreaEntity, InvoiceEntity, VendorsEntity, WorkflowInstanceEntity } from 'src/entities';
import { AuthorizationModule } from 'src/shared/authorization';
import { ReportController } from './controllers/report.controller';
import { ReportService } from './services/report.service';
import { HandlingCommonService } from '../handling/services/handling-common-services';

@Module({
    imports: [TypeOrmModule.forFeature([WorkflowInstanceEntity, VendorsEntity, InvoiceEntity, BusinessAreaEntity]),
        AuthorizationModule,
    ],
    exports: [],
    providers: [ReportService, HandlingCommonService],
    controllers: [ReportController],
})
export class ReportModule { }
