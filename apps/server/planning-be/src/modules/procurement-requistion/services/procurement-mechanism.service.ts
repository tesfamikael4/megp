import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProcurementMechanism } from 'src/entities';
import { ReasonService } from 'src/modules/utility/services/reason.service';
import { ExtraCrudService } from 'src/shared/service';
import { Repository } from 'typeorm';

@Injectable()
export class ProcurementMechanismService extends ExtraCrudService<ProcurementMechanism> {
  constructor(
    @InjectRepository(ProcurementMechanism)
    private readonly repositoryProcurementMechanism: Repository<ProcurementMechanism>,

    private readonly reasonService: ReasonService,
  ) {
    super(repositoryProcurementMechanism);
  }
  async create(itemData: any, req?: any): Promise<any> {
    try {
      if (req?.user?.organization) {
        itemData.organizationId = req.user.organization.id;
      }
      if (itemData.justification?.length > 0) {
        const validationPromises = itemData.justification.map(
          async (element: any) => {
            await this.reasonService.isValid(
              itemData.procurementRequisitionId,
              element.key,
              element.status,
              'procurementRequisitionId',
            );
          },
        );
        await Promise.all(validationPromises);
      }
      delete itemData.justification;
      const item = this.repositoryProcurementMechanism.create(itemData);
      await this.repositoryProcurementMechanism.insert(item);
      return item;
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, itemData: any): Promise<any> {
    try {
      await this.repositoryProcurementMechanism.findOneOrFail({
        where: { id },
      });
      if (itemData.justification?.length > 0) {
        const validationPromises = itemData.justification.map(
          async (element) => {
            return await this.reasonService.isValid(
              itemData.procurementRequisitionId,
              element.key,
              element.status,
              'procurementRequisitionId',
            );
          },
        );
        await Promise.all(validationPromises);
      }
      delete itemData.justification;
      await this.repositoryProcurementMechanism.update(id, itemData);
      return this.findOne(id);
    } catch (error) {
      throw error;
    }
  }
}
