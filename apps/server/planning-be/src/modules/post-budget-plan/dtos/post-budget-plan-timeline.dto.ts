import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDate,
  IsJSON,
  IsNumber,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreatePostBudgetPlanTimelineDto {
  @ApiProperty()
  @IsUUID()
  postBudgetPlanActivityId: string;

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

  @ApiProperty()
  @IsString()
  organizationId: string;
}

export class UpdatePostBudgetPlanTimelineDto extends CreatePostBudgetPlanTimelineDto {
  @ApiProperty()
  @IsString()
  id: string;
}

export class PostBudgetPlanResponseTimelineDto extends UpdatePostBudgetPlanTimelineDto {}

export class BulkTimelineDto {
  @ApiProperty({ isArray: true, type: () => CreatePostBudgetPlanTimelineDto })
  @IsArray()
  timeline: CreatePostBudgetPlanTimelineDto[];
}
