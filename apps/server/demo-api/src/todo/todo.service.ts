import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository,  } from 'typeorm';
import { Todo } from './entities/todo.entity';
import { CollectionQuery, FilterOperators, QueryConstructor } from '@collection-query';
import { CreateTodoDto, UpdateTodoDto, TodoResponseDto } from './dto/todo.dto';
import { DataResponseFormat } from '@api-data';
import { TodoItem } from './entities/todo-item.entity';
import { CreateTodoItemDto, UpdateTodoItemDto, TodoItemResponseDto  } from './dto/todo-item.dto';



@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private readonly repository: Repository<Todo>,
         
    @InjectRepository(TodoItem)
    private readonly todoItemRepository: Repository<TodoItem>,
  ) {}

  async create(todo: CreateTodoDto): Promise<TodoResponseDto> {
    try{
      const todoEntity = CreateTodoDto.fromDto(todo);
      await this.repository.save(todoEntity);
      return  TodoResponseDto.toDto(todoEntity as TodoResponseDto);   
    }catch (error) {
        throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async update(id:string, todo: UpdateTodoDto): Promise<TodoResponseDto> {
    try{
      todo.id = id;
      const todoEntity = UpdateTodoDto.fromDto(todo);
      await this.repository.update( {id: todo.id}, todoEntity);
      return  TodoResponseDto.toDto(todoEntity as TodoResponseDto);  
    } catch (error) {
        throw new HttpException(error, HttpStatus.BAD_REQUEST);
    } 
  }

  async findAll(query: CollectionQuery) {

    try {

        const dataQuery = QueryConstructor.constructQuery<Todo>(
          this.repository,
          query
        );
        const response = new DataResponseFormat<Todo>();
        if (query.count) {
          response.total = await dataQuery.getCount();
        } else {
          const [result, total] = await dataQuery.getManyAndCount();
          response.total = total;
          response.items = TodoResponseDto.toDtos(result);
        }
        return response;
      } catch (error) {
        throw new HttpException(error, HttpStatus.BAD_REQUEST);
    } 
  }

  async findOne(id: string): Promise<TodoResponseDto> {
    try{
      const todoEntity = await this.repository.findOne({ where: { id }, relations: ['todoItems']});
      return TodoResponseDto.toDto(todoEntity);
    }catch (error) {
        throw new HttpException(error, HttpStatus.BAD_REQUEST);
    } 
  }

  async remove(id: string): Promise<void> {
   try{
       await this.repository.delete({ id: id });
    }catch (error) {
        throw new HttpException(error, HttpStatus.BAD_REQUEST);
    } 
  }

    async addTodoItem(todoItem: CreateTodoItemDto): Promise<TodoItemResponseDto> {
      try{
        const todoItemEntity = CreateTodoDto.fromDto(todoItem);
        await this.todoItemRepository.save(todoItemEntity);
        return  TodoResponseDto.toDto(todoItemEntity as TodoResponseDto);   
      }catch (error) {
          throw new HttpException(error, HttpStatus.BAD_REQUEST);
      }
    }

    async updateTodoItem(id:string, todoItem: UpdateTodoItemDto): Promise<TodoItemResponseDto> {
      try{
        todoItem.id = id;
        const todoItemEntity = UpdateTodoItemDto.fromDto(todoItem);
        await this.todoItemRepository.update( {id: todoItem.id}, todoItemEntity);
        return  TodoResponseDto.toDto(todoItemEntity as TodoResponseDto);
      } catch (error) {
          throw new HttpException(error, HttpStatus.BAD_REQUEST);
      } 
    }

    async removeTodoItem(id: string): Promise<void> {
    try{
        await this.todoItemRepository.delete({ id: id });
      }catch (error) {
          throw new HttpException(error, HttpStatus.BAD_REQUEST);
      } 
    }

}