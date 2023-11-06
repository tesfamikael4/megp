import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskAssignmentEntity } from 'src/bpm/entities/task-assignment';
import { EntityCrudService } from 'src/shared/service';
import { Repository } from 'typeorm';

@Injectable()
export class TaskAssignmentService extends EntityCrudService<TaskAssignmentEntity> {
  constructor(
    @InjectRepository(TaskAssignmentEntity)
    private readonly assignmentRepository: Repository<TaskAssignmentEntity>,
  ) {
    super(assignmentRepository);
  }
}
