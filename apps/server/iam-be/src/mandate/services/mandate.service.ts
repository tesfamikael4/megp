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
import { GenericCrudService } from 'src/shared/service/generic-crud.service';

@Injectable()
export class MandateService extends GenericCrudService<Mandate> {
  constructor(
    @InjectRepository(Mandate)
    private readonly repositoryMandate: Repository<Mandate>,
  ) {
    super(repositoryMandate);
  }
}
