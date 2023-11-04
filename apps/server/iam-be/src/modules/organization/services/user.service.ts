import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '@entities';
import { ExtraCrudService } from 'src/shared/service/extra-crud.service';

@Injectable()
export class UserService extends ExtraCrudService<User> {
  constructor(
    @InjectRepository(User)
    private readonly repositoryUser: Repository<User>,
  ) {
    super(repositoryUser);
  }
}
