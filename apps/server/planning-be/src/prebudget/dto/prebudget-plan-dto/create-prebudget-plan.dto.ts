import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';
import { PrebudgetPlan } from '../../entities/prebudget-plan.entity';
export class CreatePrebudgetPlanDto {
  @ApiProperty({ format: 'uuid', description: 'App Initiation id' })
  @IsUUID()
  planInitiationId: string;

  @ApiProperty()
  @IsString()
  procurementReference: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  remark: string;

  static toDto(entity: PrebudgetPlan): CreatePrebudgetPlanDto {
    const dto = new CreatePrebudgetPlanDto();
    dto.planInitiationId = entity.planInitiationId;
    dto.procurementReference = entity.procurementReference;
    dto.remark = entity.remark;
    dto.description = entity.description;
    return dto;
  }
  static fromDto(dto: CreatePrebudgetPlanDto): PrebudgetPlan {
    const entity = new PrebudgetPlan();
    entity.planInitiationId = dto.planInitiationId;
    entity.procurementReference = dto.procurementReference;
    entity.remark = dto.remark;
    entity.description = dto.description;
    return entity;
  }
  static toDtos(items: PrebudgetPlan[]) {
    return items?.map((item) => this.toDto(item));
  }
}
