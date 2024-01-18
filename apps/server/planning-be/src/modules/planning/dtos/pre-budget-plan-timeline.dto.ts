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
  timeline: string;

  @ApiProperty()
  @IsNumber()
  order: number;

  @ApiProperty()
  @IsDate()
  dueDate: Date;

  @ApiProperty()
  @IsNumber()
  period: number;

  @ApiProperty()
  @IsString()
  status: string;

  @ApiProperty()
  @IsString()
  organizationId: string;
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
