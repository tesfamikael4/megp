import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Item, Lot, Tender } from 'src/entities';
import { ENTITY_MANAGER_KEY } from 'src/shared/interceptors';
import { ExtraCrudService } from 'src/shared/service';
import { EntityManager, In, Repository } from 'typeorm';
import { ReAdvertiseLotDto, SplitItemDto } from '../dto';
import {
  CollectionQuery,
  FilterOperators,
  QueryConstructor,
} from 'src/shared/collection-query';
import { DataResponseFormat } from 'src/shared/api-data';
import {
  LotStatusEnum,
  TenderStatusEnum,
} from 'src/shared/enums/tender-status.enum';
import { TenderMilestoneEnum } from 'src/shared/enums/tender-milestone.enum';
import { TenderMilestone } from 'src/entities/tender-milestone.entity';

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
          status: LotStatusEnum.ACTIVE,
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
      status: LotStatusEnum.CANCELED,
    });
  }

  async reAdvertiseLot(payload: ReAdvertiseLotDto) {
    const lot = await this.lotRepository.findOne({
      where: {
        id: payload.id,
      },
      relations: {
        tender: {
          procurementMechanism: true,
          procurementTechnicalTeams: true,
        },
        items: true,
      },
    });
    if (!lot) {
      throw new BadRequestException('lot_not_found');
    } else if (lot.status != LotStatusEnum.CANCELED) {
      throw new BadRequestException('active_lot_cannot_re_advertise');
    }

    const manager: EntityManager = this.request[ENTITY_MANAGER_KEY];

    const budgetAmount = lot.items.reduce(
      (total, item) => item.quantity * item.estimatedPrice + total,
      0,
    );

    const newTender = manager.getRepository(Tender).create({
      ...lot.tender,
      id: undefined,
      name: payload.name,
      status: TenderStatusEnum.DRAFT,
      tenderDocument: null,
      tenderInvitation: null,
      budgetAmount,
      procurementMechanism: {
        ...lot.tender.procurementMechanism,
        tenderId: undefined,
        id: undefined,
      },
      procurementTechnicalTeams: lot?.tender?.procurementTechnicalTeams?.map(
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
          items: lot?.items?.map((item) => {
            return {
              ...item,
              lotId: undefined,
              id: undefined,
            };
          }),
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

    await manager.getRepository(Lot).update({ id: lot.id }, { status: LotStatusEnum.RE_ADVERTISED });

    return newTender;
  }
}
