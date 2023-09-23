import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DataResponseFormat } from 'src/shared/api-data';
import { CollectionQuery, QueryConstructor } from 'src/shared/collection-query';
import { WorkflowInstanceEntity } from './entities/workflow-instance';
import { WorkflowInstanceResponse } from './workflow-instance.response';
import {
  CreateWorkflowInstanceDto,
  UpdateWorkflowInstanceDto,
} from './dtos/workflow-instance.dto';
import {
  CreateTaskHandlerDto,
  DeleteTaskHandlerDto,
  UpdateTaskHandlerDto,
} from './dtos/task-handler.dto';
import {
  CreateTaskTrackerDto,
  DeleteTaskTrackerDto,
  UpdateTaskTrackerDto,
} from './dtos/task-tracker.dto';

@Injectable()
export class WorkflowInstanceService {
  constructor(
    @InjectRepository(WorkflowInstanceEntity)
    private readonly workflowInstanceRepository: Repository<WorkflowInstanceEntity>,
  ) {}
  async getWorkflowInstances(
    query: CollectionQuery,
  ): Promise<DataResponseFormat<WorkflowInstanceResponse>> {
    const dataQuery = QueryConstructor.constructQuery<WorkflowInstanceEntity>(
      this.workflowInstanceRepository,
      query,
    );
    const response = new DataResponseFormat<WorkflowInstanceResponse>();
    if (query.count) {
      response.total = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      response.total = total;
      response.items = result.map((entity) =>
        WorkflowInstanceResponse.toResponse(entity),
      );
    }
    return response;
  }
  async getById(id: string): Promise<WorkflowInstanceResponse> {
    const workflowInstance = await this.workflowInstanceRepository.findOne({
      where: { id: id },
    });
    if (!workflowInstance)
      throw new NotFoundException('WorkflowInstance not found');
    return WorkflowInstanceResponse.toResponse(workflowInstance);
  }
  async create(
    dto: CreateWorkflowInstanceDto,
  ): Promise<WorkflowInstanceResponse> {
    const workflowInstanceEntity = CreateWorkflowInstanceDto.fromDto(dto);
    console.log(workflowInstanceEntity, dto);
    const newService = await this.workflowInstanceRepository.save(
      workflowInstanceEntity,
    );
    return WorkflowInstanceResponse.toResponse(newService);
  }
  async update(
    dto: UpdateWorkflowInstanceDto,
  ): Promise<WorkflowInstanceResponse> {
    const workflowInstance = await this.workflowInstanceRepository.findOne({
      where: { id: dto.id },
    });
    if (!workflowInstance)
      throw new NotFoundException('WorkflowInstance not found');
    workflowInstance.applicationNumber = dto.applicationNumber;
    workflowInstance.requestorId = dto.requestorId;
    workflowInstance.bpId = dto.bpId;
    workflowInstance.status = dto.status;
    const result = await this.workflowInstanceRepository.save(workflowInstance);
    return WorkflowInstanceResponse.toResponse(result);
  }
  async delete(id: string): Promise<any> {
    const workflowInstance = await this.workflowInstanceRepository.findOne({
      where: { id: id },
    });
    if (!workflowInstance)
      throw new NotFoundException('WorkflowInstance not found');
    return await this.workflowInstanceRepository.delete(id);
  }
  async addTaskHandler(
    dto: CreateTaskHandlerDto,
  ): Promise<WorkflowInstanceResponse> {
    const workflowInstance = await this.workflowInstanceRepository.findOne({
      where: { id: dto.instanceId },
      relations: ['taskHandlers'],
    });
    if (!workflowInstance)
      throw new NotFoundException('WorkflowInstance not found');
    const handler = CreateTaskHandlerDto.fromDto(dto);
    workflowInstance.addHandler(handler);
    const result = await this.workflowInstanceRepository.save(workflowInstance);
    return WorkflowInstanceResponse.toResponse(result);
  }
  async updateTaskHandler(
    dto: UpdateTaskHandlerDto,
  ): Promise<WorkflowInstanceResponse> {
    const workflowInstance = await this.workflowInstanceRepository.findOne({
      where: { id: dto.instanceId },
      relations: ['taskHandlers'],
    });
    if (!workflowInstance)
      throw new NotFoundException('WorkflowInstance not found');
    const handler = UpdateTaskHandlerDto.fromDto(dto);
    workflowInstance.updateHandler(handler);
    const result = await this.workflowInstanceRepository.save(workflowInstance);
    return WorkflowInstanceResponse.toResponse(result);
  }
  async removeTaskHandler(
    dto: DeleteTaskHandlerDto,
  ): Promise<WorkflowInstanceResponse> {
    const workflowInstance = await this.workflowInstanceRepository.findOne({
      where: { id: dto.instanceId },
      relations: ['taskHandlers'],
    });
    if (!workflowInstance)
      throw new NotFoundException('WorkflowInstance not found');
    const handler = workflowInstance.taskHandlers.find((a) => a.id === dto.id);
    workflowInstance.removeHandler(handler);
    const result = await this.workflowInstanceRepository.save(workflowInstance);
    return WorkflowInstanceResponse.toResponse(result);
  }
  async addTaskTracker(
    dto: CreateTaskTrackerDto,
  ): Promise<WorkflowInstanceResponse> {
    const workflowInstance = await this.workflowInstanceRepository.findOne({
      where: { id: dto.instanceId },
      relations: ['taskTrackers'],
    });
    if (!workflowInstance)
      throw new NotFoundException('WorkflowInstance not found');
    const tracker = CreateTaskTrackerDto.fromDto(dto);
    workflowInstance.addTracker(tracker);
    const result = await this.workflowInstanceRepository.save(workflowInstance);
    return WorkflowInstanceResponse.toResponse(result);
  }
  async updateTaskTracker(
    dto: UpdateTaskTrackerDto,
  ): Promise<WorkflowInstanceResponse> {
    const workflowInstance = await this.workflowInstanceRepository.findOne({
      where: { id: dto.instanceId },
      relations: ['taskTrackers'],
    });
    if (!workflowInstance)
      throw new NotFoundException('WorkflowInstance not found');
    const tracker = UpdateTaskTrackerDto.fromDto(dto);
    workflowInstance.updateTracker(tracker);
    const result = await this.workflowInstanceRepository.save(workflowInstance);
    return WorkflowInstanceResponse.toResponse(result);
  }
  async removeTaskTracker(
    dto: DeleteTaskTrackerDto,
  ): Promise<WorkflowInstanceResponse> {
    const workflowInstance = await this.workflowInstanceRepository.findOne({
      where: { id: dto.instanceId },
      relations: ['taskTrackers'],
    });
    if (!workflowInstance)
      throw new NotFoundException('WorkflowInstance not found');
    const tracker = workflowInstance.taskTrackers.find((a) => a.id === dto.id);
    workflowInstance.removeTracker(tracker);
    const result = await this.workflowInstanceRepository.save(workflowInstance);
    return WorkflowInstanceResponse.toResponse(result);
  }
}
