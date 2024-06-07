import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { BidRegistrationDetail, Item } from 'src/entities';
import { BiddersComparison } from 'src/entities/bidders-comparison.entity';
import { ExchangeRate } from 'src/entities/exchange-rate.entity';
import { FinancialBidPriceAssessment } from 'src/entities/financial-bid-price-assessment.entity';
import { FormulaImplementation } from 'src/entities/formula-implementation.entity';
import { FormulaUnit } from 'src/entities/formula-unit.entity';
import { TenderMilestone } from 'src/entities/tender-milestone.entity';
import { DataResponseFormat } from 'src/shared/api-data';
import {
  CollectionQuery,
  FilterOperators,
  QueryConstructor,
} from 'src/shared/collection-query';
import { TenderMilestoneEnum } from 'src/shared/enums/tender-milestone.enum';
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

  async submit(itemData) {
    const manager: EntityManager = this.request[ENTITY_MANAGER_KEY];

    const financialBidPriceAssessment = await manager
      .getRepository(FinancialBidPriceAssessment)
      .find({
        where: {
          // bidderId: itemData.bidderId,
          lotId: itemData.lotId,
        },
      });

    await manager.getRepository(TenderMilestone).update(
      {
        lotId: itemData.lotId,
        tenderId: itemData.tenderId,
      },
      {
        isCurrent: false,
      },
    );
    await manager.getRepository(TenderMilestone).insert({
      lotId: itemData.lotId,

      tenderId: itemData.tenderId,
      milestoneNum: TenderMilestoneEnum.PriceAnalysis,
      milestoneTxt: 'PriceAnalysis',
      isCurrent: true,
    });

    const elementWithLeastPrice = financialBidPriceAssessment.reduce(
      (min, current) => {
        return current.calculatedBidUnitPrice < min.calculatedBidUnitPrice
          ? current
          : min;
      },
      financialBidPriceAssessment[0],
    );

    const biddersComparison = await Promise.all(
      financialBidPriceAssessment.map(async (list) => {
        const bidRegistrationDetail = await manager
          .getRepository(BidRegistrationDetail)
          .findOne({
            where: {
              lotId: list.lotId,
              bidRegistration: {
                bidderId: list.bidderId,
              },
              technicalItems: ArrayContains([list.itemId]),
            },
          });

        return {
          bidRegistrationDetailId: bidRegistrationDetail.id,
          milestoneNum: TenderMilestoneEnum.FinancialBidPriceValuation,
          milestoneTxt: 'FinancialBidPriceValuation',
          bidderStatus: list.id == elementWithLeastPrice.id ? 326 : 325,
          bidderStatusTxt:
            list.id == elementWithLeastPrice.id
              ? 'FinancialBidPriceValuationSucceeded'
              : 'FinancialBidPriceValuationFailed',
          passFail: list.id == elementWithLeastPrice.id ? true : false,
        };
      }),
    );

    await manager.getRepository(BiddersComparison).insert(biddersComparison);
  }

  async canAssess(lotId: string, query: CollectionQuery, req: any) {
    const manager: EntityManager = this.request[ENTITY_MANAGER_KEY];

    const [hasExchangeRate, hasFormula] = await Promise.all([
      manager.getRepository(ExchangeRate).exists({
        where: {
          lotId: lotId,
        },
      }),
      manager.getRepository(FormulaUnit).exists({
        where: {
          lotId: lotId,
        },
      }),
    ]);
    return { canAssess: hasExchangeRate && hasFormula };
  }

  // check if the lot has a formula assigned before
  async hasFormula(
    lotId: string,
    itemId: string,
    bidderId: string,
    query: CollectionQuery,
    req: any,
  ) {
    const manager: EntityManager = this.request[ENTITY_MANAGER_KEY];

    const hasFormula = await manager
      .getRepository(FormulaImplementation)
      .exists({
        where: {
          lotId: lotId,
          itemId,
          bidderId,
        },
      });
    return { hasFormula };
  }
}
