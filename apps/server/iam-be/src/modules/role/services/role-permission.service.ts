import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { RolePermission } from '@entities';
import { RelationCrudService } from 'src/shared/service/relation-crud.service';

@Injectable()
export class RolePermissionService extends RelationCrudService<RolePermission> {
  constructor(
    @InjectRepository(RolePermission)
    private readonly repositoryRolePermission: Repository<RolePermission>,
  ) {
    super(repositoryRolePermission);
  }
}
