import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserRoleSystem } from '@entities';
import { RelationCrudService } from 'src/shared/service/relation-crud.service';

@Injectable()
export class UserRoleSystemService extends RelationCrudService<UserRoleSystem> {
  constructor(
    @InjectRepository(UserRoleSystem)
    private readonly repositoryUserRole: Repository<UserRoleSystem>,
  ) {
    super(repositoryUserRole);
  }
}
