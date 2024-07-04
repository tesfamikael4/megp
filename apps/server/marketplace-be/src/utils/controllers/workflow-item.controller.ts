import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import {
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
}
