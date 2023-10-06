import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Approval } from '../entities/approval.entity';
import {
  CollectionQuery,
  Filter,
  FilterOperators,
} from 'src/shared/collection-query';
import { EntityCrudService } from 'src/shared/service/entity-crud.service';

@Injectable()
export class ApprovalService extends EntityCrudService<Approval> {
  constructor(
    @InjectRepository(Approval)
    private readonly approvalRepository: Repository<Approval>,
  ) {
    super(approvalRepository);
  }

  async findByType(type: string, query: CollectionQuery) {
    const typeFilter: Filter[] = [
      { field: 'type', value: type, operator: FilterOperators.EqualTo },
    ];
    query.filter.push(typeFilter);
    return await super.findAll(query);
  }
}
