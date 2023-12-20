import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Workflow } from 'src/entities';
import { WorkflowService } from '../services/workflow.service';
import { EntityCrudOptions } from 'src/shared/types/crud-option.type';
import { EntityCrudController } from 'src/shared/controller';
import { XMachineService } from '../services/xMachine.service';

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
  async approveWorkflow(@Body() data: any) {
    return this.workflowService.approveWorkflow(
      data.workflowType,
      data.metaData,
      data.activityId,
    );
  }
}
