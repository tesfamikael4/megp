import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Spd,
  Lot,
  TenderSpd,
  SpdQualification,
  SpdTechnicalScoring,
  SpdPreliminaryEvaluation,
  EqcQualification,
  EqcTechnicalScoring,
  EqcPreliminaryExamination,
  EqcDocumentaryEvidence,
  SpdDocumentaryEvidence,
} from 'src/entities';
import { DocxService } from 'src/shared/docx/docx.service';
import { ENTITY_MANAGER_KEY } from 'src/shared/interceptors';
import { BucketNameEnum, MinIOService } from 'src/shared/min-io';
import { ExtraCrudService } from 'src/shared/service';
import { EntityManager, DeepPartial, Repository, In } from 'typeorm';

@Injectable()
export class TenderSpdService extends ExtraCrudService<TenderSpd> {
  constructor(
    @InjectRepository(TenderSpd)
    private readonly tenderSpdRepository: Repository<TenderSpd>,
    private readonly docxService: DocxService,
    private readonly minIOService: MinIOService,
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
      let entity = await manager
        .getRepository(TenderSpd)
        .findOneBy({ tenderId: itemData.tenderId });

      if (entity && entity.spdId === itemData.spdId) {
        return entity;
      }

      const lots = await manager
        .getRepository(Lot)
        .findBy({ tenderId: itemData.tenderId });

      if (!lots.length) {
        throw new NotFoundException(`not_found`);
      }

      const lotIds = lots.map((lot) => lot.id);
      const spd = await manager.getRepository(Spd).findOne({
        where: { id: itemData.spdId },
        relations: [
          'spdQualifications',
          'spdTechnicalScores',
          'spdPreliminaryEvaluations',
          'spdDocumentaryEvidences',
        ],
      });

      if (!spd) {
        throw new NotFoundException(`not_found`);
      }

      if (!entity) {
        [entity] = manager.getRepository(TenderSpd).create(itemData);
        await manager.getRepository(TenderSpd).insert(entity);
        await this.createEqc(manager, lotIds, spd);

        return entity;
      }

      await manager
        .getRepository(TenderSpd)
        .update(entity.id, { spdId: itemData.spdId });
      await manager
        .getRepository(EqcQualification)
        .delete({ lotId: In(lotIds) });
      await manager
        .getRepository(EqcTechnicalScoring)
        .delete({ lotId: In(lotIds) });
      await manager
        .getRepository(EqcPreliminaryExamination)
        .delete({ lotId: In(lotIds) });
      await manager
        .getRepository(EqcDocumentaryEvidence)
        .delete({ lotId: In(lotIds) });
      await this.createEqc(manager, lotIds, spd);

      return entity;
    } catch (e) {
      throw e;
    }
  }

  async findOne(tenderId: string, req?: any): Promise<TenderSpd | undefined> {
    return await this.tenderSpdRepository.findOneBy({ tenderId });
  }

  async uploadBds(tenderId: string, file: Express.Multer.File) {
    const tender = await this.tenderSpdRepository.findOneBy({ tenderId });

    const result = await this.docxService.validateDocument(file.buffer, [
      'public_body',
    ]);

    if (result.length != 0) {
      throw new BadRequestException(result);
    }

    const bds = await this.minIOService.upload(file, BucketNameEnum.TENDER_BDS);

    await this.tenderSpdRepository.update(tender.id, { bds });

    return {
      ...tender,
      bds,
    };
  }

  async uploadScc(tenderId: string, file: Express.Multer.File) {
    const tender = await this.tenderSpdRepository.findOneBy({ tenderId });

    const result = await this.docxService.validateDocument(file.buffer, [
      'public_body',
    ]);

    if (result.length != 0) {
      throw new BadRequestException(result);
    }

    const scc = await this.minIOService.upload(file, BucketNameEnum.TENDER_BDS);

    await this.tenderSpdRepository.update(tender.id, { scc });

    return {
      ...tender,
      scc,
    };
  }

  private async createEqc(
    manager: EntityManager,
    lotIds: string[],
    spd: Spd,
  ): Promise<void> {
    const eqcQualificationPayload: EqcQualification[] = [];
    const eqcTechnicalScoringPayload: EqcTechnicalScoring[] = [];
    const eqcPreliminaryExaminationPayload: EqcPreliminaryExamination[] = [];
    const eqcDocumentaryEvidencePayload: EqcDocumentaryEvidence[] = [];
    lotIds.forEach((lotId: string) => {
      spd.spdQualifications.forEach((qualification: SpdQualification) => {
        const eqcQualification = new EqcQualification();
        eqcQualification.lotId = lotId;
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

      spd.spdTechnicalScores
        .filter((scoring: SpdTechnicalScoring) => scoring.parentId === null)
        .forEach((scoring: SpdTechnicalScoring) => {
          const eqcTechnicalScoring = new EqcTechnicalScoring();
          eqcTechnicalScoring.lotId = lotId;
          eqcTechnicalScoring.spdTechnicalScoringId = scoring.id;
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
          eqcPreliminaryExamination.lotId = lotId;
          eqcPreliminaryExamination.spdEqcPreliminaryExaminationId =
            evaluation.id;
          eqcPreliminaryExamination.criteria = evaluation.criteria;
          eqcPreliminaryExamination.type = evaluation.type;
          eqcPreliminaryExamination.formLink = evaluation.formLink;
          eqcPreliminaryExamination.itbReference = evaluation.itbReference;
          eqcPreliminaryExamination.itbDescription = evaluation.itbDescription;
          eqcPreliminaryExamination.order = 0;
          eqcPreliminaryExamination.isRequired = false;
          eqcPreliminaryExamination.requirementCondition = 'Must meet';

          eqcPreliminaryExaminationPayload.push(eqcPreliminaryExamination);
        },
      );

      spd.spdDocumentaryEvidences.forEach(
        (evidence: SpdDocumentaryEvidence) => {
          const eqcDocumentaryEvidence = new EqcDocumentaryEvidence();
          eqcDocumentaryEvidence.lotId = lotId;
          eqcDocumentaryEvidence.spdDocumentaryEvidenceId = evidence.id;
          eqcDocumentaryEvidence.checkOnFirstCompliance =
            evidence.checkOnFirstCompliance;
          eqcDocumentaryEvidence.checkOnFirstOpening =
            evidence.checkOnFirstOpening;
          eqcDocumentaryEvidence.checkOnSecondCompliance =
            evidence.checkOnSecondCompliance;
          eqcDocumentaryEvidence.checkOnSecondOpening =
            evidence.checkOnSecondOpening;
          eqcDocumentaryEvidence.evidenceTitle = evidence.evidenceTitle;
          eqcDocumentaryEvidence.evidenceType = evidence.evidenceType;

          eqcDocumentaryEvidencePayload.push(eqcDocumentaryEvidence);
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

    await manager
      .getRepository(EqcDocumentaryEvidence)
      .insert(eqcDocumentaryEvidencePayload);
  }
}
