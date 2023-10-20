import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DataResponseFormat } from 'src/shared/api-data';
import { CollectionQuery, QueryConstructor } from 'src/shared/collection-query';
import { TaskEntity } from '../entities/task.entity';
import { TaskResponse } from '../dtos/task.dto';
import { CreateTaskDto, UpdateTaskDto } from '../dtos/task.dto';
import { EntityCrudService } from 'src/shared/service';

@Injectable()
export class TaskService extends EntityCrudService<TaskEntity> {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
  ) {
    super(taskRepository);
  }
}
