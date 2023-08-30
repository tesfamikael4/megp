import { CreateTodoDto, UpdateTodoDto } from './dto/todo.dto';
import { TodoService } from './todo.service';
import { CollectionQuery } from '@collection-query';
import { CreateTodoItemDto, UpdateTodoItemDto } from './dto/todo-item.dto';
import { CreateTodoItemNewDto, UpdateTodoItemNewDto } from './dto/todo-item-new.dto';
export declare class TodoController {
    private readonly todoService;
    constructor(todoService: TodoService);
    create(createTodoDto: CreateTodoDto): Promise<import("./dto/todo.dto").TodoResponseDto>;
    findOne(id: string): Promise<import("./dto/todo.dto").TodoResponseDto>;
    findAll(query: CollectionQuery): Promise<import("@api-data").DataResponseFormat<import("./dto/todo.dto").TodoResponseDto>>;
    update(id: string, updateTodoDto: UpdateTodoDto): Promise<import("./dto/todo.dto").TodoResponseDto>;
    remove(id: string): Promise<void>;
    addTodoItem(createTodoItemDto: CreateTodoItemDto): Promise<import("./dto/todo-item.dto").TodoItemResponseDto>;
    editTodoItem(id: string, createTodoItemDto: UpdateTodoItemDto): Promise<import("./dto/todo-item.dto").TodoItemResponseDto>;
    removeTodoItem(id: string): Promise<void>;
    addTodoItemNew(createTodoItemNewDto: CreateTodoItemNewDto): Promise<import("./dto/todo-item-new.dto").TodoItemNewResponseDto>;
    editTodoItemNew(id: string, createTodoItemNewDto: UpdateTodoItemNewDto): Promise<import("./dto/todo-item-new.dto").TodoItemNewResponseDto>;
    removeTodoItemNew(id: string): Promise<void>;
}
