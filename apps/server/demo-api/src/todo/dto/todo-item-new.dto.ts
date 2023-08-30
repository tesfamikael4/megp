import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsString, IsDateString, IsArray, IsObject, IsOptional } from 'class-validator';
import { TodoItemNew } from '../entities/todo-item-new.entity';
 

export class CreateTodoItemNewDto {
     
  @ApiProperty()
  @IsString()
  todoId: string;
    
  @ApiProperty()
  @IsString()
  name: string;
     
  static fromDto(todoItemNewDto: CreateTodoItemNewDto): TodoItemNew {
    const todoItemNew: TodoItemNew = new TodoItemNew();  
    if (!todoItemNewDto) {
      return;
    }
    todoItemNew.todoId = todoItemNewDto.todoId;
      
    todoItemNew.name = todoItemNewDto.name;
      
    return todoItemNew;
  }

  static fromDtos(todoItemNewDto: CreateTodoItemNewDto[]) {
    return todoItemNewDto?.map(todoItemNew => CreateTodoItemNewDto.fromDto(todoItemNew));
  }
}


export class UpdateTodoItemNewDto extends CreateTodoItemNewDto {
  @ApiProperty()
  @IsString()
  id: string;

  static fromDto(todoItemNewDto: UpdateTodoItemNewDto): TodoItemNew {
    const todoItemNew: TodoItemNew = new TodoItemNew();  
    if (!todoItemNewDto) {
      return;
    }
    todoItemNew.id = todoItemNewDto.id;
      
    todoItemNew.todoId = todoItemNewDto.todoId;
      
    todoItemNew.name = todoItemNewDto.name;
      
    return todoItemNew;
  }
}

export class TodoItemNewResponseDto extends UpdateTodoItemNewDto {

  static toDto(todoItemNew:TodoItemNew): TodoItemNewResponseDto {
    const todoItemNewDto: TodoItemNewResponseDto = new TodoItemNewResponseDto();  
 
    todoItemNewDto.id = todoItemNew.id; 
 
    todoItemNewDto.todoId = todoItemNew.todoId; 
 
    todoItemNewDto.name = todoItemNew.name; 
    
    return todoItemNewDto;
  }

  static toDtos(todoItemNews:TodoItemNew[]) {
    return todoItemNews?.map(todoItemNew => TodoItemNewResponseDto.toDto(todoItemNew));
  }
}