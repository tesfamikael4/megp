import {
  Body,
  Controller,
  Delete,
  Get,
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
import { ApiPaginatedResponse, DataResponseFormat } from 'src/shared/api-data';
import { CollectionQuery } from 'src/shared/collection-query';
import { WorkflowInstanceService } from '../services/workflow-instance.service';
import { WorkflowInstanceResponse } from '../dtos/workflow-instance.response';
import {
  CreateWorkflowInstanceDto,
  GotoNextStateDto,
  UpdateWorkflowInstanceDto,
} from '../dtos/workflow-instance.dto';
import {
  CreateTaskHandlerDto,
  UpdateTaskHandlerDto,
} from '../dtos/task-handler.dto';
@Controller('workflow-instances')
@ApiTags('workflow-instances')
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiResponse({ status: 404, description: 'Item not found' })
@ApiResponse({ status: 400, description: 'Bad Request' })
@ApiExtraModels(DataResponseFormat)
export class WorkflowInstanceController {
  userId: string;
  constructor(
    private readonly workflowInstanceService: WorkflowInstanceService,
  ) {
    this.userId = 'c785d351-05e3-59dc-15a3-f9da417b1f74';
  }
  @Get('get-workflow-instances')
  @ApiPaginatedResponse(WorkflowInstanceResponse)
  async fetch(@Query() query: CollectionQuery) {
    return await this.workflowInstanceService.getWorkflowInstances(query);
  }
  @Get('get-workflow-instance/:id')
  @ApiOkResponse({ type: WorkflowInstanceResponse })
  async getServiceById(@Param('id') id: string) {
    return await this.workflowInstanceService.getById(id);
  }
  @Post('create-workflow-instance')
  @ApiOkResponse({ type: WorkflowInstanceResponse })
  async create(@Body() dto: CreateWorkflowInstanceDto) {
    console.log(dto, this.userId);

    return await this.workflowInstanceService.create(dto);
  }
  @Post('update-workflow-instance')
  @ApiOkResponse({ type: WorkflowInstanceResponse })
  async update(@Body() dto: UpdateWorkflowInstanceDto) {
    return await this.workflowInstanceService.update(dto);
  }
  @Get('delete-workflow-instance/:id')
  async delete(@Param('id') id: string) {
    return await this.workflowInstanceService.delete(id);
  }
  @Post('add-workflow-instance-handler')
  @ApiOkResponse({ type: WorkflowInstanceResponse })
  async addTaskHandler(@Body() dto: CreateTaskHandlerDto) {
    return await this.workflowInstanceService.addTaskHandler(dto);
  }
  @Post('update-workflow-instance-handler')
  @ApiOkResponse({ type: WorkflowInstanceResponse })
  async updateTaskHandler(@Body() dto: UpdateTaskHandlerDto) {
    return await this.workflowInstanceService.updateTaskHandler(dto);
  }
  @Post('goto-next-state')
  @ApiOkResponse({ type: WorkflowInstanceResponse })
  async gotoNextStateDto(@Body() dto: GotoNextStateDto) {
    const response = await this.workflowInstanceService.gotoNextStep(dto);
    if (dto.action.toUpperCase() == 'PAY') {
      dto.action = 'PaymentReview';
      console.log(' dto.action', dto.action);
      const response = await this.workflowInstanceService.gotoNextStep(dto);
      return response;
    }
    return response;
  }
}
