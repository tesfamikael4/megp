import { PlanInitiation } from 'src/prebudget/entities/plan-initiation.entity';
import { UpdatePlanInitiationDto } from './update-plan-initiation.dto';

export class PlanInitiationResponseDto extends UpdatePlanInitiationDto {
  static toDtos(apps: PlanInitiation[]) {
    return apps?.map((app) => this.toDto(app));
  }
}
