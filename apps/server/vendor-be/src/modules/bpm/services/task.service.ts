import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EntityCrudService } from 'src/shared/service';
import { TaskEntity } from 'src/entities/task.entity';

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
  async getTasksByBP(bpId: string): Promise<TaskEntity[]> {
    return await this.taskRepository.find({
      where: { bpId: bpId },
      order: { orderBy: 'ASC' },
    });
  }
}
