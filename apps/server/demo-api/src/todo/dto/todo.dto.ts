import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsString, IsDateString } from 'class-validator';
import { Todo } from '../entities/todo.entity';
import { CreateTodoItemDto, UpdateTodoItemDto } from './todo-item.dto';


export class CreateTodoDto {

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;
  
  static fromDto(todoDto: CreateTodoDto): Todo {
    const todo: Todo = new Todo();

    todo.name = todoDto.name;

    todo.description = todoDto.description;
    return todo;
  }
}


export class UpdateTodoDto extends CreateTodoDto {
  @ApiProperty()
  @IsString()
  id: string;

  static fromDto(todoDto: UpdateTodoDto): Todo {
    const todo: Todo = new Todo();

    todo.id = todoDto.id;

    todo.name = todoDto.name;

    todo.description = todoDto.description;
    return todo;
  }
}

export class TodoResponseDto extends UpdateTodoDto {

  static toDto(todo: Todo): TodoResponseDto {
    const todoDto: TodoResponseDto = new TodoResponseDto();

    todoDto.id = todo.id;

    todoDto.name = todo.name;

    todoDto.description = todo.description;
    return todoDto;
  }

  static toDtos(todoes: Todo[]) {
    return todoes.map(todo => TodoResponseDto.toDto(todo));
  }
}