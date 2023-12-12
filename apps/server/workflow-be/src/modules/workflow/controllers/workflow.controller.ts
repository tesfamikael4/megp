import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Workflow } from 'src/entities';
import { WorkflowService } from '../services/workflow.service';
import { EntityCrudOptions } from 'src/shared/types/crud-option.type';
import { EntityCrudController } from 'src/shared/controller';

const options: EntityCrudOptions = {};

@Controller('workflow')
@ApiTags('workflow')
export class WorkflowController extends EntityCrudController<Workflow>(
  options,
) {
  constructor(private readonly workflowService: WorkflowService) {
    super(workflowService);
  }
}
