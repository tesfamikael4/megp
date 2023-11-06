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
import { ApiExtraModels, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ApiPaginatedResponse, DataResponseFormat } from 'src/shared/api-data';
import { CollectionQuery } from 'src/shared/collection-query';
import { EntityCrudController } from 'src/shared/controller';
import { TaskAssignmentEntity } from '../entities/task-assignment';
import { TaskAssignmentService } from '../services/task-assignment.service';
import {
  CreateTaskAssignmentDto,
  TaskAssignmentResponse,
} from 'src/bpm/dtos/task-assignmment.dto';
@Controller('task-assignment')
@ApiTags('task assignment')
@ApiExtraModels(DataResponseFormat)
export class TaskAssignmentController extends EntityCrudController<TaskAssignmentEntity> {
  constructor(private readonly assignmentService: TaskAssignmentService) {
    super(assignmentService);
  }
  @Get()
  @ApiPaginatedResponse(TaskAssignmentResponse)
  async fetch(@Query() query: CollectionQuery) {
    return await super.findAll(query);
  }
  @Get(':id')
  @ApiOkResponse({ type: TaskAssignmentResponse })
  async getById(@Param('id') id: string) {
    return await super.findOne(id);
  }
  @Post()
  @ApiOkResponse({ type: TaskAssignmentResponse })
  async create(@Body() dto: CreateTaskAssignmentDto) {
    return await super.create(dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await super.remove(id);
  }
}
