import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { MandatePermission } from '../entities/mandate-permission.entity';
import { RelationCrudService } from 'src/shared/service/relation-crud.service';

@Injectable()
export class MandatePermissionService extends RelationCrudService<MandatePermission> {
  constructor(
    @InjectRepository(MandatePermission)
    private readonly repositoryMandatePermission: Repository<MandatePermission>,
  ) {
    super(repositoryMandatePermission);
  }
}
