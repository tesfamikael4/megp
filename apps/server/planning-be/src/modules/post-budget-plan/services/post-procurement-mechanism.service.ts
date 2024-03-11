import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ExtraCrudService } from 'src/shared/service';
import { PostProcurementMechanism } from 'src/entities/post-procurement-mechanism.entity';
import { ReasonService } from 'src/modules/utility/services/reason.service';

@Injectable()
export class PostProcurementMechanismService extends ExtraCrudService<PostProcurementMechanism> {
  constructor(
    @InjectRepository(PostProcurementMechanism)
    private readonly repositoryPostProcurementMechanism: Repository<PostProcurementMechanism>,

    private readonly reasonService: ReasonService,
  ) {
    super(repositoryPostProcurementMechanism);
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
      const item = this.repositoryPostProcurementMechanism.create(itemData);
      await this.repositoryPostProcurementMechanism.insert(item);
      return item;
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, itemData: any): Promise<any> {
    try {
      await this.repositoryPostProcurementMechanism.findOneOrFail({
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
      await this.repositoryPostProcurementMechanism.update(id, itemData);
      return this.findOne(id);
    } catch (error) {
      throw error;
    }
  }
}
