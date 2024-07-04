import { InjectRepository } from '@nestjs/typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ExtraCrudService } from 'src/shared/service';

import { REQUEST } from '@nestjs/core';
import { BidRegistrationService } from 'src/modules/bid/service/bid-registration.service';
import { BidOpeningChecklistAssessment } from 'src/entities/bid-opening-checklist-assessment.entity';

@Injectable()
export class BidOpeningChecklistAssessmentService extends ExtraCrudService<BidOpeningChecklistAssessment> {
  constructor(
    @InjectRepository(BidOpeningChecklistAssessment)
    private readonly bidOpeningChecklistsRepository: Repository<BidOpeningChecklistAssessment>,

    private readonly bidRegistrationService: BidRegistrationService,

    @Inject(REQUEST) private request: Request,
  ) {
    super(bidOpeningChecklistsRepository);
  }
}
