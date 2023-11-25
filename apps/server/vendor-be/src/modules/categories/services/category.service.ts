import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { EntityCrudService } from 'src/shared/service/entity-crud.service';
import { Category } from 'src/entities/category.entity';

@Injectable()
export class CategoryService extends EntityCrudService<Category> {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {
    super(categoryRepository);
  }

  async saveBulk(categories: any[]) {
    try {
      await this.categoryRepository.save(categories);
      return true;
    } catch (error) {
      throw new Error(error);
    }
  }
}
