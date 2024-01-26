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
}
