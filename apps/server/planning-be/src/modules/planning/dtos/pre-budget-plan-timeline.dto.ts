import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDate,
  IsJSON,
  IsNumber,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreatePreBudgetPlanTimelineDto {
  @ApiProperty()
  @IsUUID()
  preBudgetPlanActivityId: string;

  @ApiProperty()
  @IsString()
  activityName: string;

  @ApiProperty()
  @IsDate()
  fromDate: Date;

  @ApiProperty()
  @IsDate()
  toDate: Date;

  @ApiProperty()
  @IsString()
  operationMethod: string;

  @ApiProperty()
  @IsNumber()
  period: number;

  @ApiProperty()
  @IsString()
  status: string;
}

export class UpdatePreBudgetPlanTimelineDto extends CreatePreBudgetPlanTimelineDto {
  @ApiProperty()
  @IsString()
  id: string;
}

export class PreBudgetPlanResponseTimelineDto extends UpdatePreBudgetPlanTimelineDto {}

export class BulkTimelineDto {
  @ApiProperty({ isArray: true, type: () => CreatePreBudgetPlanTimelineDto })
  @IsArray()
  timeline: CreatePreBudgetPlanTimelineDto[];
}
