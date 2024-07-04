import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import {
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
  constructor(private readonly documentService: WorkflowItemDetailService) {
    super(documentService);
  }

  @Get('previous-step-result/:itemId/:currentStep')
  @ApiQuery({
    name: 'q',
    type: String,
    description: 'Collection Query Parameter. Optional',
    required: false,
  })
  async getPreviousStepResult(
    @Param('itemId') itemId: string,
    @Param('currentStep') currentStep: number,
    @Query('q') q?: string,
  ) {
    const query = decodeCollectionQuery(q);
    return await this.documentService.getPreviousStepResult(
      itemId,
      currentStep,
      query,
    );
  }
}
