import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CollectionQuery,
  DataResponseFormat,
  ENTITY_MANAGER_KEY,
  ExtraCrudService,
  FilterOperators,
  QueryConstructor,
} from 'megp-shared-be';
import {
  OpenedOffer,
  RFX,
  RFXItem,
  RfxBidProcedure,
  SolRound,
  SolRoundAward,
} from 'src/entities';
import { EInvitationStatus, ERfxItemStatus, ERfxStatus } from 'src/utils/enums';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class SolRoundAwardService extends ExtraCrudService<SolRoundAward> {
  constructor(
    @InjectRepository(SolRoundAward)
    private readonly roundAwardRepository: Repository<SolRoundAward>,
    @InjectRepository(OpenedOffer)
    private readonly openedOfferRepository: Repository<OpenedOffer>,
    @Inject(REQUEST) private request: Request,
  ) {
    super(roundAwardRepository);
  }

  async getMyAwardedRfxes(query: CollectionQuery, user: any) {
    const entityManager: EntityManager = this.request[ENTITY_MANAGER_KEY];

    const dataQuery = QueryConstructor.constructQuery<RFX>(
      entityManager.getRepository(RFX),
      query,
    )
      .where('rfxes.status = status', {
        status: ERfxStatus.ENDED,
      })
      .leftJoinAndSelect('rfxes.items', 'rfxItems')
      .leftJoinAndSelect(
        'rfxItems.rfxProductInvitations',
        'rfxProductInvitation',
      )
      .andWhere('rfxProductInvitation.vendorId = :vendorId', {
        vendorId: user.organization.id,
      })
      .andWhere('rfxProductInvitation.status IN (:...statuses)', {
        statuses: [EInvitationStatus.APPROVED, EInvitationStatus.COMPLY],
      });

    return await this.giveQueryResponse<RFX>(query, dataQuery);
  }

  async getAwardWinner(rfxItemId: string, query: CollectionQuery) {
    const finalRoundOffer = await this.openedOfferRepository.findOne({
      where: {
        rfxItemId,
      },
      relations: {
        solRound: true,
      },
      select: {
        id: true,
        solRound: {
          id: true,
          round: true,
        },
      },
      order: {
        solRound: {
          round: 'DESC',
        },
      },
    });

    const dataQuery = QueryConstructor.constructQuery<OpenedOffer>(
      this.openedOfferRepository,
      query,
    );

    dataQuery
      .leftJoin('opened_offers.rfxItem', 'rfxItems')
      .where('rfxItems.id = :rfxItemId', { rfxItemId })
      .leftJoin('opened_offers.solRound', 'solRound')
      .andWhere('solRound.round = :round', {
        round: finalRoundOffer.solRound.round,
      })
      .leftJoinAndSelect('opened_offers.solRegistration', 'solRegistration')
      .orderBy('opened_offers.rank', 'ASC');

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

  private async giveQueryResponse<T>(
    query: CollectionQuery,
    dataQuery: any,
  ): Promise<DataResponseFormat<T>> {
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
