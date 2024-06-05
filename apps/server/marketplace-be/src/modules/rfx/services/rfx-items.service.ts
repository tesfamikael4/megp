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
import { EInvitationStatus, ERfxItemStatus } from 'src/utils/enums';
import { In, Repository } from 'typeorm';
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

    const response = new DataResponseFormat<RFXItem>();
    if (query.count) {
      response.total = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      response.total = total;
      response.items = result;
    }
    return response;
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
}
