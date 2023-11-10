import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreatePreBudgetPlanDto {
  @ApiProperty()
  @IsUUID()
  appId: string;

  @ApiProperty()
  @IsNumber()
  totalEstimatedAmount: number;

  @ApiProperty()
  @IsString()
  currency: string;
}

export class UpdatePreBudgetPlanDto extends CreatePreBudgetPlanDto {
  @ApiProperty()
  @IsString()
  id: string;
}

export class PreBudgetPlanResponseDto extends UpdatePreBudgetPlanDto {}
