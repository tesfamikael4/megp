import { Todo } from '../entities/todo.entity';
export declare class CreateTodoDto {
  name: string;
  description: string;
  static fromDto(todoDto: CreateTodoDto): Todo;
  static fromDtos(todoDto: CreateTodoDto[]): Todo[];
}
export declare class UpdateTodoDto extends CreateTodoDto {
  id: string;
  static fromDto(todoDto: UpdateTodoDto): Todo;
}
export declare class TodoResponseDto extends UpdateTodoDto {
  static toDto(todo: Todo): TodoResponseDto;
  static toDtos(todoes: Todo[]): TodoResponseDto[];
}
