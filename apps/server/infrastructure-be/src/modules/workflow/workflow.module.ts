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
import { DefaultStep } from 'src/entities/default-step.entity';
import { DefaultStepService } from './services/default-step.service';
import { DefaultStepController } from './controllers/default-step.controller';
import { Permission } from 'src/entities/permission.entity';
import { PermissionService } from './services/permission.service';
import { PermissionController } from './controllers/permission.controller';
import { AuthHelper } from 'megp-shared-be';
import { JwtService } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
import { InstanceStepService } from './services/instance-step.service';
import { InstanceStepController } from './controllers/instance-step.controller';
import { InstanceStep } from 'src/entities/instance-step.entity';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';

dotenv.config({ path: '.env' });

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Workflow,
      Step,
      Instance,
      Activity,
      State,
      DefaultStep,
      Permission,
      InstanceStep,
    ]),
    // RabbitMQModule.forRoot(RabbitMQModule, {
    //   exchanges: [
    //     {
    //       name: 'workflow-broadcast-exchanges',
    //       type: 'direct', // You can change this to 'topic', 'fanout', etc. as needed
    //     },
    //   ],
    //   uri: process.env.RMQ_URL, // Replace with your RabbitMQ URI
    //   enableControllerDiscovery: true,
    // }),
    ClientsModule.register([
      {
        name: 'PLANNING_RMQ_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RMQ_URL],
          queue: 'planning-workflow',
          queueOptions: {
            durable: false,
          },
        },
      },
      {
        name: 'TENDERING_RMQ_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RMQ_URL],
          queue: 'tendering-workflow',
          queueOptions: {
            durable: false,
          },
        },
      },
      {
        name: 'MARKETPLACE_RMQ_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RMQ_URL],
          queue: 'marketplace-workflow',
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
    XMachineService,
    DefaultStepService,
    StateService,
    InstanceService,
    InstanceStepService,
    ActivityService,
    PermissionService,
    AuthHelper,
    JwtService,
    InstanceController,
  ],
  controllers: [
    WorkflowController,
    StepController,
    DefaultStepController,
    ActivityController,
    InstanceController,
    InstanceStepController,
    StateController,
    PermissionController,
  ],
  exports: [
    // StateService,
    XMachineService,
    WorkflowModule,
  ],
})
export class WorkflowModule {}
