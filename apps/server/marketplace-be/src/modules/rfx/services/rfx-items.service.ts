import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CollectionQuery,
  DataResponseFormat,
  ENTITY_MANAGER_KEY,
  ExtraCrudOptions,
  ExtraCrudService,
  FilterOperators,
  QueryConstructor,
} from 'megp-shared-be';
import { RFXItem, SolRound } from 'src/entities';
import { EInvitationStatus, ERfxItemStatus } from 'src/utils/enums';
import { EntityManager, In, Repository, SelectQueryBuilder } from 'typeorm';
import { RfxService } from './rfx.service';
import { REQUEST } from '@nestjs/core';

@Injectable()
export class RFXItemService extends ExtraCrudService<RFXItem> {
  constructor(
    @InjectRepository(RFXItem)
    private readonly repositoryRFXItem: Repository<RFXItem>,
    private readonly rfxService: RfxService,
    @Inject(REQUEST) private request: Request,
  ) {
    super(repositoryRFXItem);
  }

  async myRfxItemsForEvaluation(
    rfxId: string,
    query: CollectionQuery,
    user: any,
  ) {
    const entityManager: EntityManager = this.request[ENTITY_MANAGER_KEY];

    const finalRound = await entityManager.getRepository(SolRound).findOne({
      where: {
        rfxId,
        round: 0,
      },
      select: {
        id: true,
      },
    });

    const dataQuery = QueryConstructor.constructQuery<RFXItem>(
      entityManager.getRepository(RFXItem),
      query,
    )
      .where('rfx_items.rfxId = :rfxId', { rfxId })
      .leftJoinAndSelect(
        'rfx_items.openedOffers',
        'openedOffer',
        'openedOffer.vendorId = :vendorId',
        {
          vendorId: user.organization.id,
        },
      )
      .leftJoinAndSelect(
        'rfx_items.technicalRequirement',
        'rfxTechnicalRequirement',
      )
      .leftJoinAndSelect('rfx_items.rfxItemDocuments', 'rfxItemDocuments');

    return await this.giveQueryResponse<RFXItem>(query, dataQuery);
  }

  async findOne(id: any, req?: any): Promise<RFXItem | undefined> {
    return await this.repositoryRFXItem.findOne({
      where: {
        id,
      },
      relations: {
        rfx: true,
      },
      select: {
        rfx: {
          name: true,
        },
      },
    });
  }

  async findAll(
    entityId: string,
    query: CollectionQuery,
    extraCrudOptions: ExtraCrudOptions,
    req?: any,
  ) {
    const entityIdName = extraCrudOptions.entityIdName;

    query.where.push([
      {
        column: entityIdName,
        value: entityId,
        operator: FilterOperators.EqualTo,
      },
    ]);

    const dataQuery = QueryConstructor.constructQuery<RFXItem>(
      this.repositoryRFXItem,
      query,
    ).loadRelationCountAndMap(
      'rfx_items.invitationCount',
      'rfx_items.rfxProductInvitations',
    );

    return await this.giveQueryResponse<RFXItem>(query, dataQuery);
  }

  async vendorRegistries(vendorId: string, rfxId: string) {
    return this.repositoryRFXItem.find({
      where: {
        rfxId,
        rfxProductInvitations: {
          vendorId,
          status: In([EInvitationStatus.ACCEPTED, EInvitationStatus.COMPLY]),
        },
      },
    });
  }

  async myAwardItems(rfxId: string, user: any, query: CollectionQuery) {
    const dataQuery = QueryConstructor.constructQuery<RFXItem>(
      this.repositoryRFXItem,
      query,
    );
    dataQuery
      .where('rfx_items.rfxId = :rfxId', { rfxId })
      .leftJoinAndSelect('rfx_items.awardItem', 'awardItem')
      .leftJoinAndSelect(
        'rfx_items.technicalRequirement',
        'technicalRequirement',
      )
      .andWhere('awardItem.vendorId = :vendorId', {
        vendorId: user.organization.id,
      })
      .leftJoinAndSelect('awardItem.openedOffer', 'openedOffer');

    return await this.giveQueryResponse<RFXItem>(query, dataQuery);
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
