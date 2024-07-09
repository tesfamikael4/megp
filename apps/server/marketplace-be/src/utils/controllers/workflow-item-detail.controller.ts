import { Body, Controller, Get, Param, Put, Query, Req } from '@nestjs/common';
import { ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import {
  BaseAPIDto,
  CurrentUser,
  ExtraCrudController,
  ExtraCrudOptions,
  decodeCollectionQuery,
} from 'megp-shared-be';
import { WorkflowItemDetail } from 'src/entities';
import { WorkflowItemDetailService } from '../services/workflow-item-detail.service';
import {
  CreateWorkflowItemDetailDto,
  UpdateWorkflowItemDetailDto,
} from '../dtos/workflow-item-detail.dto';

const options: ExtraCrudOptions = {
  entityIdName: 'workflowItemId',
  createDto: CreateWorkflowItemDetailDto,
  updateDto: UpdateWorkflowItemDetailDto,
};

@Controller('workflow-item-details')
@ApiTags('Workflow Item Details')
export class WorkflowItemDetailController extends ExtraCrudController<WorkflowItemDetail>(
  options,
) {
  constructor(
    private readonly workflowItemDetailService: WorkflowItemDetailService,
  ) {
    super(workflowItemDetailService);
  }

  @Put(':id')
  @ApiBody({ type: UpdateWorkflowItemDetailDto })
  async update(
    @Param('id') id: string,
    @Body() itemData: UpdateWorkflowItemDetailDto,
    @Req() req?: any,
  ): Promise<WorkflowItemDetail | undefined> {
    return this.workflowItemDetailService.updateItem(id, itemData, req);
  }

  @Get('previous-results/:itemId')
  async getPreviousStepResult(@Param('itemId') itemId: string) {
    return await this.workflowItemDetailService.getPreviousResult(itemId);
  }

  @Get('my-latest-response/:itemId/:step')
  async getMyLatestResponse(
    @Param('itemId') itemId: string,
    @Param('step') step: number,
    @CurrentUser() user: any,
  ) {
    return await this.workflowItemDetailService.getMyLatestResponse(
      itemId,
      step,
      user,
    );
  }
}
