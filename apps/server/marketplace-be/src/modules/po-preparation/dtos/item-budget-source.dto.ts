import { IsString, IsUUID, IsNumber, IsJSON } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateItemBudgetSourceDto {
  @ApiProperty({
    description: 'UUID of the PO Item',
    type: String,
  })
  @IsUUID()
  poItemId: string;

  @ApiProperty({
    description: 'Chart of account details in JSON format',
    type: Object,
  })
  @IsJSON()
  chartOfAccount: any;

  @ApiProperty({
    description: 'Quantity of the items',
    type: Number,
    example: 10.0,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Type(() => Number)
  quantity: number;

  @ApiProperty({
    description: 'Amount for the item budget source',
    type: Number,
    example: 100.0,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Type(() => Number)
  amount: number;

  @ApiProperty({
    description: 'Line total amount for the item budget source',
    type: Number,
    example: 1000.0,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Type(() => Number)
  lineTotal: number;

  @ApiProperty({
    description: 'Unit of measure for the item budget source',
    type: String,
  })
  @IsString()
  uom: string;

  @ApiProperty({
    description: 'Currency for the item budget source',
    type: String,
  })
  @IsString()
  currency: string;
}

export class UpdateItemBudgetSourceDto extends CreateItemBudgetSourceDto {
  @ApiProperty({
    description: 'UUID of the item budget source',
    type: String,
  })
  @IsUUID()
  id: string;
}

export class ItemBudgetSourceResponseDto extends UpdateItemBudgetSourceDto {}
