import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { Approval } from 'src/prebudget/entities/approval.entity';
import { CreateApprovalDto } from './create-approval.dto';

export class UpdateApprovalDto extends CreateApprovalDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  id: string;

  static fromDto(dto: UpdateApprovalDto): Approval {
    const entity = new Approval();
    entity.id = dto.id;
    entity.type = dto.type;
    entity.parentId = dto.parentId;
    entity.endorseType = dto.endorseType;
    entity.approverName = dto.remarks;
    entity.remarks = dto.remarks;
    entity.attachment = dto.attachment;
    return entity;
  }
  static toDto(entity: Approval): UpdateApprovalDto {
    const dto = new UpdateApprovalDto();
    dto.id = entity.id;
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
