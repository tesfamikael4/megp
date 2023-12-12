import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Workflow } from 'src/entities';
import { EntityCrudService } from 'src/shared/service';

@Injectable()
export class WorkflowService extends EntityCrudService<Workflow> {
  constructor(
    @InjectRepository(Workflow)
    private readonly repositoryWorkflow: Repository<Workflow>,
  ) {
    super(repositoryWorkflow);
  }
}
