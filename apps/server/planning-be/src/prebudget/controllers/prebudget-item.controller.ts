import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PrebudgetPlanItemService } from '../services/prebudget-item.service';
import { EntityCrudController } from 'src/shared/controller/entity-crud.controller';
import { PrebudgetPlanItem } from '../entities/prebudget-item.entity';

@Controller('prebudget-items')
@ApiTags('Prebudget Plan Item')
export class PrebudgetPlanItemController extends EntityCrudController<PrebudgetPlanItem> {
  constructor(private readonly prebudgetItemService: PrebudgetPlanItemService) {
    super(prebudgetItemService);
  }
}
