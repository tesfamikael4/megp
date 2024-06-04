import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { BidRegistrationDetail, Item } from 'src/entities';
import { BiddersComparison } from 'src/entities/bidders-comparison.entity';
import { FinancialPriceAnalysis } from 'src/entities/financial-price-analysis.entity';
import { CollectionQuery } from 'src/shared/collection-query';
import { ENTITY_MANAGER_KEY } from 'src/shared/interceptors';
import { ExtraCrudService } from 'src/shared/service';

import { ArrayContains, EntityManager, In, Repository } from 'typeorm';

@Injectable()
export class FinancialPriceAnalysisService extends ExtraCrudService<FinancialPriceAnalysis> {
  constructor(
    @InjectRepository(FinancialPriceAnalysis)
    private readonly financialPriceAnalysisRepository: Repository<FinancialPriceAnalysis>,

    @Inject(REQUEST)
    private request: Request,
  ) {
    super(financialPriceAnalysisRepository);
  }
  async passedBidders(lotId: string, query: CollectionQuery, req: any) {
    // Functionality: Checks if the current user (opener) is part of the team for the given lot,
    // then checks if the opener has completed the spd compliance for each bidder.
    const manager: EntityManager = this.request[ENTITY_MANAGER_KEY];

    const bidders = await manager.getRepository(BiddersComparison).find({
      where: {
        bidRegistrationDetail: {
          lotId: lotId,
        },
        milestoneNum: 323,
        bidderStatus: 326,
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
    return bidders;
  }

  async getOfferedBidderItems(lotId: string, bidderId: string): Promise<any> {
    const manager: EntityManager = this.request[ENTITY_MANAGER_KEY];

    const offeredItems = await manager
      .getRepository(BidRegistrationDetail)
      .findOne({
        where: {
          lotId: lotId,
          bidRegistration: {
            bidderId: bidderId,
          },
        },
      });

    const items = await manager.getRepository(Item).find({
      where: {
        lotId: lotId,
        id: In(offeredItems.financialItems),
        openedBidResponseItems: {
          key: 'rate',
        },
      },
      relations: {
        openedBidResponseItems: true,
      },
    });
    const priceAnalysis = await this.financialPriceAnalysisRepository.find({
      where: {
        lotId: lotId,
        itemId: In(items.map((item) => item.id)),
      },
    });
    const response = items.map((item) => {
      const analysis = priceAnalysis.find((x) => x.itemId === item.id);
      return {
        itemId: item.id,
        name: item.name,
        offeredUnitPrice: item.openedBidResponseItems[0].value?.value?.rate,
        marketPrice: analysis ? analysis.marketUnitPrice : false,
      };
    });
    return response;
  }
}
