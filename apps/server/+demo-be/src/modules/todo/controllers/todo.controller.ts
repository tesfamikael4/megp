import { Body, Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateTodoDto, UpdateTodoDto } from '../dto/todo.dto';
import { TodoService } from '../services/todo.service';
import { Todo } from '../../../entities/todo.entity';
import { EntityCrudController } from 'src/shared/controller';
import { EntityCrudOptions } from 'src/shared/types/crud-option.type';
import { ApiKeyGuard } from 'src/shared/authorization';

const options: EntityCrudOptions = {
  createDto: CreateTodoDto,
  updateDto: UpdateTodoDto,
};

@ApiBearerAuth()
@Controller('todoes')
@ApiTags('todoes')
export class TodoController extends EntityCrudController<Todo>(options) {
  constructor(private readonly todoService: TodoService) {
    super(todoService);
  }

  @Get('test-api')
  @UseGuards(ApiKeyGuard)
  async testApi() {
    return {
      success: true,
      message: 'Api key Auth works',
    };
  }
}
