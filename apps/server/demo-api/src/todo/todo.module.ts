import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { TodoController } from "./todo.controller";
import { Todo } from "./entities/todo.entity";
import { TodoService } from "./todo.service";
import { TodoItem } from './entities/todo-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Todo, TodoItem])],
  providers: [TodoService],
  controllers: [TodoController],
})
export class TodoModule {}