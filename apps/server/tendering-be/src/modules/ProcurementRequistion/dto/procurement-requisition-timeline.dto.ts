import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber, IsString, IsUUID } from 'class-validator';
export class CreateProcurementRequisitionTimelineDto {
  @ApiProperty()
  @IsString()
  timeline: string;

  @ApiProperty()
  @IsNumber()
  order: number;

  @ApiProperty()
  @IsNumber()
  noOfDays: number;

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
