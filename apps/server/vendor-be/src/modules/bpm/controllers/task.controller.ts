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
} from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { DataResponseFormat } from 'src/shared/api-data';
import { TaskService } from '../services/task.service';
import { TaskResponse, UpdateTaskDto } from '../dto/task.dto';
import { CreateTaskDto } from '../dto/task.dto';
import { EntityCrudController } from 'src/shared/controller';
import { TaskEntity } from 'src/entities/task.entity';
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
    return await super.create(dto);
  }
  @Put(':id')
  @ApiOkResponse({ type: TaskResponse })
  async update(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: string,
    @Body() dto: UpdateTaskDto,
  ) {
    return await super.update(id, dto);
  }
}
