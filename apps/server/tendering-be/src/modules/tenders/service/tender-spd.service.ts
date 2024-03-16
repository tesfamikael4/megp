import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Tender,
  Spd,
  Lot,
  TenderSpd,
  SpdQualification,
  SpdTechnicalScoring,
  SpdPreliminaryEvaluation,
  EqcQualification,
  EqcTechnicalScoring,
  EqcPreliminaryExamination,
} from 'src/entities';
import { ENTITY_MANAGER_KEY } from 'src/shared/interceptors';
import { ExtraCrudService } from 'src/shared/service';
import { EntityManager, DeepPartial, Repository } from 'typeorm';

@Injectable()
export class TenderSpdService extends ExtraCrudService<TenderSpd> {
  constructor(
    @InjectRepository(TenderSpd)
    private readonly tenderSpdRepository: Repository<TenderSpd>,
    @Inject(REQUEST) private request: Request,
  ) {
    super(tenderSpdRepository);
  }

  async create(itemData: DeepPartial<any>, req?: any): Promise<any> {
    if (req?.user?.organization) {
      itemData.organizationId = req.user.organization.id;
    }

    try {
      const manager: EntityManager = this.request[ENTITY_MANAGER_KEY];
      const tenderId = itemData.tenderId;
      const spdId = itemData.spdId;

      const entity = manager.getRepository(TenderSpd).create(itemData);
      await manager.getRepository(TenderSpd).insert(entity);

      const tender = await manager.getRepository(Tender).findOne({
        where: { id: tenderId },
        relations: { lots: true },
      });

      const spd = await manager.getRepository(Spd).findOne({
        where: { id: spdId },
        relations: {
          spdQualifications: true,
          spdTechnicalScores: true,
          spdPreliminaryEvaluations: true,
        },
      });

      const eqcQualificationPayload: EqcQualification[] = [];
      const eqcTechnicalScoringPayload: EqcTechnicalScoring[] = [];
      const eqcPreliminaryExaminationPayload: EqcPreliminaryExamination[] = [];
      tender.lots.forEach((lot: Lot) => {
        spd.spdQualifications.forEach((qualification: SpdQualification) => {
          const eqcQualification = new EqcQualification();
          eqcQualification.lotId = lot.id;
          eqcQualification.spdQualificationId = qualification.id;
          eqcQualification.category = qualification.category;
          eqcQualification.requirement = qualification.requirement;
          eqcQualification.factor = qualification.factor;
          eqcQualification.formLink = qualification.formLink;
          eqcQualification.itbReference = qualification.itbReference;
          eqcQualification.itbDescription = qualification.itbDescription;
          eqcQualification.order = 0;
          eqcQualification.isRequired = false;
          eqcQualification.singleEntityCondition = {};
          eqcQualification.jvEachPartnerCondition = {};
          eqcQualification.jvCombinedPartnerCondition = {};
          eqcQualification.jvAtleastOnePartnerCondition = {
            value: 'Must meet',
            additionalRequirements: '',
          };

          eqcQualificationPayload.push(eqcQualification);
        });

        spd.spdTechnicalScores.forEach((scoring: SpdTechnicalScoring) => {
          const eqcTechnicalScoring = new EqcTechnicalScoring();
          eqcTechnicalScoring.lotId = lot.id;
          eqcTechnicalScoring.spdTechnicalScoringId = scoring.id;
          eqcTechnicalScoring.spdTechnicalScoringParentId = scoring.parentId;
          eqcTechnicalScoring.requirement = scoring.requirement;
          eqcTechnicalScoring.formLink = scoring.formLink;
          eqcTechnicalScoring.isProfessional = scoring.isProfessional;
          eqcTechnicalScoring.hasProfessional = false;
          eqcTechnicalScoring.point = 0;
          eqcTechnicalScoring.isRequired = false;
          eqcTechnicalScoring.validation = scoring.validation;
          eqcTechnicalScoring.requirementCondition = 'Must meet';

          eqcTechnicalScoringPayload.push(eqcTechnicalScoring);
        });

        spd.spdPreliminaryEvaluations.forEach(
          (evaluation: SpdPreliminaryEvaluation) => {
            const eqcPreliminaryExamination = new EqcPreliminaryExamination();
            eqcPreliminaryExamination.lotId = lot.id;
            eqcPreliminaryExamination.spdEqcPreliminaryExaminationId =
              evaluation.id;
            eqcPreliminaryExamination.criteria = evaluation.criteria;
            eqcPreliminaryExamination.type = evaluation.type;
            eqcPreliminaryExamination.formLink = evaluation.formLink;
            eqcPreliminaryExamination.itbReference = evaluation.itbReference;
            eqcPreliminaryExamination.itbDescription =
              evaluation.itbDescription;
            eqcPreliminaryExamination.order = 0;
            eqcPreliminaryExamination.isRequired = false;
            eqcPreliminaryExamination.requirementCondition = 'Must meet';

            eqcPreliminaryExaminationPayload.push(eqcPreliminaryExamination);
          },
        );
      });

      await manager
        .getRepository(EqcQualification)
        .insert(eqcQualificationPayload);

      await manager
        .getRepository(EqcTechnicalScoring)
        .insert(eqcTechnicalScoringPayload);

      await manager
        .getRepository(EqcPreliminaryExamination)
        .insert(eqcPreliminaryExaminationPayload);

      return entity;
    } catch (e) {
      throw e;
    }
  }

  async findOne(tenderId: string, req?: any): Promise<TenderSpd | undefined> {
    return await this.tenderSpdRepository.findOneBy({ tenderId });
  }
}
