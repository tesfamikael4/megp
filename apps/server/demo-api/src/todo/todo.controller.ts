import { Body, Controller, Delete, Get, Post, Put, Query, Param, Patch, ParseUUIDPipe, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ApiPaginatedResponse } from '@api-data';
import { CreateTodoDto, UpdateTodoDto } from './dto/todo.dto';
import { TodoService } from './todo.service';
import { Todo } from './entities/todo.entity';
import { CollectionQuery, } from '@collection-query';
import { CreateTodoItemDto, UpdateTodoItemDto } from './dto/todo-item.dto';

@Controller('todoes')
@ApiTags('todoes')
export class TodoController {

  constructor(private readonly todoService: TodoService) { }

  @Post()
  async create(@Body() createTodoDto: CreateTodoDto) {
    return await this.todoService.create(createTodoDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.todoService.findOne(id);
  }

  @Get()
  @ApiPaginatedResponse(Todo)
  @ApiOkResponse({ type: Todo, isArray: false })
  async findAll(@Query() query: CollectionQuery) {
    return await this.todoService.findAll(query);
  }


  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateTodoDto: UpdateTodoDto) {
    return await this.todoService.update(id, updateTodoDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.todoService.remove(id);
  }

  @Post('add-todo-item')
  async addTodoItem(@Body() createTodoItemDto: CreateTodoItemDto) {
    return await this.todoService.addTodoItem(createTodoItemDto);
  }

  @Patch('update-todo-item/:id')
  async editTodoItem(@Param('id') id: string, @Body() createTodoItemDto: UpdateTodoItemDto) {
    return await this.todoService.updateTodoItem(id, createTodoItemDto);
  }

  @Delete('remove-todo-item/:id')
  async removeTodoItem(@Param('id') id: string) {
    return await this.todoService.removeTodoItem(id);
  }
}