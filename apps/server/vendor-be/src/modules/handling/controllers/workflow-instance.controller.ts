import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { DataResponseFormat } from 'src/shared/api-data';
import { CollectionQuery } from 'src/shared/collection-query';
import { WorkflowInstanceService } from '../services/workflow-instance.service';
import {
  CreateWorkflowInstanceDto,
  GotoNextStateDto,
  UpdateWorkflowInstanceDto,
  WorkflowInstanceResponse,
} from '../dto/workflow-instance.dto';
import { BusinessProcessService } from 'src/modules/bpm/services/business-process.service';
import { TaskService } from 'src/modules/bpm/services/task.service';
import { CurrentUser, JwtGuard } from 'src/shared/authorization';
@ApiBearerAuth()
@Controller('workflow-instances')
@ApiTags('workflow-instances')
@ApiExtraModels(DataResponseFormat)
export class WorkflowInstanceController {
  userInfo: any;
  constructor(
    private readonly workflowInstanceService: WorkflowInstanceService,
    private readonly bpService: BusinessProcessService,
    private readonly taskService: TaskService,
  ) { }
  @UseGuards(JwtGuard)
  @Post('submit-application')
  @ApiOkResponse({ type: WorkflowInstanceResponse })
  async create(
    @Body() dtos: CreateWorkflowInstanceDto[],
    @CurrentUser() user: any,
  ) {
    const instances = [];
    for (const wfi of dtos) {
      const bp = await this.bpService.findBpService(wfi.pricingId);
      if (!bp) {
        throw new NotFoundException('Business Process Not Found');
      }
      wfi.bpId = bp.id;
      wfi.serviceId = bp.serviceId;
      const result = await this.workflowInstanceService.create(wfi);
      instances.push(result);
    }
    for (const instance of instances) {
      const dto = new GotoNextStateDto();
      dto.action = 'ISR';
      dto.instanceId = instance.application.id;
      await this.workflowInstanceService.gotoNextStep(dto, this.userInfo);
    }
    return instances;
  }
  @UseGuards(JwtGuard)
  @Post('renew')
  @ApiOkResponse({ type: WorkflowInstanceResponse })
  async renew(
    @Body() dto: UpdateWorkflowInstanceDto,
    @CurrentUser() user: any,
  ) {
    const response = await this.workflowInstanceService.renewRegistration(
      dto,
      this.userInfo,
    );
    return response;
  }


  @UseGuards(JwtGuard)
  @Post('review-application')
  @ApiOkResponse({ type: WorkflowInstanceResponse })
  async reviewApplication(
    @Body() dto: GotoNextStateDto,
    @CurrentUser() user: any,
  ) {

    const response = await this.workflowInstanceService.reviewApplication(
      dto,
      user,
    );
    return response;
  }
  @UseGuards(JwtGuard)
  @Post('confirm-task')
  @ApiOkResponse({ type: WorkflowInstanceResponse })
  async confirmTask(@Body() dto: GotoNextStateDto, @CurrentUser() user: any) {
    const response = await this.workflowInstanceService.confirm(
      dto,
      this.userInfo,
    );
    return response;
  }
  @UseGuards(JwtGuard)
  @Post('submit-form-based-task')
  @ApiOkResponse({ type: WorkflowInstanceResponse })
  async submitTaskFormData(
    @Body() dto: GotoNextStateDto,
    @CurrentUser() user: any,
  ) {
    const response = await this.workflowInstanceService.submitFormBasedTask(
      dto,
      this.userInfo,
    );
    return response;
  }
  @UseGuards(JwtGuard)
  @Post('goto-next-state')
  @ApiOkResponse({ type: WorkflowInstanceResponse })
  async gotoNextState(@Body() dto: GotoNextStateDto, @CurrentUser() user: any) {
    const response = await this.workflowInstanceService.gotoNextStep(dto, user);
    const task = await this.taskService.findOne(response.taskHandler.taskId);
    if (task) {
      if (task.handlerType == 'System') {
        dto.action = task.taskType;
        const result = await this.workflowInstanceService.gotoNextStep(
          dto,
          this.userInfo,
        );
        return result;
      }
    }
    return response;
  }

}
