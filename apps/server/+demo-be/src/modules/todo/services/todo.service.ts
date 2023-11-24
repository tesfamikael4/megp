import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Todo } from 'src/entities/todo.entity';

import { EntityCrudService } from 'src/shared/service';

@Injectable()
export class TodoService extends EntityCrudService<Todo> {
  constructor(
    @InjectRepository(Todo)
    private readonly todoRepository: Repository<Todo>,
  ) {
    super(todoRepository);
  }
}
