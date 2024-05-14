import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDate, IsNumber, IsString, IsUUID } from 'class-validator';
export class CreateProcurementRequisitionTimelineDto {
  @ApiProperty()
  @IsString()
  timeline: string;

  @ApiProperty()
  @IsNumber()
  order: number;

  @ApiProperty()
  @IsNumber()
  period: number;

  @ApiProperty()
  @IsDate()
  dueDate: Date;

  @ApiProperty()
  @IsUUID()
  procurementRequisitionId: string;

  @ApiProperty()
  @IsString()
  status: string;

  @ApiProperty()
  @IsString()
  organizationId: string;

  @ApiProperty()
  @IsString()
  organizationName: string;
}

export class UpdateProcurementRequisitionTimelineDto extends CreateProcurementRequisitionTimelineDto {
  @ApiProperty()
  @IsUUID()
  id: string;
}

export class ProcurementRequisitionTimelineResponseDto extends UpdateProcurementRequisitionTimelineDto {}

export class BulkTimelineDto {
  @ApiProperty({
    isArray: true,
    type: () => CreateProcurementRequisitionTimelineDto,
  })
  @IsArray()
  timeline: CreateProcurementRequisitionTimelineDto[];
}
