import {
  Body,
  Controller,
  HttpStatus,
  Param,
  ParseUUIDPipe,
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
import { EntityCrudController } from 'src/shared/controller';
import { TaskAssignmentService } from '../services/task-assignment.service';
import {
  CreateTaskAssignmentDto,
  TaskAssignmentResponse,
  UpdateTaskAssignmentDto,
} from '../dto/task-assignmment.dto';
import { TaskAssignmentEntity } from 'src/entities/task-assignment.entity';
import { EntityCrudOptions } from 'src/shared/types/crud-option.type';
import { JwtGuard } from 'src/shared/authorization';
const options: EntityCrudOptions = {
  createDto: CreateTaskAssignmentDto,
  updateDto: UpdateTaskAssignmentDto,
};
@ApiBearerAuth()
@Controller('task-assignment')
@ApiTags('task assignment')
@ApiExtraModels(DataResponseFormat)
export class TaskAssignmentController extends EntityCrudController<TaskAssignmentEntity>(
  options,
) {
  constructor(private readonly assignmentService: TaskAssignmentService) {
    super(assignmentService);
  }
  @UseGuards(JwtGuard)
  @Post()
  @ApiOkResponse({ type: TaskAssignmentResponse })
  async create(@Body() dto: CreateTaskAssignmentDto) {
    return await super.create(dto);
  }
  @UseGuards(JwtGuard)
  @Put('/:id')
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
