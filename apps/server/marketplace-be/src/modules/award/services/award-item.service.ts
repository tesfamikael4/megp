import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CollectionQuery,
  DataResponseFormat,
  ENTITY_MANAGER_KEY,
  ExtraCrudService,
  IgnoreTenantInterceptor,
  QueryConstructor,
} from 'megp-shared-be';
import {
  AwardItem,
  AwardNote,
  OpenedOffer,
  SolOffer,
  SolRegistration,
} from 'src/entities';
import {
  DataSource,
  EntityManager,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { CreateAwardItemDTO } from '../dtos/award-item.dto';
import { REQUEST } from '@nestjs/core';
import { EAwardItemStatus } from 'src/utils/enums/award.enum';
import { SchedulerService } from 'src/utils/services/scheduler.service';

@Injectable()
export class AwardItemService extends ExtraCrudService<AwardItem> {
  constructor(
    @InjectRepository(AwardItem)
    private readonly awardItemRepository: Repository<AwardItem>,
    @Inject(REQUEST) private request: Request,
    private readonly schedulerService: SchedulerService,
  ) {
    super(awardItemRepository);
  }

  async create(itemData: CreateAwardItemDTO, req: any) {
    const entityManager: EntityManager = this.request[ENTITY_MANAGER_KEY];

    const [registration, openedOffer, otherVendorAccepted, awardNote] =
      await Promise.all([
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
        entityManager.getRepository(AwardItem).exists({
          where: {
            status: EAwardItemStatus.ACCEPTED,
            rfxItemId: itemData.rfxItemId,
          },
        }),
        entityManager.getRepository(AwardNote).findOne({
          where: {
            rfxId: itemData.rfxId,
          },
        }),
      ]);

    if (!registration) throw new BadRequestException('Registration not found');
    if (!openedOffer) throw new BadRequestException('Opened Offer not found');
    if (!awardNote) throw new BadRequestException('Award Note not found');
    if (otherVendorAccepted)
      throw new BadRequestException('Other vendor already accepted this offer');

    itemData.vendorId = registration.vendorId;
    itemData.vendorName = registration.vendorName;
    itemData.calculatedPrice = openedOffer.calculatedPrice;
    itemData.awardNoteId = awardNote.id;

    const awardItem = this.awardItemRepository.create(itemData);
    await this.awardItemRepository.insert(awardItem);

    const oneDayFromNow = new Date();
    oneDayFromNow.setDate(oneDayFromNow.getDate() + 1);
    await this.schedulerService.schedule(
      this.cancelUnAcceptedAward,
      oneDayFromNow,
      { awardItemId: awardItem.id },
    );

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

  async cancelUnAcceptedAward(
    dataSource: DataSource,
    payload: { awardItemId: string },
  ) {
    const awardItemRepo = dataSource.getRepository(AwardItem);
    const unacceptedAwardItem = await awardItemRepo.exists({
      where: {
        id: payload.awardItemId,
        status: EAwardItemStatus.PENDING,
      },
    });

    if (unacceptedAwardItem) {
      await awardItemRepo.update(payload.awardItemId, {
        status: EAwardItemStatus.CANCELLED,
      });
    }
  }

  async myAwardItem(rfxId: string, user: any, query: CollectionQuery) {
    const dataQuery = QueryConstructor.constructQuery<AwardItem>(
      this.awardItemRepository,
      query,
    );

    dataQuery
      .leftJoin('award_items.awardNote', 'awardNote')
      .where('awardNote.rfxId = :rfxId', { rfxId })
      .andWhere('award_items.vendorId = :vendorId', {
        vendorId: user.organization.id,
      })
      .select([
        'award_items.id',
        'award_items.status',
        'award_items.vendorId',
        'award_items.vendorName',
        'award_items.calculatedPrice',
      ])
      .getMany();

    return await this.giveQueryResponse<AwardItem>(query, dataQuery);
  }

  async awardedVendors(rfxId: string, user: any, query: CollectionQuery) {
    const dataQuery = QueryConstructor.constructQuery<AwardItem>(
      this.awardItemRepository,
      query,
    );

    dataQuery
      .where('award_items.status = :status', {
        status: EAwardItemStatus.ACCEPTED,
      })
      .leftJoin('award_items.awardNote', 'awardNote')
      .andWhere('awardNote.rfxId = :rfxId', { rfxId })
      .andWhere('awardNote.organizationId = :organizationId', {
        organizationId: user.organization.id,
      });

    return await this.giveQueryResponse(query, dataQuery);
  }

  private async giveQueryResponse<T>(
    query: CollectionQuery,
    dataQuery: SelectQueryBuilder<T>,
  ) {
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
