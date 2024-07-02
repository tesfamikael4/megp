import { IsUUID, IsString, IsNumber, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePOShipmentDto {
  @ApiProperty({
    description: 'UUID of the Purchase Order',
    type: String,
  })
  @IsUUID()
  purchaseOrderId: string;

  @ApiProperty({
    description: 'Description of the shipment',
    type: String,
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Delivery location for the shipment',
    type: String,
  })
  @IsString()
  deliveryLocation: string;

  @ApiProperty({
    description: 'Quantity of the items in the shipment',
    type: Number,
    example: 10.0,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Type(() => Number)
  quantity: number;

  @ApiProperty({
    description: 'Unit of measure for the shipment',
    type: String,
  })
  @IsString()
  uom: string;

  @ApiProperty({
    description: 'Expected delivery date of the shipment',
    type: Date,
  })
  @IsDate()
  @Type(() => Date)
  expectedDeliveryDate: Date;
}

export class UpdatePOShipmentDto extends CreatePOShipmentDto {
  @ApiProperty({
    description: 'UUID of the POShipment',
    type: String,
  })
  @IsUUID()
  id: string;
}

export class POShipmentResponse extends UpdatePOShipmentDto {}
