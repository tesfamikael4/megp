import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { ClientProxy } from '@nestjs/microservices';
import { Lot } from 'src/entities';
import { SubmittedEvaluation } from 'src/entities/submitted-evaluations.entity';
import { TechnicalPreliminaryAssessment } from 'src/entities/technical-preliminary-assessment.entity';
import { TechnicalQualificationAssessment } from 'src/entities/technical-qualification-assessments.entity';
import { TechnicalResponsivenessAssessment } from 'src/entities/technical-responsiveness-assessments.entity';
import { TechnicalScoringAssessment } from 'src/entities/technical-scoring-assessments.entity';
import { TenderMilestone } from 'src/entities/tender-milestone.entity';
import { DocumentService } from 'src/modules/utility/pdf-generator/service/document.service';
import { PdfGeneratorService } from 'src/modules/utility/pdf-generator/service/pdf-generator.service';
import { TenderMilestoneEnum } from 'src/shared/enums/tender-milestone.enum';
import { ENTITY_MANAGER_KEY } from 'src/shared/interceptors';
import { MinIOService } from 'src/shared/min-io';
import { EntityManager } from 'typeorm';

@Injectable()
export class TechnicalEndorsementService {
  constructor(
    @Inject(REQUEST)
    private request: Request,

    private readonly minIoService: MinIOService,

    private readonly pdfGeneratorService: PdfGeneratorService,

    private readonly documentService: DocumentService,

    @Inject('ENDORSEMENT_RMQ_SERVICE')
    private readonly endorsementRMQClient: ClientProxy,
  ) {}
  //initiate workflow for tender
  async initiateWorkflow(
    itemData: {
      tenderId: string;
      lotId: string;
      organizationId: string;
      organizationName: string;
    },
    req: any,
  ) {
    const manager: EntityManager = this.request[ENTITY_MANAGER_KEY];
    await this.changeMilestone(manager, itemData);
    const [lot, compliance, qualification, responsiveness, scoring] =
      await Promise.all([
        manager.getRepository(Lot).findOne({
          where: {
            id: itemData.lotId,
          },
          select: {
            id: true,
            name: true,
          },
        }),
        manager.getRepository(TechnicalPreliminaryAssessment).findOne({
          where: {
            bidRegistrationDetail: {
              lotId: itemData.lotId,
            },
          },
          relations: {
            technicalPreliminaryAssessmentDetail: true,
          },
        }),
        manager.getRepository(TechnicalQualificationAssessment).findOne({
          where: {
            bidRegistrationDetail: {
              lotId: itemData.lotId,
            },
          },
          relations: {
            technicalQualificationAssessmentDetail: true,
          },
        }),
        manager.getRepository(TechnicalResponsivenessAssessment).findOne({
          where: {
            bidRegistrationDetail: {
              lotId: itemData.lotId,
            },
          },
          relations: {
            technicalResponsivenessAssessmentDetail: true,
          },
        }),
        manager.getRepository(TechnicalScoringAssessment).findOne({
          where: {
            bidRegistrationDetail: {
              lotId: itemData.lotId,
            },
          },
          relations: {
            technicalScoringAssessmentDetail: true,
          },
        }),
      ]);

    await this.pdfGenerator(
      itemData.lotId,
      lot.name,
      {
        organizationId: itemData.organizationId,
        organizationName: itemData.organizationName,
      },
      { compliance, qualification, responsiveness, scoring },
    );
    await this.endorsementRMQClient.emit('initiate-workflow', {
      name: 'technicalEndorsement',
      id: itemData.lotId,
      itemName: lot.name,
      organizationId: itemData.organizationId,
    });
    return true;
  }

  async pdfGenerator(
    lotId: string,
    itemName: string,
    organization: { organizationId: string; organizationName: string },
    data,
  ) {
    const entityManager: EntityManager = this.request[ENTITY_MANAGER_KEY];

    const prevSubmitted = await entityManager
      .getRepository(SubmittedEvaluation)
      .findOne({
        where: {
          objectId: lotId,
          objectType: 'technicalEvaluation',
        },
        order: {
          version: 'DESC',
        },
      });

    await entityManager.getRepository(SubmittedEvaluation).insert({
      plan: { data },
      objectType: 'technicalEvaluation',
      objectId: lotId,
      version: prevSubmitted?.version + 1 || 1,
      ...organization,
    });

    const buffer = await this.pdfGeneratorService.pdfGenerator(data, 'post');

    const fileInfo = await this.minIoService.uploadBuffer(
      buffer,
      'preBudgetPlanReport.pdf',
      'application/pdf',
      'megp',
    );

    await this.documentService.create(
      {
        fileInfo,
        title: itemName,
        itemId: lotId,
        type: 'technicalEvaluation',
        version: 1,
        key: 'onApprovalSubmit',
      },
      organization,
    );
    return buffer;
  }

  private async changeMilestone(
    manager: EntityManager,
    itemData: { tenderId: string; lotId: string },
  ) {
    await manager.getRepository(TenderMilestone).update(
      {
        lotId: itemData.lotId,
        tenderId: itemData.tenderId,
      },
      {
        isCurrent: false,
      },
    );
    await manager.getRepository(TenderMilestone).insert({
      lotId: itemData.lotId,
      tenderId: itemData.tenderId,
      milestoneNum: TenderMilestoneEnum.TechnicalEndorsement,
      milestoneTxt: 'TechnicalEndorsement',
      isCurrent: true,
    });
  }
}
