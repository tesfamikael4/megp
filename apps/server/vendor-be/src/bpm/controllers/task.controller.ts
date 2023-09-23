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
import { TaskService } from '../tasks/task.service';
import { TaskResponse } from '../tasks/task.response';
import { CreateTaskDto, UpdateTaskDto } from '../tasks/dtos/task.dto';
import {
  CreateTaskAssignmentDto,
  DeleteTaskAssignmentDto,
  UpdateTaskAssignmentDto,
} from '../tasks/dtos/task-assignmment.dto';
@Controller('tasks')
@ApiTags('tasks')
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiResponse({ status: 404, description: 'Item not found' })
@ApiResponse({ status: 400, description: 'Bad Request' })
@ApiExtraModels(DataResponseFormat)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}
  @Get('get-tasks')
  @ApiPaginatedResponse(TaskResponse)
  async fetch(@Query() query: CollectionQuery) {
    return await this.taskService.getTasks(query);
  }
  @Get('get-task/:id')
  @ApiOkResponse({ type: TaskResponse })
  async getServiceById(@Param('id') id: string) {
    return await this.taskService.getById(id);
  }
  @Post('create-task')
  @ApiOkResponse({ type: TaskResponse })
  async create(@Body() dto: CreateTaskDto) {
    console.log(dto);
    return await this.taskService.create(dto);
  }
  @Post('update-task')
  @ApiOkResponse({ type: TaskResponse })
  async update(@Body() dto: UpdateTaskDto) {
    return await this.taskService.update(dto);
  }
  @Get('delete-task/:id')
  async delete(@Param('id') id: string) {
    return await this.taskService.delete(id);
  }
  @Post('add-task-assignment')
  @ApiOkResponse({ type: TaskResponse })
  async addTaskAssignment(@Body() dto: CreateTaskAssignmentDto) {
    return await this.taskService.addTaskAssignment(dto);
  }
  @Post('update-task-assignment')
  @ApiOkResponse({ type: TaskResponse })
  async updateTaskAssignment(@Body() dto: UpdateTaskAssignmentDto) {
    return await this.taskService.updateTaskAssignment(dto);
  }
  @Delete('delete-task-assignment')
  async deleteTaskAssignment(@Body() dto: DeleteTaskAssignmentDto) {
    return await this.taskService.removeTaskAssignment(dto);
  }
}
