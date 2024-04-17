import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkflowInstanceEntity } from 'src/entities/workflow-instance.entity';
import { AuthorizationModule } from 'src/shared/authorization';
import { ApplicationExcutionController } from './controllers/application-execution.controller';
import { WorkflowInstanceController } from './controllers/workflow-instance.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([WorkflowInstanceEntity]),
    AuthorizationModule,
  ],
  exports: [],
  providers: [],
  controllers: [ApplicationExcutionController, WorkflowInstanceController],
})
export class HandlingModule { }
