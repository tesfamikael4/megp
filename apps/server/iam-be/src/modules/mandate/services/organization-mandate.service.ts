import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { OrganizationMandate } from '../entities/organization-mandate.entity';
import { RelationCrudService } from 'src/shared/service/relation-crud.service';

@Injectable()
export class OrganizationMandateService extends RelationCrudService<OrganizationMandate> {
  constructor(
    @InjectRepository(OrganizationMandate)
    private readonly repositoryOrganizationMandate: Repository<OrganizationMandate>,
  ) {
    super(repositoryOrganizationMandate);
  }
}
