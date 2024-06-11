import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import {
  CollectionQuery,
  DataResponseFormat,
  ENTITY_MANAGER_KEY,
  ExtraCrudService,
  QueryConstructor,
} from 'megp-shared-be';
import {
  RFX,
  RFXItem,
  RfxProductInvitation,
  SolOffer,
  SolRegistration,
  SolRound,
  SolRoundAward,
} from 'src/entities';
import {
  EntityManager,
  Repository,
  In,
  SelectQueryBuilder,
  MoreThan,
  MoreThanOrEqual,
  LessThanOrEqual,
} from 'typeorm';
import {
  ApplyRfxProductInvitationDto,
  CreateRfxBidInvitationDto,
} from '../dtos/rfx-bid-invitaiton.dto';
import { ProductCatalogueDto } from '../dtos/product-catalogue.dto';
import {
  EInvitationStatus,
  ERfxItemStatus,
  ERfxStatus,
  ESolRegistrationStatus,
} from 'src/utils/enums';
import { REQUEST } from '@nestjs/core';

@Injectable()
export class RfxProductInvitationService extends ExtraCrudService<RfxProductInvitation> {
  constructor(
    @InjectRepository(RfxProductInvitation)
    private readonly rfxBidInvitationRepository: Repository<RfxProductInvitation>,
    @InjectRepository(RFXItem)
    private readonly rfxItemRepository: Repository<RFXItem>,
    @InjectRepository(RFX)
    private readonly rfxRepository: Repository<RFX>,
    @Inject(REQUEST) private readonly request: Request,
  ) {
    super(rfxBidInvitationRepository);
  }

  async applyOnInvitation(
    itemData: ApplyRfxProductInvitationDto,
    user: any,
  ): Promise<any> {
    const entityManager: EntityManager = this.request[ENTITY_MANAGER_KEY];
    const rfxItemId = itemData.rfxItemId;

    const now = new Date(Date.now());
    const [item, solRegistration] = await Promise.all([
      entityManager.getRepository(RFXItem).findOne({
        where: {
          id: rfxItemId,
          rfx: {
            isOpen: true,
            solRegistrations: {
              vendorId: user.organization.id,
            },
            rfxBidProcedure: {
              submissionDeadline: MoreThanOrEqual(now),
            },
          },
        },
      }),
      entityManager.getRepository(SolRegistration).findOne({
        where: {
          vendorId: user.organization.id,
        },
        select: { id: true },
      }),
    ]);

    if (!item) throw new BadRequestException('No Open RFQ Item Found');

    itemData.status = EInvitationStatus.ACCEPTED;
    itemData.vendorId = user.organization.id;
    itemData.vendorMetadata = {
      id: user.organization.id,
      name: user.organization.name,
    };
    itemData.solRegistrationId = solRegistration.id;

    const invitation = this.rfxBidInvitationRepository.create(itemData);
    await this.rfxBidInvitationRepository.insert(invitation);
    return invitation;
  }

  async myItemInvitations(
    query: CollectionQuery,
    rfxItemId: string,
    user: any,
  ) {
    const entityManager: EntityManager = this.request[ENTITY_MANAGER_KEY];

    const dataQuery = QueryConstructor.constructQuery<RfxProductInvitation>(
      entityManager.getRepository(RfxProductInvitation),
      query,
    )
      .leftJoin('rfx_product_invitations.rfxItem', 'rfxItems')
      .where('rfxItems.id = :rfxItemId', { rfxItemId })
      .andWhere('rfxItems.status = :status', {
        status: ERfxItemStatus.APPROVED,
      })
      .andWhere('rfx_product_invitations.vendorId = :vendorId', {
        vendorId: user.organization.id,
      });

    return await this.giveQueryResponse<RfxProductInvitation>(query, dataQuery);
  }

  async myRfxItemDetail(rfxItemId: string, user: any) {
    const rfxItem = await this.rfxItemRepository.findOne({
      where: {
        id: rfxItemId,
        rfxProductInvitations: {
          vendorId: user.organization.id,
        },
      },
    });

    if (!rfxItem) throw new NotFoundException('RFQ Item not found');

    return rfxItem;
  }

