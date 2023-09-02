import { Repository } from 'typeorm';
import { Todo } from './entities/todo.entity';
import { CollectionQuery } from '@collection-query';
import { CreateTodoDto, UpdateTodoDto, TodoResponseDto } from './dto/todo.dto';
import { DataResponseFormat } from '@api-data';
import { TodoItem } from './entities/todo-item.entity';
import {
  CreateTodoItemDto,
  UpdateTodoItemDto,
  TodoItemResponseDto,
} from './dto/todo-item.dto';
import { TodoItemNew } from './entities/todo-item-new.entity';
import {
  CreateTodoItemNewDto,
  UpdateTodoItemNewDto,
  TodoItemNewResponseDto,
} from './dto/todo-item-new.dto';
export declare class TodoService {
  private readonly repository;
  private readonly todoItemRepository;
  private readonly todoItemNewRepository;
  constructor(
    repository: Repository<Todo>,
    todoItemRepository: Repository<TodoItem>,
    todoItemNewRepository: Repository<TodoItemNew>,
  );
  create(todo: CreateTodoDto): Promise<TodoResponseDto>;
  update(id: string, todo: UpdateTodoDto): Promise<TodoResponseDto>;
  findAll(query: CollectionQuery): Promise<DataResponseFormat<TodoResponseDto>>;
  findOne(id: string): Promise<TodoResponseDto>;
  remove(id: string): Promise<void>;
  addTodoItem(todoItem: CreateTodoItemDto): Promise<TodoItemResponseDto>;
  updateTodoItem(
    id: string,
    todoItem: UpdateTodoItemDto,
  ): Promise<TodoItemResponseDto>;
  removeTodoItem(id: string): Promise<void>;
  addTodoItemNew(
    todoItemNew: CreateTodoItemNewDto,
  ): Promise<TodoItemNewResponseDto>;
  updateTodoItemNew(
    id: string,
    todoItemNew: UpdateTodoItemNewDto,
  ): Promise<TodoItemNewResponseDto>;
  removeTodoItemNew(id: string): Promise<void>;
}
