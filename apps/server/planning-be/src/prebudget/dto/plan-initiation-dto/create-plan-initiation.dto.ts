import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString, IsUUID } from 'class-validator';
import { PlanInitiation } from '../../entities/plan-initiation.entity';
import { BudgetYearCodeType } from 'src/shared/types/types';
import { PlanInitiationStatus } from 'src/shared/enums/enums';

export class CreatePlanInitiationDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  organizationId: string;

  @ApiProperty()
  @IsString()
  organizationName: string;

  @ApiProperty()
  @IsString()
  planName: string;

  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  budgetYearId: string;

  @ApiProperty({ type: () => BudgetYearCodeType })
  @IsDefined()
  budgetYear!: BudgetYearCodeType;

  @ApiProperty()
  @IsString()
  initiatorName: string;

  @ApiProperty()
  @IsString()
  description: string;

  static fromDto(appDto: CreatePlanInitiationDto): PlanInitiation {
    const app = new PlanInitiation();
    app.organizationId = appDto.organizationId;
    app.organizationName = appDto.organizationName;
    app.planName = appDto.planName;
    app.budgetYear = appDto.budgetYear;
    app.budgetYearId = appDto.budgetYearId;
    app.initiatorName = appDto.initiatorName;
    app.description = appDto.description;

    app.status = PlanInitiationStatus.Initaited;
    return app;
  }

  static toDto(app: PlanInitiation): CreatePlanInitiationDto {
    const appDto = new CreatePlanInitiationDto();
    appDto.organizationId = app.organizationId;
    appDto.organizationName = app.organizationName;
    appDto.planName = app.planName;
    appDto.budgetYearId = app.budgetYearId;
    appDto.budgetYear = app.budgetYear;
    app.initiatorName = appDto.initiatorName;
    appDto.description = app.description;
    return appDto;
  }

  static toDtos(apps: PlanInitiation[]) {
    return apps?.map((app) => this.toDto(app));
  }
}