  async myRfxItems(query: CollectionQuery, rfxId: string, user: any) {
    const entityManager: EntityManager = this.request[ENTITY_MANAGER_KEY];

    const now = new Date();
    const [previousRound, registration] = await Promise.all([
      entityManager.getRepository(SolRound).findOne({
        where: { rfxId, end: LessThanOrEqual(now) },
        select: { id: true },
      }),
      entityManager.getRepository(SolRegistration).findOne({
        where: { rfxId, vendorId: user.organization.id },
        select: { id: true },
      }),
    ]);

    const dataQuery = QueryConstructor.constructQuery<RFXItem>(
      entityManager.getRepository(RFXItem),
      query,
    )
      .leftJoin('rfx_items.rfx', 'rfxes')
      .where('rfxes.id = :rfxId', { rfxId })
      // .andWhere('rfxes.status IN (:...status)', {
      //   status: [ERfxStatus.APPROVED, ERfxStatus.AUCTION],
      // })
      .leftJoin('rfx_items.rfxProductInvitations', 'rfxProductInvitations')
      .andWhere('rfxProductInvitations.vendorId = :vendorId', {
        vendorId: user.organization.id,
      });

    if (previousRound)
      dataQuery.loadRelationCountAndMap(
        'rfx_items.previousOffer',
        'rfx_items.openedOffers',
        'openedOffers',
        (qb) =>
          qb
            .where('openedOffers.solRoundId = :solRoundId', {
              solRoundId: previousRound.id,
            })
            .andWhere('openedOffers.solRegistrationId = :solRegistrationId', {
              solRegistrationId: registration.id,
            }),
      );

    return await this.giveQueryResponse<RFXItem>(query, dataQuery);
  }

  async myRfxDetail(rfxId: string, user: any) {
    const entityManager: EntityManager = this.request[ENTITY_MANAGER_KEY];
    const now = new Date();

    const [rfx, activeRound, nextRound] = await Promise.all([
      this.rfxRepository.findOne({
        where: {
          id: rfxId,
          // status: In([ERfxStatus.APPROVED, ERfxStatus.AUCTION, ERfxStatus.EVALUATION, ERfxStatus.ENDED, ERfxStatus.SUBMITTED_EVALUATION]),
          items: {
            rfxProductInvitations: {
              vendorId: user.organization.id,
            },
          },
        },
        relations: {
          rfxBidProcedure: true,
        },
      }),
      entityManager.getRepository(SolRound).findOne({
        where: {
          rfxId,
          start: LessThanOrEqual(now),
          end: MoreThanOrEqual(now),
        },
      }),
      entityManager.getRepository(SolRound).findOne({
        where: {
          rfxId,
          start: MoreThanOrEqual(now),
        },
        order: {
          start: 'ASC',
        },
      }),
    ]);

    if (!rfx) throw new NotFoundException('Your Requested RFQ is not found');

    return { ...rfx, activeRound, nextRound };
  }

