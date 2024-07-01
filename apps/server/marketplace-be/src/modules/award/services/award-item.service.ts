import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ENTITY_MANAGER_KEY,
  ExtraCrudService,
  IgnoreTenantInterceptor,
} from 'megp-shared-be';
import {
  AwardItem,
  AwardNote,
  OpenedOffer,
  SolOffer,
  SolRegistration,
} from 'src/entities';
import { EntityManager, Repository } from 'typeorm';
import { CreateAwardItemDTO } from '../dtos/award-item.dto';
import { REQUEST } from '@nestjs/core';
import { EAwardItemStatus } from 'src/utils/enums/award.enum';

@Injectable()
export class AwardItemService extends ExtraCrudService<AwardItem> {
  constructor(
    @InjectRepository(AwardItem)
    private readonly awardItemRepository: Repository<AwardItem>,
    @Inject(REQUEST) private request: Request,
  ) {
    super(awardItemRepository);
  }

  async create(itemData: CreateAwardItemDTO, req: any) {
    const entityManager: EntityManager = this.request[ENTITY_MANAGER_KEY];

    const [registration, openedOffer, otherVendorAccepted] = await Promise.all([
      entityManager.getRepository(SolRegistration).findOne({
        where: {
          id: itemData.solRegistrationId,
        },
        select: {
          id: true,
          vendorId: true,
          vendorName: true,
        },
      }),
      entityManager.getRepository(OpenedOffer).findOne({
        where: {
          id: itemData.openedOfferId,
        },
      }),
      entityManager.getRepository(AwardItem).exist({
        where: {
          status: EAwardItemStatus.ACCEPTED,
          awardNoteId: itemData.awardNoteId,
        },
      }),
    ]);

    if (!registration) throw new BadRequestException('Registration not found');
    if (!openedOffer) throw new BadRequestException('Opened Offer not found');
    if (otherVendorAccepted)
      throw new BadRequestException('Other vendor already accepted this offer');

    itemData.vendorId = registration.vendorId;
    itemData.vendorName = registration.vendorName;
    itemData.calculatedPrice = openedOffer.calculatedPrice;

    const awardItem = this.awardItemRepository.create(itemData);
    await this.awardItemRepository.insert(awardItem);
    return awardItem;
  }

  async respondAward(awardItemId: string, status: EAwardItemStatus, user: any) {
    const award = await this.awardItemRepository.findOne({
      where: {
        id: awardItemId,
        status: EAwardItemStatus.PENDING,
        solRegistration: {
          vendorId: user.organization.id,
        },
      },
    });

    if (!award)
      throw new BadRequestException(
        'Your Award not found or already responded',
      );

    await this.awardItemRepository.update(awardItemId, { status });
    award.status = status;
    return award;
  }
}
