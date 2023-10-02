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
import { GenericCrudService } from 'src/shared/service/generic-crud.service';

@Injectable()
export class ApplicationService extends GenericCrudService<Application> {
  constructor(
    @InjectRepository(Application)
    private readonly repositoryApplication: Repository<Application>,
  ) {
    super(repositoryApplication);
  }
}
