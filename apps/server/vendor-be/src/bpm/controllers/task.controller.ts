import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
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
import { TaskResponse, UpdateTaskDto } from '../dtos/task.dto';
import { CreateTaskDto } from '../dtos/task.dto';
import { TaskEntity } from '../entities/task.entity';
import { EntityCrudController } from 'src/shared/controller';
@Controller('tasks')
@ApiTags('tasks')
@ApiExtraModels(DataResponseFormat)
export class TaskController extends EntityCrudController<TaskEntity> {
  constructor(private readonly taskService: TaskService) {
    super(taskService);
  }

  @Post()
  @ApiOkResponse({ type: TaskResponse })
  async create(@Body() dto: CreateTaskDto) {
    console.log(dto);
    return await super.create(dto);
  }
  @Put(':id')
  @ApiOkResponse({ type: TaskResponse })
  async update(@Param('id', new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: string, @Body() dto: UpdateTaskDto) {
    return await super.update(id, dto);
  }

}
