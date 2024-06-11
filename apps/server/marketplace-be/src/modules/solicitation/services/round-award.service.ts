import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CollectionQuery,
  DataResponseFormat,
  ExtraCrudService,
  FilterOperators,
  QueryConstructor,
} from 'megp-shared-be';
import { OpenedOffer, SolRoundAward } from 'src/entities';
import { Repository } from 'typeorm';

@Injectable()
export class SolRoundAwardService extends ExtraCrudService<SolRoundAward> {
  constructor(
    @InjectRepository(SolRoundAward)
    private readonly roundAwardRepository: Repository<SolRoundAward>,
    @InjectRepository(OpenedOffer)
    private readonly openedOfferRepository: Repository<OpenedOffer>,
  ) {
    super(roundAwardRepository);
  }

  async listResult(rfxItemId: string, round: number, query: CollectionQuery) {
    query.where.push([
      {
        column: 'rfxItemId',
        value: rfxItemId,
        operator: FilterOperators.EqualTo,
      },
    ]);

    query.where.push([
      {
        column: 'solRound.round',
        value: round,
        operator: FilterOperators.EqualTo,
      },
    ]);

    query.orderBy.push({
      column: 'rank',
      direction: 'ASC',
    });

    query.includes.push('solRound');

    const dataQuery = QueryConstructor.constructQuery<OpenedOffer>(
      this.openedOfferRepository,
      query,
    );

    const response = new DataResponseFormat<OpenedOffer>();
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
