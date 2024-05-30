import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from 'src/entities/tender-item.entity';
import {
  ItemStatusEnum,
  LotStatusEnum,
  TenderStatusEnum,
} from 'src/shared/enums/tender-status.enum';
import { ExtraCrudService } from 'src/shared/service';
import { EntityManager, Repository } from 'typeorm';
import { ReAdvertiseItemDto } from '../dto';
import { ENTITY_MANAGER_KEY } from 'src/shared/interceptors';
import { REQUEST } from '@nestjs/core';
import { Tender } from 'src/entities';
import { TenderMilestone } from 'src/entities/tender-milestone.entity';
import { TenderMilestoneEnum } from 'src/shared/enums/tender-milestone.enum';

@Injectable()
export class ItemService extends ExtraCrudService<Item> {
  constructor(
    @InjectRepository(Item)
    private readonly ItemRepository: Repository<Item>,
    @Inject(REQUEST) private request: Request,
  ) {
    super(ItemRepository);
  }

  async softDelete(id: string, req?: any): Promise<void> {
    const item = await this.findOneOrFail(id);
    await this.ItemRepository.update(item.id, {
      status: ItemStatusEnum.CANCELED,
    });
  }

  async reAdvertiseItem(payload: ReAdvertiseItemDto) {
    const item = await this.ItemRepository.findOne({
      where: { id: payload.id },
      relations: {
        lot: {
          tender: {
            procurementMechanism: true,
            procurementTechnicalTeams: true,
          },
        },
      },
    });
    if (!item) {
      throw new BadRequestException('item_not_found');
    } else if (item.status != ItemStatusEnum.CANCELED) {
      throw new BadRequestException('active_item_cannot_re_advertise');
    }

    const manager: EntityManager = this.request[ENTITY_MANAGER_KEY];

    const budgetAmount = item.quantity * item.estimatedPrice;

    const newTender = manager.getRepository(Tender).create({
      ...item.lot.tender,
      id: undefined,
      name: payload.name,
      status: TenderStatusEnum.DRAFT,
      tenderDocument: null,
      tenderInvitation: null,
      budgetAmount,
      procurementMechanism: {
        ...item.lot.tender.procurementMechanism,
        tenderId: undefined,
        id: undefined,
      },
      procurementTechnicalTeams:
        item.lot?.tender?.procurementTechnicalTeams?.map(
          (procurementTechnicalTeam) => {
            return {
              ...procurementTechnicalTeam,
              tenderId: undefined,
              id: undefined,
            };
          },
        ),
      lots: [
        {
          number: 1,
          name: `Lot 1`,
          status: LotStatusEnum.ACTIVE,
          items: [
            {
              ...item,
              status: ItemStatusEnum.ACTIVE,
              lotId: undefined,
              id: undefined,
            },
          ],
        },
      ],
    });

    await manager.getRepository(Tender).save(newTender);

    await manager.getRepository(TenderMilestone).insert({
      tenderId: newTender.id,
      lotId: newTender.lots.find((lot) => lot.number).id,
      isCurrent: true,
      milestoneNum: TenderMilestoneEnum.Initiation,
      milestoneTxt: 'Initiation',
    });

    await manager
      .getRepository(Item)
      .update({ id: item.id }, { status: LotStatusEnum.RE_ADVERTISED });

    return newTender;
  }
}
