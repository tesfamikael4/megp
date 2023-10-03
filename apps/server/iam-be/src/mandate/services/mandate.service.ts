import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Mandate } from '../entities/mandate.entity';
import {
  CollectionQuery,
  FilterOperators,
  QueryConstructor,
} from '@collection-query';
import { DataResponseFormat } from '@api-data';
import { EntityCrudService } from 'src/shared/service/entity-crud.service';

@Injectable()
export class MandateService extends EntityCrudService<Mandate> {
  constructor(
    @InjectRepository(Mandate)
    private readonly repositoryMandate: Repository<Mandate>,
  ) {
    super(repositoryMandate);
  }
}
