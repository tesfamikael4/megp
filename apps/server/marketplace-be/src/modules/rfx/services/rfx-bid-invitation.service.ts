import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { ENTITY_MANAGER_KEY, ExtraCrudService } from 'megp-shared-be';
import { RFXItem, RfxBidInvitation } from 'src/entities';
import { EntityManager, Repository } from 'typeorm';
import { CreateRfxBidInvitationDto } from '../dtos/rfx-bid-invitaiton.dto';
import { ProductCatalogueDto } from '../dtos/product-catalogue.dto';
import { EInvitationStatus } from 'src/utils/enums/rfx-invitation.enum';
import { ERfxItemStatus } from 'src/utils/enums/rfx-items.enum';
import { REQUEST } from '@nestjs/core';
import { EWorkflowResponseStatus } from 'src/utils/enums/workflow-response.enum';
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

  async inviteSelected(rfxItemId: string, itemData: CreateRfxBidInvitationDto) {
    const entityManager: EntityManager = this.request[ENTITY_MANAGER_KEY];

    const [rfxItem, productCatalogues] = await Promise.all([
      this.rfxItemRepository.findOne({
        where: {
          id: rfxItemId,
          status: ERfxItemStatus.DRAFT,
        },
      }),
      this.getRefinedProductCatalogues(itemData.productCatalogueIds),
    ]);

    if (!rfxItem) throw new NotFoundException('draft_rfx_item_not_found');

    const invitations = [];
    productCatalogues.forEach((catalogue: ProductCatalogueDto) => {
      if (catalogue.quantity < rfxItem.quantity)
        throw new BadRequestException(
          `can_not_invite_a_vendor_of_less_quantity`,
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
        status: ERfxItemStatus.DRAFT,
      },
      select: {
        id: true,
        status: true,
      },
    });

    if (!rfxItem) throw new BadRequestException('no_rfx_item_found');

    if (rfxItem.status !== ERfxItemStatus.DRAFT)
      throw new BadRequestException('rfx_item_already_submitted');

    await this.rfxBidInvitationRepository.delete({
      rfxItemId,
    });
  }

  update(id: string, itemData: any): any {
    return false; // over ride invitation update
  }

  async makeOpenInvitation(rfxItemId: string) {
    const rfxItem = await this.rfxItemRepository.findOne({
      where: {
        id: rfxItemId,
        status: ERfxItemStatus.DRAFT,
      },
      select: {
        id: true,
        status: true,
      },
    });

    if (!rfxItem) throw new BadRequestException('no_rfx_item_found');

    await Promise.all([
      this.rfxItemRepository.update(rfxItemId, {
        isOpen: true,
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
      // const productCatalogue = ProductCatalogue.filter((product: any) =>
      //   productCatalogueIds.includes(product.id),
      // );

      // if (productCatalogue.length == 0)
      //   throw new BadRequestException('product_catalogue_not_found');

      // return productCatalogue;

      const ADMINISTRATION_CATALOGUE_ENDPOINT =
        process.env.ADMINISTRATION_CATALOGUE_ENDPOINT ??
        'https://dev-bo.megp.peragosystems.com/administration/api/product-catalogs/details';

      const catalogueResponse = await axios.post(
        ADMINISTRATION_CATALOGUE_ENDPOINT,
        {
          headers: {
            'x-api-key':
              process.env.API_KEY || '25bc1622e5fb42cca3d3e62e90a3a20f',
          },
          body: JSON.stringify({
            productCatalogueIds,
          }),
        },
      );

      if (catalogueResponse.data.length == 0)
        throw new BadRequestException('products_not_found');

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
      throw new BadRequestException('not_all_product_catalogues_found');
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
