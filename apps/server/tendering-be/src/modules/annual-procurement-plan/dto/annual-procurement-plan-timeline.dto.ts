import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber, IsString, IsUUID } from 'class-validator';
export class CreateAnnualProcurementPlanTimelineDto {
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
  annualProcurementPlanActivityId: string;
}

export class UpdateAnnualProcurementPlanTimelineDto extends CreateAnnualProcurementPlanTimelineDto {
  @ApiProperty()
  @IsUUID()
  id: string;
}

export class AnnualProcurementPlanTimelineResponseDto extends UpdateAnnualProcurementPlanTimelineDto {}
