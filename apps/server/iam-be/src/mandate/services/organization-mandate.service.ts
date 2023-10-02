import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { OrganizationMandate } from '../entities/organization-mandate.entity';
import {
  CollectionQuery,
  FilterOperators,
  QueryConstructor,
} from '@collection-query';
import { DataResponseFormat } from '@api-data';
import { EntityCrudService } from 'src/shared/service/entity-crud.service';

@Injectable()
export class OrganizationMandateService extends EntityCrudService<OrganizationMandate> {
  constructor(
    @InjectRepository(OrganizationMandate)
    private readonly repositoryOrganizationMandate: Repository<OrganizationMandate>,
  ) {
    super(repositoryOrganizationMandate);
  }
}
