import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { BidBookmark } from 'src/entities/bid-bookmark.entity';
import { Organization } from 'src/external-entities/external-organization.entity';
import {
  CollectionQuery,
  FilterOperators,
  QueryConstructor,
} from 'src/shared/collection-query';
import { ENTITY_MANAGER_KEY } from 'src/shared/interceptors';
import { ExtraCrudService } from 'src/shared/service';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class BidBookmarkService extends ExtraCrudService<BidBookmark> {
  constructor(
    @InjectRepository(BidBookmark)
    private readonly bidSecurityRepository: Repository<BidBookmark>,
    @Inject(REQUEST) private request: Request,
  ) {
    super(bidSecurityRepository);
  }

  async findOnes() {
    const query = new CollectionQuery();

    query.where.push([
      {
        column: 'status',
        operator: FilterOperators.EqualTo,
        value: 'BOOKMARKED',
      },
    ]);

    const dataQuery = QueryConstructor.constructQuery<BidBookmark>(
      this.bidSecurityRepository,
      query,
    ).leftJoinAndSelect(
      Organization,
      'bidder',
      'bidder.id::text = bid_bookmarks."bidderId"',
    );

    const sqlQuery: any[] = dataQuery.getQueryAndParameters();

    if (query.skip?.toString() || query.take?.toString()) {
      sqlQuery[0] += `LIMIT ${query.take} OFFSET ${query.skip}`;
    }

    const manager: EntityManager = this.request[ENTITY_MANAGER_KEY];
    const itemQuery = manager
      .getRepository(BidBookmark)
      .query(sqlQuery[0], sqlQuery[1]);
    const [items, total] = await Promise.all([itemQuery, dataQuery.getCount()]);

    return {
      total,
      items,
    };
  }
}
