import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Workflow } from 'src/entities';
import { WorkflowService } from '../services/workflow.service';
import { EntityCrudOptions } from 'src/shared/types/crud-option.type';
import { EntityCrudController } from 'src/shared/controller';
import { XMachineService } from '../services/xMachine.service';
import { CurrentUser, JwtGuard } from 'src/shared/authorization';

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
  @UseGuards(JwtGuard)
  async approveWorkflow(@Body() data: any, @CurrentUser() user) {
    data.metaData.userId = user.userId;
    // data.metaData.userId = user.organization.id;
    return this.workflowService.approveWorkflow(
      data.workflowType,
      data.metaData,
      data.activityId,
    );
  }
}
