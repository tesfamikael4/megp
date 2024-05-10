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

  async delete(id: string): Promise<void> {
    try {
      const item = await this.itemCatRepository.findOneOrFail({
        where: { id },
      });
      await this.itemCatRepository.remove(item);
    } catch (error) {
      if (error.code === '23503') {
        throw new Error(
          `Unable to delete. This item category is linked to other items, please delete them first.`,
        );
      } else {
        throw error;
      }
    }
  }
}
