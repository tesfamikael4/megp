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
import { WorkflowInstanceService } from '../workflow-instances/workflow-instance.service';
import { WorkflowInstanceResponse } from '../workflow-instances/workflow-instance.response';
import {
  CreateWorkflowInstanceDto,
  UpdateWorkflowInstanceDto,
} from '../workflow-instances/dtos/workflow-instance.dto';
import {
  CreateTaskHandlerDto,
  DeleteTaskHandlerDto,
  UpdateTaskHandlerDto,
} from '../workflow-instances/dtos/task-handler.dto';
@Controller('workflow-instances')
@ApiTags('workflow-instances')
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiResponse({ status: 404, description: 'Item not found' })
@ApiResponse({ status: 400, description: 'Bad Request' })
@ApiExtraModels(DataResponseFormat)
export class WorkflowInstanceController {
  constructor(
    private readonly workflowInstanceService: WorkflowInstanceService,
  ) {}
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
    console.log(dto);
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
  @Delete('delete-workflow-instance-handler')
  async deleteTaskHandler(@Body() dto: DeleteTaskHandlerDto) {
    return await this.workflowInstanceService.removeTaskHandler(dto);
  }
}
