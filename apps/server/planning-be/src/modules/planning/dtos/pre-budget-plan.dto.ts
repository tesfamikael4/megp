import { ApiProperty } from '@nestjs/swagger';
import {
  IsJSON,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreatePreBudgetPlanDto {
  @ApiProperty()
  @IsUUID()
  appId: string;

  @ApiProperty()
  @IsJSON()
  estimatedAmount: any;

  @ApiProperty()
  @IsString()
  status: string;
}

export class UpdatePreBudgetPlanDto extends CreatePreBudgetPlanDto {
  @ApiProperty()
  @IsString()
  id: string;
}

export class PreBudgetPlanResponseDto extends UpdatePreBudgetPlanDto {}
