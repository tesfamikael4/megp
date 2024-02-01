import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';
export class CreatePostBudgetPlanActivityDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsUUID()
  postBudgetPlan: string;
}

export class UpdatePostBudgetPlanActivityDto extends CreatePostBudgetPlanActivityDto {
  @ApiProperty()
  @IsUUID()
  id: string;
}

export class PostBudgetPlanActivityResponseDto extends UpdatePostBudgetPlanActivityDto {}
