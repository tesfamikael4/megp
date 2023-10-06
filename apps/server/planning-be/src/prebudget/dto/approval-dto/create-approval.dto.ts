import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';
import { Approval } from 'src/prebudget/entities/approval.entity';
import { ApprovalType, PrebudgetPlanStatus } from 'src/shared/enums/enums';

export class CreateApprovalDto {
  @ApiProperty({ enum: ApprovalType })
  @IsString()
  type: string;

  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  parentId: string;

  @ApiProperty({ enum: PrebudgetPlanStatus })
  @IsString()
  endorseType: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  approverName: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  remarks: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  attachment: string;

  static fromDto(dto: CreateApprovalDto): Approval {
    const entity = new Approval();
    entity.type = dto.type;
    entity.parentId = dto.parentId;
    entity.endorseType = dto.endorseType;
    entity.approverName = dto.remarks;
    entity.remarks = dto.remarks;
    entity.attachment = dto.attachment;
    return entity;
  }
  static toDto(entity: Approval): CreateApprovalDto {
    const dto = new CreateApprovalDto();
    dto.type = entity.type;
    dto.parentId = entity.parentId;
    dto.endorseType = entity.endorseType;
    dto.approverName = entity.remarks;
    dto.remarks = entity.remarks;
    dto.attachment = entity.attachment;
    return dto;
  }
  static toDtos(items: Approval[]) {
    return items?.map((item) => this.toDto(item));
  }
}
