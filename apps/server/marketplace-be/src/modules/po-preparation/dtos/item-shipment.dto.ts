import { IsString, IsUUID, IsNumber, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateItemShipmentDto {
  @ApiProperty({
    description: 'UUID of the PO Item',
    type: String,
  })
  @IsUUID()
  poItemId: string;

  @ApiProperty({
    description: 'UUID of the PO Item',
    type: String,
  })
  @IsUUID()
  poShipmentId: string;

  @ApiProperty({
    description: 'Description of the item shipment',
    type: String,
  })
  @IsString()
  itemName: string;

  @ApiProperty({
    description: 'Quantity of the items in the shipment',
    type: Number,
    example: 10.0,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Type(() => Number)
  quantity: number;
}
export class UpdateItemShipmentDto extends CreateItemShipmentDto {
  @ApiProperty()
  @IsUUID()
  id: string;
}

export class POItems {
  @ApiProperty()
  @IsUUID()
  id: string;
  @ApiProperty()
  @IsNumber()
  quantity: number;
}

export class CreateBulkItemShipmentDto {
  @ApiProperty()
  @IsUUID()
  poShipmentId: string;

  @ApiProperty({ type: () => [POItems] })
  poItems: POItems[];
}

export class ItemShipmentResponse extends UpdateItemShipmentDto {}
