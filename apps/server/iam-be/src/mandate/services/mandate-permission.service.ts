import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { MandatePermission } from '../entities/mandate-permission.entity';
import {
  CollectionQuery,
  FilterOperators,
  QueryConstructor,
} from '@collection-query';
import { DataResponseFormat } from '@api-data';
import { GenericCrudService } from 'src/shared/service/generic-crud.service';

@Injectable()
export class MandatePermissionService extends GenericCrudService<MandatePermission> {
  constructor(
    @InjectRepository(MandatePermission)
    private readonly repositoryMandatePermission: Repository<MandatePermission>,
  ) {
    super(repositoryMandatePermission);
  }
}
