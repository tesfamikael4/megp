import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Item, Lot } from 'src/entities';
import { ENTITY_MANAGER_KEY } from 'src/shared/interceptors';
import { ExtraCrudService } from 'src/shared/service';
import { DeepPartial, EntityManager, Repository } from 'typeorm';

@Injectable()
export class LotService extends ExtraCrudService<Lot> {
  constructor(
    @InjectRepository(Lot)
    private readonly lotRepository: Repository<Lot>,
    @Inject(REQUEST) private request: Request,
  ) {
    super(lotRepository);
  }

  async splitItems(itemData: DeepPartial<any>, req?: any): Promise<any> {
    try {
      const manager: EntityManager = this.request[ENTITY_MANAGER_KEY];
      const itemIds = itemData.itemIds;

      if (itemData?.lotId) {
        const lot = await manager
          .getRepository(Lot)
          .findOneOrFail({ where: { id: itemData?.lotId } });
        const items = await manager
          .getRepository(Item)
          .update({ id: itemIds }, { lotId: lot.id });

        return items.affected;
      }

      const item = await manager.getRepository(Item).findOneOrFail({
        where: { id: itemIds[0] },
        relations: { lot: true },
      });

      const time = new Date().getTime();
      const lot = new Lot();
      lot.number = 1;
      lot.name = `lot_${time}`;
      lot.status = `lot_${time}`;
      lot.tenderId = item.lot.tenderId;

      const lotResult = await manager.getRepository(Lot).insert(lot);
      const items = await manager
        .getRepository(Item)
        .update({ id: itemIds }, { lotId: lotResult.identifiers[0].id });

      return items.affected;
    } catch (e) {
      throw e;
    }
  }
}
