import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { EntityCrudService } from 'megp-shared-be';
import { WorkflowItem } from 'src/entities';

@Injectable()
export class WorkflowItemService extends EntityCrudService<WorkflowItem> {
  constructor(
    @InjectRepository(WorkflowItem)
    private readonly repositoryWorkflowItems: Repository<WorkflowItem>,
  ) {
    super(repositoryWorkflowItems);
  }
}
