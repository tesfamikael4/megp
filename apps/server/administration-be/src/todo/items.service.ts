import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityCrudService } from 'src/shared/service/generic-crud.service';
import { Todo } from './entities/todo.entity';
import { CreateTodoDto } from './dto/todo.dto';

@Injectable()
export class ItemsService extends EntityCrudService<Todo> {
  constructor(
    @InjectRepository(Todo)
    private readonly itemRepository: Repository<Todo>,
  ) {
    super(itemRepository);
  }
}