  async giveQueryResponse<T>(
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

  async myInvitations(query: CollectionQuery, user: any) {
    const entityManager: EntityManager = this.request[ENTITY_MANAGER_KEY];

    const dataQuery = QueryConstructor.constructQuery<RFX>(
      entityManager.getRepository(RFX),
      query,
    )
      // .where('rfxes.status IN (:...status)', {
      //   status: [ERfxStatus.APPROVED, ERfxStatus.AUCTION],
      // })
      .leftJoinAndSelect('rfxes.items', 'rfxItems')
      .leftJoinAndSelect(
        'rfxItems.rfxProductInvitations',
        'rfxProductInvitation',
      )
      .where('rfxProductInvitation.vendorId = :vendorId', {
        vendorId: user.organization.id,
      });

    return await this.giveQueryResponse<RFX>(query, dataQuery);
  }

  async myRfxItemInvitations(rfxItemId: string, user: any) {
    const myInvitations = await this.rfxBidInvitationRepository.find({
      where: {
        rfxItem: {
          id: rfxItemId,
          status: ERfxItemStatus.APPROVED,
        },
        vendorId: user.organization.id,
      },
    });

    if (myInvitations.length == 0)
      throw new NotFoundException('RFQ Item Invitaiton not found');

    return myInvitations;
  }

  async inviteSelected(rfxItemId: string, itemData: CreateRfxBidInvitationDto) {
    const entityManager: EntityManager = this.request[ENTITY_MANAGER_KEY];

    const [rfxItem, productCatalogues] = await Promise.all([
      this.rfxItemRepository.findOne({
        where: {
          id: rfxItemId,
          status: In([
            ERfxItemStatus.DRAFT,
            ERfxItemStatus.INVITATION_PREPARED,
          ]),
        },
      }),
      this.getRefinedProductCatalogues(itemData.productCatalogueIds),
    ]);

    if (!rfxItem) throw new NotFoundException('draft_rfx_item_not_found');

    const invitations = [];
    productCatalogues.forEach((catalogue: ProductCatalogueDto) => {
      if (catalogue.quantity < rfxItem.quantity)
        throw new BadRequestException(
          `Can not invite a vendor of less quantity`,
        );

      const rfxProductInvitation = this.createInvitationFromCatalogue(
        catalogue,
        rfxItemId,
      );

      invitations.push(rfxProductInvitation);
    });

    const createdInvitations =
      this.rfxBidInvitationRepository.create(invitations);

    await Promise.all([
      // Previous invitations
      entityManager.getRepository(RfxProductInvitation).delete({
        rfxItemId: rfxItemId,
      }),
      entityManager.getRepository(RFXItem).update(rfxItemId, {
        isOpen: false,
        status: ERfxItemStatus.INVITATION_PREPARED,
      }),
    ]);

    await entityManager
      .getRepository(RfxProductInvitation)
      .insert(createdInvitations);

    return createdInvitations;
  }

  async removeInvitees(rfxItemId: string) {
    const rfxItem = await this.rfxItemRepository.findOne({
      where: {
        id: rfxItemId,
      },
      select: {
        id: true,
        status: true,
      },
    });

    if (!rfxItem) throw new BadRequestException('RFQ Item not found');

    if (rfxItem.status !== ERfxItemStatus.INVITATION_PREPARED)
      throw new BadRequestException('Item has no prepared invitation');

    await Promise.all([
      this.rfxBidInvitationRepository.delete({
        rfxItemId,
      }),
      this.rfxItemRepository.update(rfxItemId, {
        isOpen: false,
        status: ERfxItemStatus.DRAFT,
      }),
    ]);
  }

  async makeOpenInvitation(rfxItemId: string) {
    const rfxItem = await this.rfxItemRepository.findOne({
      where: {
        id: rfxItemId,
        status: In([ERfxItemStatus.DRAFT, ERfxItemStatus.INVITATION_PREPARED]),
      },
      select: {
        id: true,
        status: true,
      },
    });

    if (!rfxItem) throw new BadRequestException('no rfx item found');

    await Promise.all([
      this.rfxItemRepository.update(rfxItemId, {
        isOpen: true,
        status: ERfxItemStatus.INVITATION_PREPARED,
      }),
      this.rfxBidInvitationRepository.delete({
        rfxItemId,
      }),
    ]);

    return true;
  }

  async acceptInvitation(rfxBidInvitationId: string, user: any) {
    const entityManager: EntityManager = this.request[ENTITY_MANAGER_KEY];

    const rfxProductInvitationRepo =
      entityManager.getRepository(RfxProductInvitation);

    const [registration, invitationExists] = await Promise.all([
      entityManager.getRepository(SolRegistration).findOne({
        where: {
          status: ESolRegistrationStatus.REGISTERED,
          vendorId: user.organization.id,
        },
        select: {
          id: true,
        },
      }),
      rfxProductInvitationRepo.exists({
        where: {
          id: rfxBidInvitationId,
        },
      }),
    ]);

    if (!invitationExists)
      throw new NotFoundException('RFQ Product invitation is not found');

    if (!registration)
      throw new NotFoundException('Solicitation Registration is not found');

    await rfxProductInvitationRepo.update(rfxBidInvitationId, {
      status: EInvitationStatus.ACCEPTED,
      solRegistrationId: registration.id,
    });
  }

  async withdrawInvitation(rfxBidInvitationId: string, user: any) {
    const rfxProductInvitation = await this.rfxBidInvitationRepository.findOne({
      where: {
        id: rfxBidInvitationId,
        rfxItem: {
          status: ERfxItemStatus.APPROVED,
          rfx: {
            solRegistrations: {
              vendorId: user.organization.id,
              status: ESolRegistrationStatus.REGISTERED,
            },
          },
        },
      },
      select: {
        id: true,
      },
    });

    if (!rfxProductInvitation)
      throw new NotFoundException('RFQ bid invitation not found');

    await this.rfxBidInvitationRepository.update(rfxBidInvitationId, {
      status: EInvitationStatus.WITHDRAWN,
    });

    return rfxProductInvitation;
  }

  async myRfxInvitations(rfxId: string, query: CollectionQuery, user: any) {
    const entityManager: EntityManager = this.request[ENTITY_MANAGER_KEY];

    const latestAward = await entityManager
      .getRepository(SolRoundAward)
      .findOne({
        where: {
          rfxItem: {
            rfxId,
          },
        },
        select: {
          id: true,
          createdAt: true,
        },
        order: {
          createdAt: 'DESC',
        },
      });

    const dataQuery = QueryConstructor.constructQuery<RfxProductInvitation>(
      this.rfxBidInvitationRepository,
      query,
    )
      .where('rfx_product_invitations.vendorId = :vendorId', {
        vendorId: user.organization.id,
      })
      .leftJoinAndSelect('rfx_product_invitations.rfxItem', 'rfxItems')
      .leftJoinAndSelect(
        'rfx_product_invitations.openedOffers',
        'openedOffers',
      );

    if (latestAward)
      dataQuery.leftJoinAndSelect(
        'rfxItems.solRoundAwards',
        'roundAwards',
        'roundAwards.id = :awardId',
        { awardId: latestAward.id },
      );

    // .andWhere('rfxes.status IN (:...status)', {
    //   status: [ERfxStatus.APPROVED, ERfxStatus.AUCTION, ERfxStatus.ENDED],
    // });

    return await this.giveQueryResponse<RfxProductInvitation>(query, dataQuery);
  }
  private async getRefinedProductCatalogues(
    productCatalogueIds: string[],
  ): Promise<any[]> {
    try {
      // return ProductCatalogue;
      const ADMINISTRATION_CATALOGUE_ENDPOINT =
        process.env.ADMINISTRATION_CATALOGUE_ENDPOINT ??
        'https://dev-bo.megp.peragosystems.com/administration/api/product-catalogs/details';

      const catalogueResponse = await axios.post(
        ADMINISTRATION_CATALOGUE_ENDPOINT,
        productCatalogueIds,
        {
          headers: {
            'x-api-key':
              process.env.API_KEY || '25bc1622e5fb42cca3d3e62e90a3a20f',
          },
        },
      );

      if (catalogueResponse.data.length == 0)
        throw new BadRequestException('products not found');

      this.refineProducts(productCatalogueIds, catalogueResponse.data);

      return catalogueResponse.data;
    } catch (error) {
      throw error;
    }
  }

  private refineProducts(
    productCatalogueIds: string[],
    productCatalogues: ProductCatalogueDto[],
  ) {
    const allCatalogueFound = productCatalogueIds.every((catalogueId) =>
      productCatalogues.some((catalogue) => catalogue.id == catalogueId),
    );

    if (!allCatalogueFound)
      throw new BadRequestException('not all product catalogues found');
  }

  private createInvitationFromCatalogue(
    catalogue: ProductCatalogueDto,
    rfxItemId: string,
  ) {
    const rfxProductInvitation = new RfxProductInvitation();

    rfxProductInvitation.rfxItemId = rfxItemId;
    rfxProductInvitation.catalogueSpecificationValues =
      catalogue.specifications;
    rfxProductInvitation.catalogueDeliveryValues = catalogue.deliveryValues;
    rfxProductInvitation.productCatalogueId = catalogue.id;
    rfxProductInvitation.vendorMetadata = catalogue.vendor;
    rfxProductInvitation.vendorId = catalogue.vendor?.id;
    rfxProductInvitation.catalogueImages = catalogue.productCatalogImages;

    return rfxProductInvitation;
  }
}
