import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AnnualProcurementPlanItem } from 'src/entities';
import { ExtraCrudService } from 'src/shared/service';
import { Repository } from 'typeorm';

@Injectable()
export class AnnualProcurementPlanItemService extends ExtraCrudService<AnnualProcurementPlanItem> {
  constructor(
    @InjectRepository(AnnualProcurementPlanItem)
    private readonly repositoryAnnualProcurementPlanItem: Repository<AnnualProcurementPlanItem>,
  ) {
    super(repositoryAnnualProcurementPlanItem);
  }
}
