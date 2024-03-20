import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { BidBookmark } from 'src/entities/bid-bookmark.entity';
import {
  CollectionQuery,
  FilterOperators,
  QueryConstructor,
} from 'src/shared/collection-query';
import { ENTITY_MANAGER_KEY } from 'src/shared/interceptors';
import { ExtraCrudService } from 'src/shared/service';
import { EntityManager, Repository } from 'typeorm';
import { CreateBidBookmarkDto } from '../dto/bid-bookmark.dto';
import { DataResponseFormat } from 'src/shared/api-data';
import { BidBookmarkStatusEnum } from 'src/shared/enums';

@Injectable()
export class BidBookmarkService extends ExtraCrudService<BidBookmark> {
  constructor(
    @InjectRepository(BidBookmark)
    private readonly bidSecurityRepository: Repository<BidBookmark>,
    @Inject(REQUEST) private request: Request,
  ) {
    super(bidSecurityRepository);
  }

  async create(itemData: CreateBidBookmarkDto, req?: any): Promise<any> {
    const item = this.bidSecurityRepository.create(itemData);
    item.bidderId = req.user.organization.id;
    item.bidderName = req.user.organization.name;
    await this.bidSecurityRepository.insert(item);
    return item;
  }

  async getMyBookmarks(query: CollectionQuery, req?: any): Promise<any> {
    query.includes.push('tender');
    query.includes.push('tender.lots');

    query.where.push([
      {
        column: 'bidderId',
        operator: FilterOperators.EqualTo,
        value: req.user.organization.id,
      },
    ]);
    query.where.push([
      {
        column: 'status',
        operator: FilterOperators.EqualTo,
        value: BidBookmarkStatusEnum.BOOKMARKED,
      },
    ]);

    const dataQuery = QueryConstructor.constructQuery<BidBookmark>(
      this.bidSecurityRepository,
      query,
    );
    const response = new DataResponseFormat<BidBookmark>();
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
