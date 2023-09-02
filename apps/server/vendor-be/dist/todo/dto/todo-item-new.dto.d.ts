import { TodoItemNew } from '../entities/todo-item-new.entity';
export declare class CreateTodoItemNewDto {
    todoId: string;
    name: string;
    static fromDto(todoItemNewDto: CreateTodoItemNewDto): TodoItemNew;
    static fromDtos(todoItemNewDto: CreateTodoItemNewDto[]): TodoItemNew[];
}
export declare class UpdateTodoItemNewDto extends CreateTodoItemNewDto {
    id: string;
    static fromDto(todoItemNewDto: UpdateTodoItemNewDto): TodoItemNew;
}
export declare class TodoItemNewResponseDto extends UpdateTodoItemNewDto {
    static toDto(todoItemNew: TodoItemNew): TodoItemNewResponseDto;
    static toDtos(todoItemNews: TodoItemNew[]): TodoItemNewResponseDto[];
}
