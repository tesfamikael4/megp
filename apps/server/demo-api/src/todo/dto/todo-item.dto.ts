import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsDateString,
  IsArray,
  IsObject,
  IsOptional,
} from 'class-validator';
import { TodoItem } from '../entities/todo-item.entity';

export class CreateTodoItemDto {
  @ApiProperty()
  @IsString()
  todoId: string;

  @ApiProperty()
  @IsString()
  name: string;

  static fromDto(todoItemDto: CreateTodoItemDto): TodoItem {
    const todoItem: TodoItem = new TodoItem();
    if (!todoItemDto) {
      return;
    }
    todoItem.todoId = todoItemDto.todoId;

    todoItem.name = todoItemDto.name;

    return todoItem;
  }

  static fromDtos(todoItemDto: CreateTodoItemDto[]) {
    return todoItemDto?.map((todoItem) => CreateTodoItemDto.fromDto(todoItem));
  }
}

export class UpdateTodoItemDto extends CreateTodoItemDto {
  @ApiProperty()
  @IsString()
  id: string;

  static fromDto(todoItemDto: UpdateTodoItemDto): TodoItem {
    const todoItem: TodoItem = new TodoItem();
    if (!todoItemDto) {
      return;
    }
    todoItem.id = todoItemDto.id;

    todoItem.todoId = todoItemDto.todoId;

    todoItem.name = todoItemDto.name;

    return todoItem;
  }
}

export class TodoItemResponseDto extends UpdateTodoItemDto {
  static toDto(todoItem: TodoItem): TodoItemResponseDto {
    const todoItemDto: TodoItemResponseDto = new TodoItemResponseDto();

    todoItemDto.id = todoItem.id;

    todoItemDto.todoId = todoItem.todoId;

    todoItemDto.name = todoItem.name;

    return todoItemDto;
  }

  static toDtos(todoItems: TodoItem[]) {
    return todoItems?.map((todoItem) => TodoItemResponseDto.toDto(todoItem));
  }
}
