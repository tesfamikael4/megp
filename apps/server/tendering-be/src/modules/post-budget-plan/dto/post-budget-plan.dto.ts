import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';
export class CreatePostBudgetPlanDto {
  @ApiProperty()
  @IsString()
  title: string;
}

export class UpdatePostBudgetPlanDto extends CreatePostBudgetPlanDto {
  @ApiProperty()
  @IsUUID()
  id: string;
}

export class PostBudgetPlanResponseDto extends UpdatePostBudgetPlanDto {}
