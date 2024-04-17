import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class PostAddBudgetDTO {
  @ApiProperty()
  @IsString()
  @IsUUID()
  budgetId: string;

  @ApiProperty()
  @IsString()
  @IsUUID()
  postBudgetPlanActivityId: string;
}
