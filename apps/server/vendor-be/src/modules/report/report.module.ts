import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkflowInstanceEntity } from 'src/entities';
import { AuthorizationModule } from 'src/shared/authorization';
import { ReportController } from './controllers/report.controller';
import { ReportService } from './services/report.service';

@Module({
    imports: [TypeOrmModule.forFeature([WorkflowInstanceEntity]), AuthorizationModule],
    exports: [],
    providers: [ReportService],
    controllers: [ReportController],
})
export class ReportModule { }
