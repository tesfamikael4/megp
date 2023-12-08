import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { RoleSystemPermission } from '@entities';
import { RelationCrudService } from 'src/shared/service/relation-crud.service';

@Injectable()
export class RoleSystemPermissionService extends RelationCrudService<RoleSystemPermission> {
  constructor(
    @InjectRepository(RoleSystemPermission)
    private readonly repositoryRolePermission: Repository<RoleSystemPermission>,
  ) {
    super(repositoryRolePermission);
  }
}
