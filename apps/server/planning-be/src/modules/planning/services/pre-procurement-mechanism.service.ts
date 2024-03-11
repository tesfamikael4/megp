import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ExtraCrudService } from 'src/shared/service';
import { PreProcurementMechanism } from 'src/entities';
import { ReasonService } from 'src/modules/utility/services/reason.service';

@Injectable()
export class PreProcurementMechanismService extends ExtraCrudService<PreProcurementMechanism> {
  constructor(
    @InjectRepository(PreProcurementMechanism)
    private readonly repositoryPreProcurementMechanism: Repository<PreProcurementMechanism>,

    private readonly reasonService: ReasonService,
  ) {
    super(repositoryPreProcurementMechanism);
  }

  async create(itemData: any, req?: any): Promise<any> {
    try {
      if (req?.user?.organization) {
        itemData.organizationId = req.user.organization.id;
      }
      if (itemData.justification?.length > 0) {
        const validationPromises = itemData.justification.map(
          async (element) => {
            await this.reasonService.isValid(
              itemData.preBudgetPlanActivityId,
              element.key,
              element.status,
            );
          },
        );
        await Promise.all(validationPromises);
      }
      const item = this.repositoryPreProcurementMechanism.create(itemData);
      await this.repositoryPreProcurementMechanism.insert(item);
      return item;
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, itemData: any): Promise<any> {
    try {
      await this.repositoryPreProcurementMechanism.findOneOrFail({
        where: { id },
      });
      if (itemData.justification?.length > 0) {
        const validationPromises = itemData.justification.map(
          async (element) => {
            return await this.reasonService.isValid(
              itemData.preBudgetPlanActivityId,
              element.key,
              element.status,
            );
          },
        );
        await Promise.all(validationPromises);
      }
      delete itemData.justification;
      await this.repositoryPreProcurementMechanism.update(id, itemData);
      return this.findOne(id);
    } catch (error) {
      throw error;
    }
  }
}
