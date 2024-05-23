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
import { RFX, RFXItem, RfxBidInvitation } from 'src/entities';
import { EntityManager, Repository, In, SelectQueryBuilder } from 'typeorm';
import { CreateRfxBidInvitationDto } from '../dtos/rfx-bid-invitaiton.dto';
import { ProductCatalogueDto } from '../dtos/product-catalogue.dto';
import {
  EInvitationStatus,
  ERfxItemStatus,
  ERfxStatus,
  ESolRegistrationStatus,
} from 'src/utils/enums';
import { REQUEST } from '@nestjs/core';
import { ProductCatalogue } from 'src/utils/mock/product-catalogues';

@Injectable()
export class RfxBidInvitationService extends ExtraCrudService<RfxBidInvitation> {
  constructor(
    @InjectRepository(RfxBidInvitation)
    private readonly rfxBidInvitationRepository: Repository<RfxBidInvitation>,
    @InjectRepository(RFXItem)
    private readonly rfxItemRepository: Repository<RFXItem>,
    @InjectRepository(RFX)
    private readonly rfxRepository: Repository<RFX>,
    @Inject(REQUEST) private readonly request: Request,
  ) {
    super(rfxBidInvitationRepository);
  }
  async myItemInvitations(
    query: CollectionQuery,
    rfxItemId: string,
    user: any,
  ) {
    const entityManager: EntityManager = this.request[ENTITY_MANAGER_KEY];

    const dataQuery = QueryConstructor.constructQuery<RfxBidInvitation>(
      entityManager.getRepository(RfxBidInvitation),
      query,
    )
      .leftJoin('rfx_bid_invitations.rfxItem', 'rfxItems')
      .where('rfxItems.id = :rfxItemId', { rfxItemId })
      .andWhere('rfxItems.status = :status', {
        status: ERfxItemStatus.APPROVED,
      })
      .andWhere('rfx_bid_invitations.vendorId = :vendorId', {
        vendorId: user.organization.id,
      });

    return await this.giveQueryResponse<RfxBidInvitation>(query, dataQuery);
  }

  async myRfxItemDetail(rfxItemId: string, user: any) {
    const rfxItem = await this.rfxItemRepository.findOne({
      where: {
        id: rfxItemId,
        bidInvitations: {
          vendorId: user.organization.id,
        },
      },
    });

    if (!rfxItem) throw new NotFoundException('Rfx item not found');

    return rfxItem;
  }

  async myRfxItems(query: CollectionQuery, rfxId: string, user: any) {
    const entityManager: EntityManager = this.request[ENTITY_MANAGER_KEY];

    const dataQuery = QueryConstructor.constructQuery<RFXItem>(
      entityManager.getRepository(RFXItem),
      query,
    )
      .leftJoin('rfx_items.rfx', 'rfxs')
      .where('rfxs.id = :rfxId', { rfxId })
      .andWhere('rfxs.status = :status', { status: ERfxStatus.APPROVED })
      .leftJoin('rfx_items.bidInvitations', 'bidInvitation')
      .andWhere('bidInvitation.vendorId = :vendorId', {
        vendorId: user.organization.id,
      });

    return await this.giveQueryResponse<RFXItem>(query, dataQuery);
  }

  async myRfxDetail(rfxId: string, user: any) {
    const rfx = await this.rfxRepository.findOne({
      where: {
        id: rfxId,
        status: ERfxStatus.APPROVED,
        items: {
          bidInvitations: {
            vendorId: user.organization.id,
          },
        },
      },
      relations: {
        rfxBidProcedure: true,
      },
    });

    if (!rfx) throw new NotFoundException('Rfx not found');

    return rfx;
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
      .where('rfxs.status = :status', { status: ERfxStatus.APPROVED })
      .leftJoinAndSelect('rfxs.items', 'rfxItems')
      .leftJoinAndSelect('rfxItems.bidInvitations', 'bidInvitation')
      .andWhere('bidInvitation.vendorId = :vendorId', {
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
          `can not invite a vendor of less quantity`,
        );

      const rfxBidInvitation = this.createInvitationFromCatalogue(
        catalogue,
        rfxItemId,
      );

      invitations.push(rfxBidInvitation);
    });

    const createdInvitations =
      this.rfxBidInvitationRepository.create(invitations);

    await Promise.all([
      // Previous invitations
      entityManager.getRepository(RfxBidInvitation).delete({
        rfxItemId: rfxItemId,
      }),
      entityManager.getRepository(RFXItem).update(rfxItemId, {
        isOpen: false,
        status: ERfxItemStatus.INVITATION_PREPARED,
      }),
    ]);

    await entityManager
      .getRepository(RfxBidInvitation)
      .insert(createdInvitations);

    // notify vendors

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

    if (!rfxItem) throw new BadRequestException('no rfx item found');

    if (rfxItem.status !== ERfxItemStatus.INVITATION_PREPARED)
      throw new BadRequestException('item has not invitation prepared');

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

  update(id: string, itemData: any): any {
    return false; // over ride invitation update
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
    const rfxBidInvitation = await this.rfxBidInvitationRepository.findOne({
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

    if (!rfxBidInvitation)
      throw new NotFoundException('RFQ bid invitation not found');

    await this.rfxBidInvitationRepository.update(rfxBidInvitationId, {
      status: EInvitationStatus.ACCEPTED,
    });

    return rfxBidInvitation;
  }

  async withdrawInvitation(rfxBidInvitationId: string, user: any) {
    const rfxBidInvitation = await this.rfxBidInvitationRepository.findOne({
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

    if (!rfxBidInvitation)
      throw new NotFoundException('RFQ bid invitation not found');

    await this.rfxBidInvitationRepository.update(rfxBidInvitationId, {
      status: EInvitationStatus.WITHDRAWN,
    });

    return rfxBidInvitation;
  }

  async myRfxInvitations(rfxId: string, query: CollectionQuery, user: any) {
    const dataQuery = QueryConstructor.constructQuery<RfxBidInvitation>(
      this.rfxBidInvitationRepository,
      query,
    )
      .where('rfx_bid_invitations.vendorId = :vendorId', {
        vendorId: user.organization.id,
      })
      .leftJoinAndSelect('rfx_bid_invitations.rfxItem', 'rfxItems')
      .leftJoin('rfxItems.rfx', 'rfxs')
      .andWhere('rfxs.id = :rfxId', { rfxId })
      .andWhere('rfxs.status = :status', { status: ERfxStatus.APPROVED });

    const response = new DataResponseFormat<RfxBidInvitation>();
    if (query.count) {
      response.total = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      response.total = total;
      response.items = result;
    }
    return response;
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
    const rfxBidInvitation = new RfxBidInvitation();

    rfxBidInvitation.rfxItemId = rfxItemId;
    rfxBidInvitation.catalogueSpecificationValues = catalogue.specifications;
    rfxBidInvitation.catalogueDeliveryValues = catalogue.deliveryValues;
    rfxBidInvitation.productCatalogueId = catalogue.id;
    rfxBidInvitation.vendorMetadata = catalogue.vendor;
    rfxBidInvitation.vendorId = catalogue.vendor?.id;
    rfxBidInvitation.catalogueImages = catalogue.productCatalogImages;

    return rfxBidInvitation;
  }
}
