import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserRole } from '@entities';
import { RelationCrudService } from 'src/shared/service/relation-crud.service';

@Injectable()
export class UserRoleService extends RelationCrudService<UserRole> {
  constructor(
    @InjectRepository(UserRole)
    private readonly repositoryUserRole: Repository<UserRole>,
  ) {
    super(repositoryUserRole);
  }
}
