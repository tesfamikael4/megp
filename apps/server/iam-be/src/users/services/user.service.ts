import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { EntityCrudService } from 'src/shared/service/entity-crud.service';
import { User } from '../entities/user.entity';

@Injectable()
export class UserService extends EntityCrudService<User> {
  constructor(
    @InjectRepository(User)
    private readonly repositoryUser: Repository<User>,
  ) {
    super(repositoryUser);
  }
}
