import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtraCrudService } from 'megp-shared-be';
import { RFXItem } from 'src/entities';
import { RfxOpenProduct } from 'src/entities/rfx-open-products.entity';
import { ERfxItemStatus } from 'src/utils/enums/rfx-items.enum';
import { Repository } from 'typeorm';
import {
  CreateRfxOpenProductDto,
  UpdateRfxOpenProductDto,
} from '../dtos/rfx-open-products.dto';
import { ERfxOpenProductsStatus } from 'src/utils/enums/rfx-open-products.enum';

@Injectable()
export class RfxOpenProductService extends ExtraCrudService<RfxOpenProduct> {
  constructor(
    @InjectRepository(RfxOpenProduct)
    private readonly rfxOpenProductRepository: Repository<RfxOpenProduct>,
    @InjectRepository(RFXItem)
    private readonly rfxItemRepository: Repository<RFXItem>,
  ) {
    super(rfxOpenProductRepository);
  }

  async create(itemData: CreateRfxOpenProductDto, req?: any) {
    const rfxItem = await this.rfxItemRepository.findOne({
      where: {
        id: itemData.rfxItemId,
        status: ERfxItemStatus.APPROVED,
        isOpen: true,
      },
    });

    if (!rfxItem) throw new NotFoundException('rfx_item_not_found');

    const rfxOpenProduct = this.rfxOpenProductRepository.create(itemData);
    await this.rfxOpenProductRepository.insert(rfxOpenProduct);

    return rfxOpenProduct;
  }

  async update(id: string, itemData: UpdateRfxOpenProductDto) {
    const rfxOpenProduct = await this.rfxOpenProductRepository.findOne({
      where: {
        id,
        status: ERfxOpenProductsStatus.DRAFT,
      },
      relations: {
        rfxItem: true,
      },
      select: {
        id: true,
        status: true,
        rfxItem: {
          id: true,
          status: true,
        },
      },
    });

    if (!rfxOpenProduct)
      throw new BadRequestException('no_draft_rfx_product_found');

    if (rfxOpenProduct.rfxItem.status !== ERfxItemStatus.APPROVED)
      throw new BadRequestException('can_not_update_rfx_open_product');

    const openProduct = this.rfxOpenProductRepository.create(itemData);
    await this.rfxOpenProductRepository.update(id, openProduct);
    return openProduct;
  }

  async submit(rfxItemProductId: string) {
    //  business logic?
  }
}
