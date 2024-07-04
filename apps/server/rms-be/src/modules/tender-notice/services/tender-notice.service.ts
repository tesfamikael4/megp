import { Injectable } from '@nestjs/common';
import { TenderNotice } from 'src/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import {
  CollectionQuery,
  DataResponseFormat,
  EntityCrudService,
  FilterOperators,
  QueryConstructor,
} from 'megp-shared-be';

@Injectable()
export class TenderNoticeService extends EntityCrudService<TenderNotice> {
  constructor(
    @InjectRepository(TenderNotice)
    private readonly tenderNoticeRepository: Repository<TenderNotice>,
  ) {
    super(tenderNoticeRepository);
  }

  async findAll(
    query: CollectionQuery,
  ): Promise<DataResponseFormat<TenderNotice>> {
    query.where.push([
      {
        column: 'isOpen',
        operator: FilterOperators.EqualTo,
        value: true,
      },
    ]);

    const dataQuery = QueryConstructor.constructQuery<TenderNotice>(
      this.tenderNoticeRepository,
      query,
    );

    return await this.giveQueryResponse(query, dataQuery);
  }

  async giveQueryResponse<T>(
    query: CollectionQuery,
    dataQuery: SelectQueryBuilder<T>,
  ) {
    const response = new DataResponseFormat<T>();
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
