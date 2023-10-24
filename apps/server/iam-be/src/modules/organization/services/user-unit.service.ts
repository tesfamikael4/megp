import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserUnit } from '../entities/user-unit.entity';
import { RelationCrudService } from 'src/shared/service/relation-crud.service';

@Injectable()
export class UserUnitService extends RelationCrudService<UserUnit> {
  constructor(
    @InjectRepository(UserUnit)
    private readonly repositoryUserUnit: Repository<UserUnit>,
  ) {
    super(repositoryUserUnit);
  }
}
