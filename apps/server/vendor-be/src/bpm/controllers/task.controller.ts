import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
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
import { TaskService } from '../services/task.service';
import { TaskResponse } from '../dtos/task.dto';
import { CreateTaskDto, UpdateTaskDto } from '../dtos/task.dto';
import { TaskEntity } from '../entities/task.entity';
import { EntityCrudController } from 'src/shared/controller';
@Controller('tasks')
@ApiTags('tasks')
@ApiExtraModels(DataResponseFormat)
export class TaskController extends EntityCrudController<TaskEntity> {
  constructor(private readonly taskService: TaskService) {
    super(taskService);
  }
  @Get()
  @ApiPaginatedResponse(TaskResponse)
  async fetch(@Query() query: CollectionQuery) {
    return await super.findAll(query);
  }
  @Get(':id')
  @ApiOkResponse({ type: TaskResponse })
  async getServiceById(@Param('id') id: string) {
    return await super.findOne(id);
  }
  @Post()
  @ApiOkResponse({ type: TaskResponse })
  async create(@Body() dto: CreateTaskDto) {
    console.log(dto);
    return await super.create(dto);
  }

  @Get(':id')
  async delete(@Param('id') id: string) {
    return await super.remove(id);
  }
}
