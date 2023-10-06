import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PlanInitiationService } from '../services/plan-initaiation.service';
import { EntityCrudController } from 'src/shared/controller/entity-crud.controller';
import { PlanInitiation } from '../entities/plan-initiation.entity';

@Controller('plan-initiations')
@ApiTags('Plan Initiation')
export class PlanInitiationController extends EntityCrudController<PlanInitiation> {
  constructor(private readonly planInitiationService: PlanInitiationService) {
    super(planInitiationService);
  }
}
