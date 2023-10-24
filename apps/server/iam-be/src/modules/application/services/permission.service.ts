import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Permission } from '../entities/permission.entity';
import { ExtraCrudService } from 'src/shared/service/extra-crud.service';

@Injectable()
export class PermissionService extends ExtraCrudService<Permission> {
  constructor(
    @InjectRepository(Permission)
    private readonly repositoryPermission: Repository<Permission>,
  ) {
    super(repositoryPermission);
  }
}
