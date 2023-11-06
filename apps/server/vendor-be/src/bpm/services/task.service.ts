import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskEntity } from '../entities/task.entity';
import { EntityCrudService } from 'src/shared/service';

@Injectable()
export class TaskService extends EntityCrudService<TaskEntity> {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
  ) {
    super(taskRepository);
  }
  async getTaskByNameAndBP(bpId: string, name: string) {
    return await this.taskRepository.findOne({
      where: { bpId: bpId, name: name },
    });
  }
}
