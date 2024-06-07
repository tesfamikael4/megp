import { InjectRepository } from '@nestjs/typeorm';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { ExtraCrudService } from 'src/shared/service';

import { ENTITY_MANAGER_KEY } from 'src/shared/interceptors';
import { EntityManager } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { Spd, SpdOpeningChecklist, Tender } from 'src/entities';
import {
  CompleteBidChecklistDto,
  OpenerResultDto,
  SubmitChecklistDto,
} from '../dto/bid-opening-checklist.dto';
import { TeamMember } from 'src/entities/team-member.entity';
import { BidRegistrationService } from 'src/modules/bid/service/bid-registration.service';
import {
  CollectionQuery,
  decodeCollectionQuery,
} from 'src/shared/collection-query';
import { BidRegistration } from 'src/entities/bid-registration.entity';
import { TeamRoleEnum } from 'src/shared/enums/team-type.enum';
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
