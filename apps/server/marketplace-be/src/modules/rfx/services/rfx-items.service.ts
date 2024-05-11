import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtraCrudService } from 'megp-shared-be';
import { RFXItem } from 'src/entities';
import { ERfxItemStatus } from 'src/utils/enums/rfx-items.enum';
import { ERfxStatus } from 'src/utils/enums/rfx.enums';
import { Repository } from 'typeorm';
import { RfxService } from './rfx.service';

@Injectable()
export class RFXItemService extends ExtraCrudService<RFXItem> {
  constructor(
    @InjectRepository(RFXItem)
    private readonly repositoryRFXItem: Repository<RFXItem>,
    private readonly rfxService: RfxService,
  ) {
    super(repositoryRFXItem);
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

  async submit(id: string) {
    const rfxItem = await this.repositoryRFXItem.findOne({
      where: {
        id,
        status: ERfxItemStatus.DRAFT,
      },
      relations: {
        bidInvitations: true,
      },
      select: {
        id: true,
        isOpen: true,
        status: true,
      },
    });

    if (!rfxItem) throw new NotFoundException('draft_rfx_item_not_found');

    if (rfxItem.bidInvitations.length == 0 && !rfxItem.isOpen)
      throw new BadRequestException('rfx_bid_invitation_not_found');

    rfxItem.status = ERfxItemStatus.SUBMITTED;

    await this.repositoryRFXItem.update(id, {
      status: ERfxItemStatus.SUBMITTED,
    });

    return rfxItem;
  }
}
