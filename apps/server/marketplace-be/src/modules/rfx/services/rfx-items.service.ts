import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CollectionQuery,
  DataResponseFormat,
  ExtraCrudOptions,
  ExtraCrudService,
  FilterOperators,
  QueryConstructor,
} from 'megp-shared-be';
import { RFXItem } from 'src/entities';
import { ERfxItemStatus } from 'src/utils/enums';
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

    if (!rfxItem) throw new NotFoundException('draft rfx item not found');

    if (rfxItem.bidInvitations.length == 0 && !rfxItem.isOpen)
      throw new BadRequestException('rfx bid invitation not found');

    rfxItem.status = ERfxItemStatus.SUBMITTED;

    await this.repositoryRFXItem.update(id, {
      status: ERfxItemStatus.SUBMITTED,
    });

    return rfxItem;
  }
}
