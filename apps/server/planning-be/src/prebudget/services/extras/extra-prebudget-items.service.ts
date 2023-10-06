import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { ExtraCrudService } from 'src/shared/service/extra-crud.service';
import { PrebudgetPlanItem } from '../../entities/prebudget-item.entity';

@Injectable()
export class ExtraPrebudgetItemsService extends ExtraCrudService<PrebudgetPlanItem> {
  constructor(
    @InjectRepository(PrebudgetPlanItem)
    private readonly prebudgetPlanItemRepository: Repository<PrebudgetPlanItem>,
  ) {
    super(prebudgetPlanItemRepository);
  }
}
