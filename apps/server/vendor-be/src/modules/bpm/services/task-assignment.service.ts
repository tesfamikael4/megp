import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskAssignmentEntity } from 'src/entities/task-assignment.entity';
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
  async saveBulk(assignments: any[]) {
    try {
      await this.assignmentRepository.save(assignments);
      return true;
    } catch (error) {
      throw new Error(error);
    }
  }
}
