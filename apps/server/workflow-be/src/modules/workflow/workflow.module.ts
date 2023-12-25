import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';
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
import { StateService } from './services/state.service';
import { StateController } from './controllers/state.controller';
import { State } from 'src/entities/state.entity';
import { DefaultStep } from 'src/entities/defaultStep.entity';
import { DefaultStepService } from './services/defaultStep.service';
import { DefaultStepController } from './controllers/defaultStep.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Workflow,
      Step,
      Instance,
      Activity,
      State,
      DefaultStep,
    ]),
    ClientsModule.register([
      {
        name: 'WORKFLOW_RMQ_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://guest:guest@localhost:5672/'],
          queue: 'work-plan',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  providers: [
    WorkflowService,
    StepService,
    DefaultStepService,
    XMachineService,
    InstanceService,
    ActivityService,
    StateService,
  ],
  controllers: [
    WorkflowController,
    StepController,
    DefaultStepController,
    ActivityController,
    InstanceController,
    StateController,
  ],
})
export class WorkflowModule {}
