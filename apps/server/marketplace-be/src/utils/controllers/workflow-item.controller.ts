import { Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import {
  CurrentUser,
  EntityCrudController,
  EntityCrudOptions,
  decodeCollectionQuery,
} from 'megp-shared-be';
import { WorkflowItem } from 'src/entities';
import { WorkflowItemService } from '../services/workflow-item.service';

const options: EntityCrudOptions = {};

@Controller('workflow-items')
@ApiTags('Workflow Items')
export class WorkflowItemController extends EntityCrudController<WorkflowItem>(
  options,
) {
  constructor(private readonly workflowItemService: WorkflowItemService) {
    super(workflowItemService);
  }

  @Get('/:objectId/:step')
  async canComplete(
    @Param('objectId') objectId: string,
    @Param('step') step: number,
    @CurrentUser() user: any,
  ) {
    return await this.workflowItemService.getWorkflowItemByObjectId(
      objectId,
      step,
      user,
    );
  }

  @Patch('complete-evaluation-approval/:objectId/:step')
  async completeEvaluationApproval(
    @Param('objectId') objectId: string,
    @Param('step') step: number,
    @CurrentUser() user: any,
  ) {
    return await this.workflowItemService.completeEvaluationApproval(
      objectId,
      step,
      user,
    );
  }

  @Get('current-item/:rfxId')
  async getCurrentItem(
    @Param('rfxId') rfxId: string,
    @CurrentUser() user: any,
  ) {
    return await this.workflowItemService.getCurrentItem(rfxId, user);
  }
}
