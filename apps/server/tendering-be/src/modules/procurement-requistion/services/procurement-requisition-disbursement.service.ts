import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ProcurementRequisition,
  ProcurementRequisitionDisbursement,
} from 'src/entities';
import { ExtraCrudService } from 'src/shared/service';
import { Repository } from 'typeorm';

@Injectable()
export class ProcurementRequisitionDisbursementService extends ExtraCrudService<ProcurementRequisitionDisbursement> {
  constructor(
    @InjectRepository(ProcurementRequisitionDisbursement)
    private readonly repositoryProcurementRequisitionDisbursement: Repository<ProcurementRequisitionDisbursement>,

    @InjectRepository(ProcurementRequisition)
    private readonly repositoryProcurementRequisition: Repository<ProcurementRequisition>,
  ) {
    super(repositoryProcurementRequisitionDisbursement);
  }
  @OnEvent('create.pr_disbursements', { async: true })
  async handleDisbursementsCreatedEvent(
    disbursementsData: any[],
  ): Promise<void> {
    const mergeDisbursements =
      await this.mergeSimilarDisbursements(disbursementsData);
    const disbursements =
      this.repositoryProcurementRequisitionDisbursement.create(
        mergeDisbursements,
      );
    await this.repositoryProcurementRequisitionDisbursement.save(disbursements);
  }

  async mergeSimilarDisbursements(disbursements: any): Promise<any> {
    const mergedDisbursements: ProcurementRequisitionDisbursement[] = [];

    disbursements.forEach((disbursement: any) => {
      const existingDisbursement = mergedDisbursements.find(
        (mergedDisbursement) =>
          mergedDisbursement.currency === disbursement.currency &&
          mergedDisbursement.quarter === disbursement.quarter,
      );

      if (existingDisbursement) {
        existingDisbursement.amount += disbursement.amount;
      } else {
        mergedDisbursements.push({ ...disbursement });
      }
    });

    return mergedDisbursements;
  }
}
