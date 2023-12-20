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
import { ActivityController } from './controllers/activity.controller';
import { ActivityService } from './services/activity.service';
import { Activity } from 'src/entities/activity.entity';
import { InstanceController } from './controllers/instance.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Workflow, Step, Instance, Activity])],
  providers: [
    WorkflowService,
    StepService,
    XMachineService,
    InstanceService,
    ActivityService,
  ],
  controllers: [
    WorkflowController,
    StepController,
    ActivityController,
    InstanceController,
  ],
})
export class WorkflowModule {}
