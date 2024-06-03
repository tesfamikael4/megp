import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { BiddersComparison } from 'src/entities/bidders-comparison.entity';
import { FinancialPriceAnalysis } from 'src/entities/financial-price-analysis.entity';
import { CollectionQuery } from 'src/shared/collection-query';
import { ENTITY_MANAGER_KEY } from 'src/shared/interceptors';
import { ExtraCrudService } from 'src/shared/service';

import { ArrayContains, EntityManager, Repository } from 'typeorm';

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
  async passedBidders(
    lotId: string,
    itemId: string,
    query: CollectionQuery,
    req: any,
  ) {
    // Functionality: Checks if the current user (opener) is part of the team for the given lot,
    // then checks if the opener has completed the spd compliance for each bidder.
    const manager: EntityManager = this.request[ENTITY_MANAGER_KEY];

    return await manager.getRepository(BiddersComparison).find({
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
  }
}
