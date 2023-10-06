import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PrebudgetPlanService } from '../services/prebudget-plan.service';
import { EntityCrudController } from 'src/shared/controller/entity-crud.controller';
import { PrebudgetPlan } from '../entities/prebudget-plan.entity';

@Controller('prebudget-plans')
@ApiTags('Prebudget Plan')
export class PrebudgetPlanController extends EntityCrudController<PrebudgetPlan> {
  constructor(private readonly prebudgetPlanService: PrebudgetPlanService) {
    super(prebudgetPlanService);
  }
}
