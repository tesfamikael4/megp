import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { ProcurementRequisitionItemReference } from 'src/entities';
import { ExtraCrudService } from 'src/shared/service';
import { Repository } from 'typeorm';
import { CreateProcurementRequisitionItemReferenceDto } from '../dto/procurement-requisition-item-reference.dto';

@Injectable()
export class ProcurementRequisitionItemReferenceService extends ExtraCrudService<ProcurementRequisitionItemReference> {
  constructor(
    @InjectRepository(ProcurementRequisitionItemReference)
    private readonly repositoryProcurementRequisitionItemReference: Repository<ProcurementRequisitionItemReference>,
  ) {
    super(repositoryProcurementRequisitionItemReference);
  }
  @OnEvent('create.pr_item_References', { async: true })
  async handleItemReferencesCreatedEvent(
    itemReferencesData: CreateProcurementRequisitionItemReferenceDto[],
  ): Promise<void> {
    await this.repositoryProcurementRequisitionItemReference.save(
      this.repositoryProcurementRequisitionItemReference.create(
        itemReferencesData,
      ),
    );
  }
}
