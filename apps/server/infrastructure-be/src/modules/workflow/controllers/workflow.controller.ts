import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Workflow } from 'src/entities';
import { WorkflowService } from '../services/workflow.service';
import { EntityCrudOptions } from 'megp-shared-be';
import { EntityCrudController } from 'megp-shared-be';
import { CurrentUser } from 'megp-shared-be';

const options: EntityCrudOptions = {};

@Controller('workflow')
@ApiTags('workflow')
export class WorkflowController extends EntityCrudController<Workflow>(
  options,
) {
  constructor(private readonly workflowService: WorkflowService) {
    super(workflowService);
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
