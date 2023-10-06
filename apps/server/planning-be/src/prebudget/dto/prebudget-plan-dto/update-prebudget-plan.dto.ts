import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';
import { PrebudgetPlanStatus } from '../../../shared/enums/enums';
import { PrebudgetPlan } from '../../entities/prebudget-plan.entity';
import { CreatePrebudgetPlanDto } from './create-prebudget-plan.dto';

export class UpdatePrebudgetPlanDto extends CreatePrebudgetPlanDto {
  @ApiProperty()
  @IsUUID()
  id: string;

  @ApiProperty()
  @IsOptional()
  approverName: string;

  @ApiProperty({ format: 'date' })
  @IsOptional()
  approvedOn: Date;

  @ApiProperty({ type: 'enum', enum: PrebudgetPlanStatus })
  @IsString()
  preplanStatus: string;

  static toDto(entity: PrebudgetPlan): UpdatePrebudgetPlanDto {
    const dto = new UpdatePrebudgetPlanDto();
    dto.id = entity.id;
    dto.planInitiationId = entity.planInitiationId;
    dto.procurementReference = entity.procurementReference;
    dto.approverName = entity.approverName;
    dto.approvedOn = entity.approvedOn;
    dto.preplanStatus = entity.preplanStatus;
    dto.description = entity.description;
    dto.remark = entity.remark;
    return dto;
  }
  static fromDto(dto: UpdatePrebudgetPlanDto): PrebudgetPlan {
    const entity = new PrebudgetPlan();
    entity.id = dto.id;
    entity.planInitiationId = dto.planInitiationId;
    entity.procurementReference = dto.procurementReference;
    entity.approverName = dto.approverName;
    entity.approvedOn = dto.approvedOn;
    entity.remark = dto.remark;
    entity.preplanStatus = dto.preplanStatus;
    entity.description = dto.description;
    return entity;
  }
  static toDtos(entities: PrebudgetPlan[]) {
    return entities?.map((entity) => this.toDto(entity));
  }
}
