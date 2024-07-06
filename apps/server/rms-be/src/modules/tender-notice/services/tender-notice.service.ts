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
import { ESaveType } from 'src/utils/enums/tender-notice.enum';

@Injectable()
export class TenderNoticeService extends EntityCrudService<TenderNotice> {
  constructor(
    @InjectRepository(TenderNotice)
    private readonly tenderNoticeRepository: Repository<TenderNotice>,
  ) {
    super(tenderNoticeRepository);
  }

  async create(itemData: any, req?: any): Promise<any> {
    const item = this.tenderNoticeRepository.create(itemData) as any;
    item.tenderProcurementMechanism = itemData.procurementMechanism;
    item.savedNotices = itemData.tenderInvitees?.map((el: any) => {
      return { ...el, saveType: ESaveType.INVITATION };
    });

    await this.tenderNoticeRepository.save(item);
    return item;
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
    )
      .leftJoin(
        'tender_notices.tenderProcurementMechanism',
        'tenderProcurementMechanism',
      )
      .where(
        '"tenderProcurementMechanism"."invitationType" = :invitationType',
        {
          invitationType: 'open',
        },
      );

    return await this.giveQueryResponse(query, dataQuery);
  }

  async findInvitedTenders(
    query: CollectionQuery,
    user: any,
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
    )
      .leftJoin('tender_notices.savedNotices', 'savedNotices')
      .where(
        '"savedNotices"."bidderId" = :bidderId AND "savedNotices"."saveType" = :saveType',
        {
          bidderId: user?.id,
          saveType: ESaveType.INVITATION,
        },
      );

    return await this.giveQueryResponse(query, dataQuery);
  }

  async findRegisteredTenders(
    query: CollectionQuery,
    user: any,
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
    )
      .leftJoin('tender_notices.savedNotices', 'savedNotices')
      .where(
        '"savedNotices"."bidderId" = :bidderId AND "savedNotices"."saveType" = :saveType',
        {
          bidderId: user?.id,
          saveType: ESaveType.REGISTERED,
        },
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
