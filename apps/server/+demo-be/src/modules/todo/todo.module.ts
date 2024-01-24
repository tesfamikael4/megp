import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoController } from './controllers/todo.controller';
import { Todo } from '../../entities/todo.entity';
import { TodoService } from './services/todo.service';
import { JwtModule } from '@nestjs/jwt';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TenantInterceptor } from 'src/shared/interceptors/tenant-interceptor';
import { Item } from 'src/entities/item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Todo, Item]), JwtModule],
  providers: [
    TodoService,
    {
      provide: APP_INTERCEPTOR,
      useClass: TenantInterceptor,
    },
  ],
  controllers: [TodoController],
})
export class TodoModule {}
