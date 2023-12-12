import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Step, Workflow } from 'src/entities';
import { WorkflowController } from './controllers/workflow.controller';
import { StepController } from './controllers/step.controller';
import { WorkflowService } from './services/workflow.service';
import { StepService } from './services/step.service';

@Module({
  imports: [TypeOrmModule.forFeature([Workflow, Step])],
  providers: [WorkflowService, StepService],
  controllers: [WorkflowController, StepController],
})
export class WorkflowModule {}
