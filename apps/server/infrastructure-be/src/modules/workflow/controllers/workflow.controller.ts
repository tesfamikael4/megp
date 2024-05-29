import { Body, Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Workflow } from 'src/entities';
import { WorkflowService } from '../services/workflow.service';
import { AllowAnonymous, EntityCrudOptions } from 'megp-shared-be';
import { EntityCrudController } from 'megp-shared-be';
import { XMachineService } from '../services/xMachine.service';
import { CurrentUser, JwtGuard } from 'megp-shared-be';
// import { ClientProxy } from '@nestjs/microservices';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';

const options: EntityCrudOptions = {};

@Controller('workflow')
@ApiTags('workflow')
export class WorkflowController extends EntityCrudController<Workflow>(
  options,
) {
  constructor(
    private readonly workflowService: WorkflowService,
    private readonly amqpConnection: AmqpConnection,
  ) {
    super(workflowService);
  }

  @Post('workflow-test')
  @ApiBody({})
  @AllowAnonymous()
  async workflowtest(@Body() data: any) {
    this.amqpConnection.publish('workflow-broadcast-exchanges', data.key, data);

    // this.tenderingRMQClient.emit(
    //   `tendering-workflow.tenderApproval`,
    //   { "status": "Approved", "activityId": "06be2785-be85-44f7-89fe-95d91b76696c", "itemId": "2c0b33fc-04cf-401e-9d03-c7c0c2e84cd6" })
  }

  @Post('approve-workflow')
  async approveWorkflow(@Body() data: any, @CurrentUser() user) {
    data.metaData.userId = user.userId;
    data.metaData.organizationId = user.organization.id;
    return this.workflowService.approveWorkflow(
      data.metaData,
      data.activityId,
      data.instanceId,
      data.itemId,
    );
  }
}
