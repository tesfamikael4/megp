import { TodoItem } from '../entities/todo-item.entity';
export declare class CreateTodoItemDto {
    todoId: string;
    name: string;
    static fromDto(todoItemDto: CreateTodoItemDto): TodoItem;
    static fromDtos(todoItemDto: CreateTodoItemDto[]): TodoItem[];
}
export declare class UpdateTodoItemDto extends CreateTodoItemDto {
    id: string;
    static fromDto(todoItemDto: UpdateTodoItemDto): TodoItem;
}
export declare class TodoItemResponseDto extends UpdateTodoItemDto {
    static toDto(todoItem: TodoItem): TodoItemResponseDto;
    static toDtos(todoItems: TodoItem[]): TodoItemResponseDto[];
}
