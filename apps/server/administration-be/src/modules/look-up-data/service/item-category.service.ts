import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DataResponseFormat } from 'src/shared/api-data';
import { ItemCategory } from 'src/entities/item-category.entity';
import { EntityCrudService } from 'src/shared/service';
import { CollectionQuery, QueryConstructor } from 'src/shared/collection-query';
@Injectable()
export class ItemCategoryService extends EntityCrudService<ItemCategory> {
  constructor(
    @InjectRepository(ItemCategory)
    private readonly itemCatRepository: Repository<ItemCategory>,
  ) {
    super(itemCatRepository);
  }
  async findItems(query: CollectionQuery) {
    console.log(query);
    return await this.getClassifications(query);
  }

  private async getClassifications(query: CollectionQuery) {
    const dataQuery = QueryConstructor.constructQuery<ItemCategory>(
      this.itemCatRepository,
      query,
    );

    const response = new DataResponseFormat<ItemCategory>();
    if (query.count) {
      response.total = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      response.total = total;
      response.items = result;
    }

    return response;
  }
}
