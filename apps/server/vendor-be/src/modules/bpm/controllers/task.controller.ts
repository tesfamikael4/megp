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
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { DataResponseFormat } from 'src/shared/api-data';
import { TaskService } from '../services/task.service';
import { TaskResponse, UpdateTaskDto } from '../dto/task.dto';
import { CreateTaskDto } from '../dto/task.dto';
import { EntityCrudController } from 'src/shared/controller';
import { TaskEntity } from 'src/entities/task.entity';
import { EntityCrudOptions } from 'src/shared/types/crud-option.type';
import { JwtGuard } from 'src/shared/authorization';
const options: EntityCrudOptions = {
  createDto: CreateTaskDto,
  updateDto: UpdateTaskDto,
};
@ApiBearerAuth()
@Controller('tasks')
@ApiTags('tasks')
@ApiExtraModels(DataResponseFormat)
export class TaskController extends EntityCrudController<TaskEntity>(options) {
  constructor(private readonly taskService: TaskService) {
    super(taskService);
  }
  @UseGuards(JwtGuard)
  @Post()
  @ApiOkResponse({ type: TaskResponse })
  async create(@Body() dto: CreateTaskDto) {
    return await super.create(dto);
  }
  @UseGuards(JwtGuard)
  @Put('/:id')
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
