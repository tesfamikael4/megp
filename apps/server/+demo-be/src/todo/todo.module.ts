import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoController } from './todo.controller';
import { Todo } from './entities/todo.entity';
import { TodoService } from './todo.service';
import { TodoItem } from './entities/todo-item.entity';
import { TodoItemNew } from './entities/todo-item-new.entity';
import { SampleController } from './sample.controller';
import { JwtModule } from '@nestjs/jwt';
import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';

@Module({
  imports: [TypeOrmModule.forFeature([Todo, TodoItem, TodoItemNew]), JwtModule],
  providers: [TodoService, ItemsService],
  controllers: [TodoController, SampleController, ItemsController],
})
export class TodoModule {}
