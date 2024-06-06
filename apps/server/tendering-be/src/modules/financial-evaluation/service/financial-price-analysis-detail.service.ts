import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { BidRegistrationDetail, Item } from 'src/entities';
import { BiddersComparison } from 'src/entities/bidders-comparison.entity';
import { FinancialPriceAnalysisDetail } from 'src/entities/financial-price-analysis-detail.entity';
import { FinancialPriceAnalysis } from 'src/entities/financial-price-analysis.entity';
import { CollectionQuery } from 'src/shared/collection-query';
import { ENTITY_MANAGER_KEY } from 'src/shared/interceptors';
import { ExtraCrudService } from 'src/shared/service';

import { ArrayContains, EntityManager, In, Repository } from 'typeorm';

@Injectable()
export class FinancialPriceAnalysisDetailService extends ExtraCrudService<FinancialPriceAnalysisDetail> {
  constructor(
    @InjectRepository(FinancialPriceAnalysisDetail)
    private readonly financialPriceAnalysisDetailRepository: Repository<FinancialPriceAnalysisDetail>,

    @Inject(REQUEST)
    private request: Request,
  ) {
    super(financialPriceAnalysisDetailRepository);
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
    const priceAnalysis =
      await this.financialPriceAnalysisDetailRepository.find({
        where: {
          financialPriceAnalyses: {
            lotId,
          },
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

  async bulkCreate(items: any, req: any): Promise<any> {
    const manager: EntityManager = this.request[ENTITY_MANAGER_KEY];
    const offeredItemsId = [];

    const offeredItems = await manager
      .getRepository(BidRegistrationDetail)
      .findOne({
        where: {
          lotId: items.priceAnalysis[0].lotId,
          bidRegistration: {
            bidderId: items.priceAnalysis[0].bidderId,
          },
        },
      });

    const openedBidResponseItems = await manager.getRepository(Item).find({
      where: {
        lotId: items.priceAnalysis[0].lotId,
        id: In(offeredItems.financialItems),
        openedBidResponseItems: {
          key: 'rate',
        },
      },
      relations: {
        openedBidResponseItems: true,
      },
    });

    if (req?.user?.organization) {
      items.priceAnalysis.map((item) => {
        item.organizationId = req.user.organization.id;
        item.organizationName = req.user.organization.name;
        item.evaluatorId = req.user.userId;
        item.evaluatorName = req.user.firstName + ' ' + req.user.lastName;
        item.currency = 'MKW';
        item.calculatedBidUnitPrice = openedBidResponseItems.find(
          (x) => x.id === item.itemId,
        ).openedBidResponseItems[0].value?.value?.rate;
        item.difference = item.calculatedBidUnitPrice - item.marketUnitPrice;
      });
    }
    const priceAnalyses =
      await this.financialPriceAnalysisDetailRepository.create(
        items.priceAnalysis as any,
      );
    const assessment = await manager
      .getRepository(FinancialPriceAnalysis)
      .find({
        where: {
          lotId: items.priceAnalysis[0].lotId,
          bidderId: items.priceAnalysis[0].bidderId,
        },
      });
    if (assessment.length > 0) {
      await this.financialPriceAnalysisDetailRepository.delete({
        financialPriceAnalysisId: assessment[0].id,
      });
      priceAnalyses.map((x) => {
        x.financialPriceAnalysisId = assessment[0].id;
      });
      await this.financialPriceAnalysisDetailRepository.insert(priceAnalyses);
    } else {
      const priceAnalysis = manager
        .getRepository(FinancialPriceAnalysis)
        .create({
          lotId: items.priceAnalysis[0].lotId,
          bidderId: items.priceAnalysis[0].bidderId,
          organizationId: req.user.organization.id,
          organizationName: req.user.organization.name,
          financialPriceAnalysisDetails: priceAnalyses,
        });
      await manager.getRepository(FinancialPriceAnalysis).save(priceAnalysis);
    }

    return priceAnalyses;
  }
}
