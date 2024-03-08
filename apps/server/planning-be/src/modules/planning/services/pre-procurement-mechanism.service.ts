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
    if (req?.user?.organization) {
      itemData.organizationId = req.user.organization.id;
    }
    if (itemData.justification.length > 0) {
      itemData.justification.map(async (element) => {
        await this.reasonService.isValid(
          itemData.preBudgetPlanActivityId,
          element.key,
          element.status,
        );
      });
    }
    const item = this.repositoryPreProcurementMechanism.create(itemData);
    await this.repositoryPreProcurementMechanism.insert(item);
    return item;
  }
}
