import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Application } from '../entities/application.entity';
import {
  CollectionQuery,
  FilterOperators,
  QueryConstructor,
} from '@collection-query';
import { DataResponseFormat } from '@api-data';
import { EntityCrudService } from 'src/shared/service/entity-crud.service';

@Injectable()
export class ApplicationService extends EntityCrudService<Application> {
  constructor(
    @InjectRepository(Application)
    private readonly repositoryApplication: Repository<Application>,
  ) {
    super(repositoryApplication);
  }
}
