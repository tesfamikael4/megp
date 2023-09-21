import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiPaginatedResponse, DataResponseFormat } from 'src/shared/api-data';
import { CollectionQuery } from 'src/shared/collection-query';
import { TaskService } from '../tasks/task.service';
import { TaskResponse } from '../tasks/task.response';
import { CreateTaskDto, UpdateTaskDto } from '../tasks/dtos/task.dto';
@Controller('tasks')
@ApiTags('tasks')
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiResponse({ status: 404, description: 'Item not found' })
@ApiResponse({ status: 400, description: 'Bad Request' })
@ApiExtraModels(DataResponseFormat)
export class TaskController {
  constructor(private readonly businessProcessProvider: TaskService) {}
  @Get('get-tasks')
  @ApiPaginatedResponse(TaskResponse)
  async fetch(@Query() query: CollectionQuery) {
    return await this.businessProcessProvider.getTasks(query);
  }
  @Get('get-task/:id')
  @ApiOkResponse({ type: TaskResponse })
  async getServiceById(@Param('id') id: string) {
    return await this.businessProcessProvider.getById(id);
  }
  @Post('create-task')
  @ApiPaginatedResponse(TaskResponse)
  async create(@Body() dto: CreateTaskDto) {
    console.log(dto);
    return await this.businessProcessProvider.create(dto);
  }
  @Post('update-task')
  @ApiPaginatedResponse(TaskResponse)
  async update(@Body() dto: UpdateTaskDto) {
    return await this.businessProcessProvider.update(dto);
  }
  @Get('delete-task/:id')
  async delete(@Param('id') id: string) {
    return await this.businessProcessProvider.delete(id);
  }
}
