import { IsUUID, IsNumber, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAcceptanceItemDto {
  @ApiProperty({
    description: 'UUID of the delivery acceptance header',
    type: String,
  })
  @IsUUID()
  acceptanceNoteId: string;

  @ApiProperty({
    description: 'UUID of the item',
    type: String,
  })
  @IsUUID()
  itemId: string;

  @ApiProperty({
    description: 'Ordered quantity of the item',
    type: Number,
  })
  @IsNumber()
  orderedQuantity: number;

  @ApiProperty({
    description: 'Delivered quantity of the item',
    type: Number,
  })
  @IsNumber()
  deliveredQuantity: number;

  @ApiProperty({
    description: 'Unit price of the item',
    type: Number,
    example: 100.0,
  })
  @IsNumber()
  unitPrice: number;

  @ApiProperty({
    description: 'Unit of measure for the item',
    type: String,
  })
  @IsString()
  uom: string;

  @ApiProperty({
    description: 'Remark for the acceptance item',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  remark: string;
}

export class UpdateAcceptanceItemDto extends CreateAcceptanceItemDto {
  @ApiProperty({
    description: 'UUID of the acceptance item',
    type: String,
  })
  @IsUUID()
  id: string;
}

export class AcceptanceItemResponse extends UpdateAcceptanceItemDto {}
