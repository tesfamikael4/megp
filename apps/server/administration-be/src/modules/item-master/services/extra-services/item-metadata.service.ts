import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { ExtraCrudService } from 'src/shared/service';
import { ItemMetaData } from 'src/entities';
import { DataResponseFormat } from 'src/shared/api-data';
import { CollectionQuery, QueryConstructor } from 'src/shared/collection-query';

@Injectable()
export class ItemMetaDataService extends ExtraCrudService<ItemMetaData> {
  constructor(
    @InjectRepository(ItemMetaData)
    private readonly metaDataRepository: Repository<ItemMetaData>,
  ) {
    super(metaDataRepository);
  }

  async getItems(query: CollectionQuery) {
    query.includes.push('itemMaster');

    const dataQuery = QueryConstructor.constructQuery<ItemMetaData>(
      this.metaDataRepository,
      query,
    );
    const response = new DataResponseFormat<ItemMetaData>();
    if (query.count) {
      response.total = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      response.total = total;
      response.items = result;
    }

    const itemMasters: any = [];
    response.items.forEach((item) => {
      itemMasters.push(item.itemMaster);
    });
    response.items = itemMasters;
    return response;
  }
}
