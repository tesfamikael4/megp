import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ProcurementRequisition,
  ProcurementRequisitionMechanism,
} from 'src/entities';
import { ExtraCrudService } from 'src/shared/service';
import { Repository } from 'typeorm';

@Injectable()
export class ProcurementRequisitionMechanismService extends ExtraCrudService<ProcurementRequisitionMechanism> {
  constructor(
    @InjectRepository(ProcurementRequisitionMechanism)
    private readonly repositoryProcurementRequisitionMechanism: Repository<ProcurementRequisitionMechanism>,

    @InjectRepository(ProcurementRequisition)
    private readonly repositoryProcurementRequisition: Repository<ProcurementRequisition>,
  ) {
    super(repositoryProcurementRequisitionMechanism);
  }
  @OnEvent('create.pr_mechanisms', { async: true })
  async handleMechanismsCreatedEvent(mechanismsData: any[]): Promise<void> {
    const mergeMechanism = await this.mergeSimilarMechanisms(mechanismsData);
    const mechanism =
      this.repositoryProcurementRequisitionMechanism.create(mergeMechanism);
    await this.repositoryProcurementRequisitionMechanism.save(mechanism);
  }

  async mergeSimilarMechanisms(
    mechanisms: any[],
  ): Promise<ProcurementRequisitionMechanism> {
    const mergedMechanisms: ProcurementRequisitionMechanism = {
      ...mechanisms[0],
    };
    const mergedDonors: string[] = [];

    mechanisms.forEach((mechanism) => {
      if (mechanism.donor.length > 0) {
        mergedDonors.push(...mechanism.donor);
      }
    });

    const uniqueDonors: string[] = Array.from(
      new Set(mergedDonors.map((d) => d.toLowerCase())),
    );
    mergedMechanisms.donor = uniqueDonors;

    return mergedMechanisms;
  }
}
