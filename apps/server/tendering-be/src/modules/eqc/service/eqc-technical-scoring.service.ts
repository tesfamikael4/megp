import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import {
  EqcTechnicalScoring,
  SpdProfessionalSetting,
  SpdTechnicalScoring,
  TenderPersonal,
  TenderSpd,
} from 'src/entities';
import { ENTITY_MANAGER_KEY } from 'src/shared/interceptors';
import { ExtraCrudService } from 'src/shared/service';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class EqcTechnicalScoringService extends ExtraCrudService<EqcTechnicalScoring> {
  constructor(
    @InjectRepository(EqcTechnicalScoring)
    private readonly eqcTechnicalScoringRepository: Repository<EqcTechnicalScoring>,
    @Inject(REQUEST) private request: Request,
  ) {
    super(eqcTechnicalScoringRepository);
  }

  async update(id: string, itemData: any): Promise<EqcTechnicalScoring> {
    try {
      const manager: EntityManager = this.request[ENTITY_MANAGER_KEY];
      const item = await manager
        .getRepository(EqcTechnicalScoring)
        .findOneOrFail({
          where: { id },
          relations: ['children', 'lot'],
        });

      await manager
        .getRepository(EqcTechnicalScoring)
        .update(item.id, itemData);
      const entity: EqcTechnicalScoring = { ...item, ...itemData };

      if (item.point === entity.point) {
        return entity;
      }

      if (item.children.length) {
        const eqcTechnicalScoringChildren: EqcTechnicalScoring[] = [];
        item.children.forEach(
          async (eqcTechnicalScoringChild: EqcTechnicalScoring) => {
            eqcTechnicalScoringChild.point = 0;

            if (eqcTechnicalScoringChild.hasProfessional) {
              const validation = {
                min:
                  (eqcTechnicalScoringChild.validation?.min ??
                    0 * entity.point) / 100,
                max:
                  (eqcTechnicalScoringChild.validation?.max ??
                    0 * entity.point) / 100,
              };

              eqcTechnicalScoringChild.validation = validation;
            }

            eqcTechnicalScoringChildren.push(eqcTechnicalScoringChild);
          },
        );

        await manager
          .getRepository(EqcTechnicalScoring)
          .upsert(eqcTechnicalScoringChildren, ['id']);

        return entity;
      }

      if (entity.isProfessional) {
        return this.isProfessional(manager, entity);
      }

      if (entity.hasProfessional) {
        return this.hasProfessional(manager, entity);
      }

      return this.createChildren(manager, entity);
    } catch (e) {
      throw e;
    }
  }

  private async isProfessional(
    manager: EntityManager,
    entity: EqcTechnicalScoring,
  ): Promise<EqcTechnicalScoring> {
    const tenderPersonals = await manager
      .getRepository(TenderPersonal)
      .findBy({ tenderId: entity.lot.tenderId });

    const eqcTechnicalScores: EqcTechnicalScoring[] = [];
    tenderPersonals.forEach((tenderPersonal: TenderPersonal) => {
      const eqcTechnicalScoring = new EqcTechnicalScoring();
      eqcTechnicalScoring.lotId = entity.lotId;
      eqcTechnicalScoring.parentId = entity.id;
      eqcTechnicalScoring.spdTechnicalScoringId = tenderPersonal.id;
      eqcTechnicalScoring.requirement = tenderPersonal.position;
      eqcTechnicalScoring.formLink = entity.formLink;
      eqcTechnicalScoring.isProfessional = false;
      eqcTechnicalScoring.hasProfessional = true;
      eqcTechnicalScoring.point = 0;
      eqcTechnicalScoring.isRequired = true;
      eqcTechnicalScoring.validation = { min: 0, max: entity.point };
      eqcTechnicalScoring.requirementCondition = 'Must meet';

      eqcTechnicalScores.push(eqcTechnicalScoring);
    });

    await manager.getRepository(EqcTechnicalScoring).insert(eqcTechnicalScores);

    return entity;
  }

  private async hasProfessional(
    manager: EntityManager,
    entity: EqcTechnicalScoring,
  ): Promise<EqcTechnicalScoring> {
    const tenderSpd = await manager
      .getRepository(TenderSpd)
      .findOneOrFail({ where: { tenderId: entity.lot.tenderId } });
    const spdProfessionalSettings = await manager
      .getRepository(SpdProfessionalSetting)
      .findBy({ spdId: tenderSpd.spdId });

    const eqcTechnicalScores: EqcTechnicalScoring[] = [];
    spdProfessionalSettings.forEach(
      (spdProfessionalSetting: SpdProfessionalSetting) => {
        const eqcTechnicalScoring = new EqcTechnicalScoring();
        eqcTechnicalScoring.lotId = entity.lotId;
        eqcTechnicalScoring.parentId = entity.id;
        eqcTechnicalScoring.spdTechnicalScoringId = spdProfessionalSetting.id;
        eqcTechnicalScoring.requirement = spdProfessionalSetting.requirement;
        eqcTechnicalScoring.formLink = spdProfessionalSetting.formLink;
        eqcTechnicalScoring.isProfessional = false;
        eqcTechnicalScoring.hasProfessional = false;
        eqcTechnicalScoring.point = 0;
        eqcTechnicalScoring.isRequired = true;

        const validation = {
          min:
            (spdProfessionalSetting.validation?.min ?? 0 * entity.point) / 100,
          max:
            (spdProfessionalSetting.validation?.max ?? 0 * entity.point) / 100,
        };

        eqcTechnicalScoring.validation = validation;
        eqcTechnicalScoring.requirementCondition = 'Must meet';

        eqcTechnicalScores.push(eqcTechnicalScoring);
      },
    );

    await manager.getRepository(EqcTechnicalScoring).insert(eqcTechnicalScores);

    return entity;
  }

  private async createChildren(
    manager: EntityManager,
    entity: EqcTechnicalScoring,
  ): Promise<EqcTechnicalScoring> {
    const spdTechnicalScoring = await manager
      .getRepository(SpdTechnicalScoring)
      .findOneOrFail({
        where: { id: entity.spdTechnicalScoringId },
        relations: ['children'],
      });

    const eqcTechnicalScores: EqcTechnicalScoring[] = [];
    spdTechnicalScoring.children.forEach(
      (spdTechnicalScoringChild: SpdTechnicalScoring) => {
        const eqcTechnicalScoring = new EqcTechnicalScoring();
        eqcTechnicalScoring.lotId = entity.lotId;
        eqcTechnicalScoring.parentId = entity.id;
        eqcTechnicalScoring.spdTechnicalScoringId = spdTechnicalScoringChild.id;
        eqcTechnicalScoring.spdTechnicalScoringParentId =
          spdTechnicalScoringChild.parentId;
        eqcTechnicalScoring.requirement = spdTechnicalScoringChild.requirement;
        eqcTechnicalScoring.formLink = spdTechnicalScoringChild.formLink;
        eqcTechnicalScoring.isProfessional =
          spdTechnicalScoringChild.isProfessional;
        eqcTechnicalScoring.hasProfessional = false;
        eqcTechnicalScoring.point = 0;
        eqcTechnicalScoring.isRequired = false;
        eqcTechnicalScoring.validation = { min: 0, max: entity.point };
        eqcTechnicalScoring.requirementCondition = 'Must meet';

        eqcTechnicalScores.push(eqcTechnicalScoring);
      },
    );

    await manager.getRepository(EqcTechnicalScoring).insert(eqcTechnicalScores);

    return entity;
  }
}
