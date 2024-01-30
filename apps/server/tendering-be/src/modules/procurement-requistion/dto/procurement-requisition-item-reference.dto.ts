import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
export class CreateProcurementRequisitionItemReferenceDto {
  @ApiProperty()
  @IsUUID()
  procurementRequisitionItemId: string;

  @ApiProperty()
  @IsUUID()
  annualProcurementPlanItemId: string;
}

export class UpdateProcurementRequisitionItemReferenceDto extends CreateProcurementRequisitionItemReferenceDto {
  @ApiProperty()
  @IsUUID()
  id: string;
}

export class ProcurementRequisitionItemReferenceResponseDto extends UpdateProcurementRequisitionItemReferenceDto {}
