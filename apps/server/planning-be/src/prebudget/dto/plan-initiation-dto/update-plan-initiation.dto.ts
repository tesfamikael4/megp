import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { CreatePlanInitiationDto } from './create-plan-initiation.dto';
import { PlanInitiation } from '../../entities/plan-initiation.entity';
import { PlanInitiationStatus } from 'src/shared/enums/enums';

export class UpdatePlanInitiationDto extends CreatePlanInitiationDto {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty({ type: 'enum', enum: PlanInitiationStatus })
  @IsString()
  status: string;

  static override toDto(app: PlanInitiation): UpdatePlanInitiationDto {
    const appDto = new UpdatePlanInitiationDto();
    appDto.id = app.id;
    appDto.organizationId = app.organizationId;
    appDto.organizationName = app.organizationName;
    appDto.planName = app.planName;
    appDto.budgetYearId = app.budgetYearId;
    appDto.budgetYear = app.budgetYear;
    appDto.initiatorName = app.initiatorName;
    appDto.description = app.description;
    return appDto;
  }
  static toDtos(apps: PlanInitiation[]) {
    return apps?.map((app) => this.toDto(app));
  }
}
