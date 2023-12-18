import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Step, Workflow } from 'src/entities';
import { WorkflowController } from './controllers/workflow.controller';
import { StepController } from './controllers/step.controller';
import { WorkflowService } from './services/workflow.service';
import { StepService } from './services/step.service';
import { XMachineService } from './services/xMachine.service';
import { InstanceService } from './services/instance.service';
import { Instance } from 'src/entities/instance.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Workflow, Step, Instance])],
  providers: [WorkflowService, StepService, XMachineService, InstanceService],
  controllers: [WorkflowController, StepController],
})
export class WorkflowModule {}
