import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { DataResponseFormat } from 'src/shared/api-data';
import { ItemCategory } from 'src/entities/item-category.entity';
import { EntityCrudService } from 'src/shared/service';
import { CollectionQuery, QueryConstructor } from 'src/shared/collection-query';
import { CreateItemCategoryDto } from '../dto/item-category.dto';
@Injectable()
export class ItemCategoryService extends EntityCrudService<ItemCategory> {
  constructor(
    @InjectRepository(ItemCategory)
    private readonly itemCatRepository: Repository<ItemCategory>,
  ) {
    super(itemCatRepository);
  }
  async createUniqueData(itemCatDto: CreateItemCategoryDto): Promise<any> {
    const NameExist = await this.itemCatRepository.findOne({
      where: [{ name: ILike(`%${itemCatDto.name}%`) }],
      withDeleted: true,
    });
    if (NameExist) {
      // If the existing Currency is soft-deleted, recover it
      if (NameExist.deletedAt) {
        await this.itemCatRepository.recover(NameExist);
        // Update parentId (if needed) and return the recovered Currency
        NameExist.parentId = itemCatDto.parentId;

        await this.itemCatRepository.save(NameExist);
        return NameExist;
      } else {
        return {
          name: itemCatDto.name,
          message: 'Item Category Already Exist.',
        };
      }
    } else {
      const newICat = new ItemCategory();
      newICat.name = itemCatDto.name;
      newICat.parentId = itemCatDto.parentId;
      try {
        const result = await this.itemCatRepository.save(newICat);
        if (result) {
          return result;
        }
      } catch (error) {
        throw error;
      }
    }
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
