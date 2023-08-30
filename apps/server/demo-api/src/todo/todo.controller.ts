import { Body, Controller, Delete, Get, Post, Put, Query, Param, Patch, ParseUUIDPipe, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ApiPaginatedResponse } from '@api-data';
import { CreateTodoDto, UpdateTodoDto } from './dto/todo.dto';
import { TodoService } from './todo.service';
import { Todo } from './entities/todo.entity';
import { CollectionQuery, } from '@collection-query';
import { CreateTodoItemDto, UpdateTodoItemDto } from './dto/todo-item.dto';
   import { CreateTodoItemNewDto, UpdateTodoItemNewDto } from './dto/todo-item-new.dto';
    

@ApiBearerAuth()
@Controller('todoes')
@ApiTags('todoes')
export class TodoController {

constructor(private readonly todoService: TodoService) {}
  
  @Post()
  async create(@Body() createTodoDto: CreateTodoDto) {
    return await this.todoService.create( createTodoDto);
  }

  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: string) {
    return await this.todoService.findOne(id);
  }

  @Get()
  @ApiPaginatedResponse(Todo)
  @ApiOkResponse({ type: Todo, isArray: false })
  async findAll(@Query() query: CollectionQuery) {
    return await this.todoService.findAll(query);
  }


  @Patch(':id')
  async update(@Param('id', new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: string, @Body() updateTodoDto: UpdateTodoDto) {
    return await this.todoService.update(id, updateTodoDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.todoService.remove(id);
  }
   
  @Post('add-todo-item')
  async addTodoItem(@Body() createTodoItemDto: CreateTodoItemDto) {
    return await this.todoService.addTodoItem( createTodoItemDto);
  }

  @Patch('update-todo-item/:id')
  async editTodoItem(@Param('id', new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: string, @Body() createTodoItemDto: UpdateTodoItemDto) {
    return await this.todoService.updateTodoItem(id, createTodoItemDto);
  }

  @Delete('remove-todo-item/:id')
  async removeTodoItem(@Param('id', new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: string) {
    return await this.todoService.removeTodoItem(id);
  }
   
  @Post('add-todo-item-new')
  async addTodoItemNew(@Body() createTodoItemNewDto: CreateTodoItemNewDto) {
    return await this.todoService.addTodoItemNew( createTodoItemNewDto);
  }

  @Patch('update-todo-item-new/:id')
  async editTodoItemNew(@Param('id', new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: string, @Body() createTodoItemNewDto: UpdateTodoItemNewDto) {
    return await this.todoService.updateTodoItemNew(id, createTodoItemNewDto);
  }

  @Delete('remove-todo-item-new/:id')
  async removeTodoItemNew(@Param('id', new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: string) {
    return await this.todoService.removeTodoItemNew(id);
  }
  

}