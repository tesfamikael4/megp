import { ApiBody, ApiTags } from '@nestjs/swagger';
import { WorkflowHandlerService } from '../services/workflow-handler.service';
import { AllowAnonymous } from 'megp-shared-be';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { ConsumeMessage } from 'amqplib';
import { Controller, Post } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';

@ApiTags('Workflow Handler')
@Controller('workflow')
export class WorkflowHandlerController {
  constructor(
    private readonly workflowHandlerService: WorkflowHandlerService,
  ) {}

  // @AllowAnonymous()
  // @RabbitSubscribe({
  //   exchange: 'workflow-broadcast-exchanges',
  //   routingKey: 'marketplace.approval',
  //   queue: 'marketplace',
  //   errorHandler: (err) => {
  //     console.log({ err });
  //   },
  // })
  @EventPattern('marketplace-workflow.RFQApproval')
  @AllowAnonymous()
  async rfxApprovalResponse(payload: any) {
    // if (amqpMsg.fields.routingKey === 'marketplace.approval') {
    console.log({ payload });
    return await this.workflowHandlerService.handleRfxApproval(
      payload,
      // payload['ENTITY_MANAGER'],
    );
    // }
  }

  // @RabbitSubscribe({
  //   exchange: 'workflow-broadcast-exchanges',
  //   routingKey: 'marketplace.rfxEvaluationApproval',
  //   queue: 'marketplace',
  //   errorHandler: (err) => {
  //     console.log({ err });
  //   },
  // })
  @EventPattern('marketplace-workflow.RFQEvaluationApproval')
  @AllowAnonymous()
  async rfxEvaluationApproval(payload: any) {
    return await this.workflowHandlerService.handleEvaluationApproval(payload);
  }
}
