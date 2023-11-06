import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { DataResponseFormat } from 'src/shared/api-data';
import { CollectionQuery } from 'src/shared/collection-query';
import { WorkflowInstanceService } from '../services/workflow-instance.service';
import { WorkflowInstanceResponse } from '../dtos/workflow-instance.response';
import {
  CreateWorkflowInstanceDto,
  GotoNextStateDto,
  UpdateWorkflowInstanceDto,
} from '../dtos/workflow-instance.dto';
import { BusinessProcessService } from 'src/bpm/services/business-process.service';
import { TaskService } from 'src/bpm/services/task.service';
@Controller('workflow-instances')
@ApiTags('workflow-instances')
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiResponse({ status: 404, description: 'Item not found' })
@ApiResponse({ status: 400, description: 'Bad Request' })
@ApiExtraModels(DataResponseFormat)
export class WorkflowInstanceController {
  userInfo: any;
  constructor(
    private readonly workflowInstanceService: WorkflowInstanceService,
    private readonly bpService: BusinessProcessService,
    private readonly taskService: TaskService,
  ) {
    this.userInfo = {
      userId: '62e96410-e869-4231-b693-f7e22d498b65',
      name: 'muktar joseph',
    };
  }

  @Post('submit-application')
  @ApiOkResponse({ type: WorkflowInstanceResponse })
  async create(@Body() dtos: CreateWorkflowInstanceDto[]) {
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
  @Post('renew')
  @ApiOkResponse({ type: WorkflowInstanceResponse })
  async renew(@Body() dto: UpdateWorkflowInstanceDto) {
    const response = await this.workflowInstanceService.renewRegistration(
      dto,
      this.userInfo,
    );
    return response;
  }
  @Post('upgrade')
  @ApiOkResponse({ type: WorkflowInstanceResponse })
  async upgrade(@Body() dto: UpdateWorkflowInstanceDto) {
    const response = await this.workflowInstanceService.upgradeRegistration(
      dto,
      this.userInfo,
    );
    return response;
  }
  @Post('review-application')
  @ApiOkResponse({ type: WorkflowInstanceResponse })
  async reviewApplication(@Body() dto: GotoNextStateDto) {
    const userInfo = { userId: '', name: 'derehy giki' };
    const response = await this.workflowInstanceService.reviewApplication(
      dto,
      userInfo,
    );
    return response;
  }
  @Post('confirm-task')
  @ApiOkResponse({ type: WorkflowInstanceResponse })
  async confirmTask(@Body() dto: GotoNextStateDto) {
    const response = await this.workflowInstanceService.confirm(
      dto,
      this.userInfo,
    );
    return response;
  }
  @Post('submit-form-based-task')
  @ApiOkResponse({ type: WorkflowInstanceResponse })
  async submitTaskFormData(@Body() dto: GotoNextStateDto) {
    const response = await this.workflowInstanceService.submitFormBasedTask(
      dto,
      this.userInfo,
    );
    return response;
  }
  @Post('goto-next-state')
  @ApiOkResponse({ type: WorkflowInstanceResponse })
  async gotoNextState(@Body() dto: GotoNextStateDto) {
    const response = await this.workflowInstanceService.gotoNextStep(
      dto,
      this.userInfo,
    );
    // const task = await this.workflowInstanceService.getTaskById(
    //   response.taskHandler.taskId);
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

  @Get('generate-certeficate/:vendorId')
  @ApiOkResponse({ type: WorkflowInstanceResponse })
  async generateCerteficate(
    @Param('vendorId') vendorId: string,
    @Query() query: CollectionQuery,
  ) {
    return await this.workflowInstanceService.getCerteficateInfo(
      vendorId,
      query,
    );
  }
}
