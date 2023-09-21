import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DataResponseFormat } from 'src/shared/api-data';
import { CollectionQuery, QueryConstructor } from 'src/shared/collection-query';
import { TaskEntity } from './entities/task.entity';
import { TaskResponse } from './task.response';
import { CreateTaskDto, UpdateTaskDto } from './dtos/task.dto';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
  ) {}
  async getTasks(
    query: CollectionQuery,
  ): Promise<DataResponseFormat<TaskResponse>> {
    const dataQuery = QueryConstructor.constructQuery<TaskEntity>(
      this.taskRepository,
      query,
    );
    const response = new DataResponseFormat<TaskResponse>();
    if (query.count) {
      response.total = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      response.total = total;
      response.items = result.map((entity) => TaskResponse.toResponse(entity));
    }
    return response;
  }
  async getById(id: string): Promise<TaskResponse> {
    const task = await this.taskRepository.findOne({ where: { id: id } });
    if (!task) throw new NotFoundException('Task not found');
    return TaskResponse.toResponse(task);
  }
  async create(dto: CreateTaskDto): Promise<TaskResponse> {
    const taskEntity = CreateTaskDto.fromDto(dto);
    console.log(taskEntity, dto);
    const newService = await this.taskRepository.save(taskEntity);
    return TaskResponse.toResponse(newService);
  }
  async update(dto: UpdateTaskDto): Promise<TaskResponse> {
    const task = await this.taskRepository.findOne({ where: { id: dto.id } });
    if (!task) throw new NotFoundException('Task not found');
    task.name = dto.name;
    task.description = dto.description;
    task.businessProcessId = dto.businessProcessId;
    task.handlerType = dto.handlerType;
    task.type = dto.type;
    const result = await this.taskRepository.save(task);
    return TaskResponse.toResponse(result);
  }
  async delete(id: string): Promise<any> {
    const task = await this.taskRepository.findOne({ where: { id: id } });
    if (!task) throw new NotFoundException('Task not found');
    return await this.taskRepository.delete(id);
  }
}
