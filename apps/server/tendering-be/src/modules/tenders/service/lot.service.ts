import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Item, Lot } from 'src/entities';
import { ENTITY_MANAGER_KEY } from 'src/shared/interceptors';
import { ExtraCrudService } from 'src/shared/service';
import { EntityManager, In, Repository } from 'typeorm';
import { SplitItemDto } from '../dto';
import {
  CollectionQuery,
  FilterOperators,
  QueryConstructor,
} from 'src/shared/collection-query';
import { DataResponseFormat } from 'src/shared/api-data';

@Injectable()
export class LotService extends ExtraCrudService<Lot> {
  constructor(
    @InjectRepository(Lot)
    private readonly lotRepository: Repository<Lot>,
    @Inject(REQUEST) private request: Request,
  ) {
    super(lotRepository);
  }

  async findOne(id: any, req?: any) {
    return await this.lotRepository.findOne({
      where: { id },
      relations: {
        bdsBidSecurity: true,
      },
    });
  }

  async splitItems(itemData: SplitItemDto, req?: any): Promise<any> {
    try {
      const manager: EntityManager = this.request[ENTITY_MANAGER_KEY];
      const itemIds = itemData.itemIds;

      if (!itemData?.lotId) {
        const lotCount = await this.lotRepository.findOne({
          where: {
            tenderId: itemData.tenderId,
          },
          order: {
            number: 'DESC',
          },
        });

        const lot = this.lotRepository.create({
          number: lotCount.number + 1,
          name: itemData.name,
          status: `DRAFT`,
          tenderId: itemData.tenderId,
        });
        await manager.getRepository(Lot).insert(lot);

        itemData.lotId = lot.id;
      }

      const items = await manager
        .getRepository(Item)
        .update({ id: In(itemIds) }, { lotId: itemData.lotId });

      return items.affected;
    } catch (e) {
      throw e;
    }
  }

  async getAssignedLot(tenderId: string, query: CollectionQuery, req?: any) {
    query.where.push([
      {
        column: 'tenderId',
        value: tenderId,
        operator: FilterOperators.EqualTo,
      },
    ]);

    const manager: EntityManager = this.request[ENTITY_MANAGER_KEY];

    const dataQuery = QueryConstructor.constructQuery<Lot>(
      manager.getRepository(Lot),
      query,
    )
      .leftJoin('lots.teams', 'teams')
      .leftJoin('teams.teamMembers', 'teamMembers')
      .leftJoin('lots.tender', 'tender')
      .andWhere('teamMembers.personnelId = :personnelId', {
        personnelId: req.user.userId,
      })
      .andWhere('tender.organizationId = :organizationId', {
        organizationId: req.user.organization.id,
      });

    const response = new DataResponseFormat<Lot>();
    if (query.count) {
      response.total = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      response.total = total;
      response.items = result;
    }
    return response;
  }

  async softDelete(id: string, req?: any): Promise<void> {
    const item = await this.findOneOrFail(id);
    await this.lotRepository.update(item.id, {
      status: 'RE_ADVERTISE',
    });
  }
}
