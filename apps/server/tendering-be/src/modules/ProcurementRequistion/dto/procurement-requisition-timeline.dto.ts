import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsJSON, IsNumber, IsUUID } from 'class-validator';
export class CreateProcurementRequisitionTimelineDto {
  @ApiProperty()
  @IsJSON()
  timeline: JSON;

  @ApiProperty()
  @IsNumber()
  order: number;

  @ApiProperty()
  @IsNumber()
  noDays: number;

  @ApiProperty()
  @IsDate()
  dueDate: Date;

  @ApiProperty()
  @IsUUID()
  procurementRequisitionId: string;
}

export class UpdateProcurementRequisitionTimelineDto extends CreateProcurementRequisitionTimelineDto {
  @ApiProperty()
  @IsUUID()
  id: string;
}

export class ProcurementRequisitionTimelineResponseDto extends UpdateProcurementRequisitionTimelineDto {}
