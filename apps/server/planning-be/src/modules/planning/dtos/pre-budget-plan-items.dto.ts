import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsJSON, IsNumber, IsString, IsUUID } from 'class-validator';

export class CreatePreBudgetPlanItemsDto {
  @ApiProperty()
  @IsUUID()
  preBudgetPlanActivityId: string;

  @ApiProperty()
  @IsString()
  itemCodeReferenceType: string;

  @ApiProperty()
  @IsString()
  itemCode: string;

  @ApiProperty()
  @IsJSON()
  metaData: JSON;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsJSON()
  specification: JSON;

  @ApiProperty()
  @IsNumber()
  unitPrice: number;

  @ApiProperty()
  @IsString()
  currency: string;

  @ApiProperty()
  @IsNumber()
  quantity: string;

  @ApiProperty()
  @IsString()
  measurement: string;

  @ApiProperty()
  @IsString()
  uom: string;
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
