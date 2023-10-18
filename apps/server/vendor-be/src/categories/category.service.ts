import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Category } from './entities/category';
import { EntityCrudService } from 'src/shared/service/entity-crud.service';

@Injectable()
export class CategoryService extends EntityCrudService<Category> {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {
    super(categoryRepository);
  }
}
