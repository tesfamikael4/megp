import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ItemCategory } from 'src/entities/item-category.entity';
import { EntityCrudService } from 'src/shared/service';
import { CreateItemCategoryDto } from '../dto/item-category.dto';
@Injectable()
export class ItemCategoryService extends EntityCrudService<ItemCategory> {
  constructor(
    @InjectRepository(ItemCategory)
    private readonly itemCatRepository: Repository<ItemCategory>,
  ) {
    super(itemCatRepository);
  }
  async createUniqueItemCat(
    itemCatDto: CreateItemCategoryDto,
  ): Promise<ItemCategory> {
    const itemCategoryExists = await this.itemCatRepository.exists({
      where: {
        name: itemCatDto.name,
      },
    });
    if (itemCategoryExists) {
      throw new ConflictException({
        name: itemCatDto.name,
        message: 'Item Category already exists',
      });
    } else {
      const newICat = await super.create(itemCatDto);
      return newICat;
    }
  }
}
