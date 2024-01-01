import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';
export class CreateProcurementRequisitionOfficerAssignmentDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsUUID()
  procurementRequisitionId: string;

  @ApiProperty()
  @IsUUID()
  userId: string;
}

export class UpdateProcurementRequisitionOfficerAssignmentDto extends CreateProcurementRequisitionOfficerAssignmentDto {
  @ApiProperty()
  @IsUUID()
  id: string;
}

export class ProcurementRequisitionOfficerAssignmentResponseDto extends UpdateProcurementRequisitionOfficerAssignmentDto {}
