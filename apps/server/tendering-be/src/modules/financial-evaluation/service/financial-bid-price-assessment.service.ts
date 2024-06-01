import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from 'src/entities';
import { BiddersComparison } from 'src/entities/bidders-comparison.entity';
import { ExchangeRate } from 'src/entities/exchange-rate.entity';
import { FinancialBidPriceAssessment } from 'src/entities/financial-bid-price-assessment.entity';
import { FormulaUnit } from 'src/entities/formula-unit.entity';
import { DataResponseFormat } from 'src/shared/api-data';
import {
  CollectionQuery,
  FilterOperators,
  QueryConstructor,
} from 'src/shared/collection-query';
import { ENTITY_MANAGER_KEY } from 'src/shared/interceptors';
import { ExtraCrudService } from 'src/shared/service';
import { ArrayContains, EntityManager, Repository } from 'typeorm';

@Injectable()
export class FinancialBidPriceAssessmentService extends ExtraCrudService<FinancialBidPriceAssessment> {
  constructor(
    @InjectRepository(FinancialBidPriceAssessment)
    private readonly financialBidPriceAssessmentRepository: Repository<FinancialBidPriceAssessment>,

    @Inject(REQUEST)
    private request: Request,
  ) {
    super(financialBidPriceAssessmentRepository);
  }

  async passedBidders(
    lotId: string,
    itemId: string,
    query: CollectionQuery,
    req: any,
  ) {
    // Functionality: Checks if the current user (opener) is part of the team for the given lot,
    // then checks if the opener has completed the spd compliance for each bidder.
    //Todo check if the opener is in the team
    const manager: EntityManager = this.request[ENTITY_MANAGER_KEY];

    return await manager.getRepository(BiddersComparison).find({
      where: {
        bidRegistrationDetail: {
          lotId: lotId,
          technicalItems: ArrayContains([itemId]),
        },
        milestoneNum: 305,
        bidderStatus: 308,
        isCurrent: true,
      },
      relations: {
        bidRegistrationDetail: {
          bidRegistration: true,
        },
      },
      select: {
        id: true,
        bidRegistrationDetail: {
          id: true,
          bidRegistration: {
            id: true,
            bidderId: true,
            bidderName: true,
          },
        },
      },
    });
  }
  async getItemsByLotId(lotId: string, query: CollectionQuery, req: any) {
    query.where.push([
      {
        column: 'lotId',
        value: lotId,
        operator: FilterOperators.EqualTo,
      },
    ]);
    const manager: EntityManager = this.request[ENTITY_MANAGER_KEY];

    const dataQuery = QueryConstructor.constructQuery<Item>(
      manager.getRepository(Item),
      query,
    );
    const response = new DataResponseFormat<Item>();
    if (query.count) {
      response.total = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      response.total = total;
      response.items = result;
    }
    return response;
  }

  async canAssess(lotId: string, query: CollectionQuery, req: any) {
    const manager: EntityManager = this.request[ENTITY_MANAGER_KEY];

    const [hasExchangeRate, hasFormula] = await Promise.all([
      manager.getRepository(ExchangeRate).findOne({
        where: {
          lotId: lotId,
        },
      }),
      manager.getRepository(FormulaUnit).findOne({
        where: {
          lotId: lotId,
        },
      }),
    ]);
    return hasExchangeRate && hasFormula;
  }
}
