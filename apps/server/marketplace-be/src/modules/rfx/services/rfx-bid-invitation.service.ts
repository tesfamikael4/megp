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
import { EntityManager, Repository, In } from 'typeorm';
import { CreateRfxBidInvitationDto } from '../dtos/rfx-bid-invitaiton.dto';
import { ProductCatalogueDto } from '../dtos/product-catalogue.dto';
import { ERfxItemStatus, ERfxStatus } from 'src/utils/enums';
import { REQUEST } from '@nestjs/core';
import { ProductCatalogue } from 'src/utils/mock/product-catalogues';

@Injectable()
export class RfxBidInvitationService extends ExtraCrudService<RfxBidInvitation> {
  constructor(
    @InjectRepository(RfxBidInvitation)
    private readonly rfxBidInvitationRepository: Repository<RfxBidInvitation>,
    @InjectRepository(RFXItem)
    private readonly rfxItemRepository: Repository<RFXItem>,
    @Inject(REQUEST) private readonly request: Request,
  ) {
    super(rfxBidInvitationRepository);
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

  async myRfxDetail(rfxId: string, user: any) {
    const rfxItems = await this.rfxItemRepository.find({
      where: {
        rfxId,
        status: ERfxItemStatus.APPROVED,
        bidInvitations: {
          vendorId: user.organization.id,
        },
      },
    });

    if (rfxItems.length == 0) throw new NotFoundException('RFQ Item not found');

    return rfxItems;
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

    // Select Open RFXes
    const response = new DataResponseFormat<RFX>();
    if (query.count) {
      response.total = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      response.total = total;
      response.items = result;
    }
    return response;
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
        status: In([ERfxItemStatus.DRAFT, ERfxItemStatus.INVITATION_PREPARED]),
      },
      select: {
        id: true,
        status: true,
      },
    });

    if (!rfxItem) throw new BadRequestException('no rfx item found');

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

  private async getRefinedProductCatalogues(
    productCatalogueIds: string[],
  ): Promise<any[]> {
    try {
      return ProductCatalogue;
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
    rfxBidInvitation.catalogueSpecificationValues =
      catalogue.specificationValues;
    rfxBidInvitation.catalogueDeliveryValues = catalogue.deliveryValues;
    rfxBidInvitation.productCatalogueId = catalogue.id;
    rfxBidInvitation.vendorMetadata = catalogue.vendor;
    rfxBidInvitation.vendorId = catalogue.vendor?.id;
    rfxBidInvitation.catalogueImages = catalogue.productCatalogImages;

    return rfxBidInvitation;
  }
}
