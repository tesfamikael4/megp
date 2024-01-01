import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsJSON, IsNumber, IsString, IsUUID } from 'class-validator';

export class CreatePreBudgetPlanItemsDto {
  @ApiProperty()
  @IsUUID()
  preBudgetPlanActivityId: string;

  @ApiProperty()
  @IsString()
  itemCode: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsString()
  currency: string;

  @ApiProperty()
  @IsNumber()
  unitPrice: number;

  @ApiProperty()
  @IsNumber()
  quantity: string;

  @ApiProperty()
  @IsString()
  measurement: string;

  @ApiProperty()
  @IsString()
  uom: string;

  @ApiProperty()
  @IsString()
  uomName: string;

  @ApiProperty()
  @IsString()
  classification: string;
}

export class UpdatePreBudgetPlanItemsDto extends CreatePreBudgetPlanItemsDto {
  @ApiProperty()
  @IsString()
  id: string;
}

export class PreBudgetPlanResponseItemsDto extends UpdatePreBudgetPlanItemsDto {}

export class BulkItemsDto {
  @ApiProperty({ isArray: true, type: () => CreatePreBudgetPlanItemsDto })
  @IsArray()
  items: CreatePreBudgetPlanItemsDto[];
}
