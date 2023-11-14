import {
  Body,
  Controller,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { DataResponseFormat } from 'src/shared/api-data';
import { EntityCrudController } from 'src/shared/controller';
import { TaskAssignmentService } from '../services/task-assignment.service';
import {
  CreateTaskAssignmentDto,
  TaskAssignmentResponse,
  UpdateTaskAssignmentDto,
} from '../dto/task-assignmment.dto';
import { TaskAssignmentEntity } from 'src/entities/task-assignment.entity';
@Controller('task-assignment')
@ApiTags('task assignment')
@ApiExtraModels(DataResponseFormat)
export class TaskAssignmentController extends EntityCrudController<TaskAssignmentEntity> {
  constructor(private readonly assignmentService: TaskAssignmentService) {
    super(assignmentService);
  }
  @Post()
  @ApiOkResponse({ type: TaskAssignmentResponse })
  async create(@Body() dto: CreateTaskAssignmentDto) {
    return await super.create(dto);
  }
  @Put(':id')
  @ApiOkResponse({ type: TaskAssignmentResponse })
  async update(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: string,
    @Body() dto: UpdateTaskAssignmentDto,
  ) {
    return await super.update(id, dto);
  }
}
