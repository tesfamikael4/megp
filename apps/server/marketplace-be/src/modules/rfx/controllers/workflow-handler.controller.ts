import { ApiBody, ApiTags } from '@nestjs/swagger';
import { WorkflowHandlerService } from '../services/workflow-handler.service';
import { AllowAnonymous } from 'megp-shared-be';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { ConsumeMessage } from 'amqplib';
import { Controller, Post } from '@nestjs/common';

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
  async rfxApprovalResponse(payload: any, amqpMsg: ConsumeMessage) {
    if (amqpMsg.fields.routingKey === 'marketplace.approval') {
      console.log({ payload });
      return await this.workflowHandlerService.handleRfxApproval(
        payload,
        payload['ENTITY_MANAGER'],
      );
    }
  }

  @AllowAnonymous()
  @RabbitSubscribe({
    exchange: 'workflow-broadcast-exchanges',
    routingKey: 'marketplace.rfxEvaluationApproval',
    queue: 'marketplace',
    errorHandler: (err) => {
      console.log({ err });
    },
  })
  async rfxEvaluationApproval(payload: any, amqpMsg: ConsumeMessage) {
    if (amqpMsg.fields.routingKey === 'marketplace.rfxEvaluationApproval') {
      console.log({ payload });
      return await this.workflowHandlerService.handleEvaluationApproval(
        payload,
      );
    }
    if (amqpMsg.fields.routingKey === 'marketplace.approval') {
      console.log({ payload });
      return await this.workflowHandlerService.handleRfxApproval(
        payload,
        payload['ENTITY_MANAGER'],
      );
    }
  }
}
