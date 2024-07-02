import { IsString, IsUUID, IsBoolean, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReceivingNoteDto {
  @ApiProperty({
    description: 'UUID of the Item Shipment',
    type: String,
  })
  @IsUUID()
  poShipmentId: string;

  @ApiProperty({
    description: 'Order number',
    type: String,
  })
  @IsString()
  orderNumber: string;

  @ApiProperty({
    description: 'Indicates if the receivingNote is completed',
    type: Boolean,
  })
  @IsBoolean()
  isCompleted: boolean;

  @ApiProperty({
    description: 'Total quantity ordered',
    type: Number,
  })
  @IsNumber()
  totalQuantity: number;

  @ApiProperty({
    description: 'unit of measurement',
    type: Number,
  })
  @IsNumber()
  uom: number;

  @ApiProperty({
    description: 'Quantity received',
    type: Number,
  })
  @IsNumber()
  receivedQuantity: number;

  @ApiProperty({
    description: 'Description of the receivingNote',
    type: String,
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'UUID of the vendor',
    type: String,
  })
  @IsString()
  vendorId: string;

  @ApiProperty({
    description: 'Name of the vendor',
    type: String,
  })
  @IsString()
  vendorName: string;
}

export class UpdateReceivingNoteDto extends CreateReceivingNoteDto {
  @ApiProperty({
    description: 'UUID of the receivingNote record',
    type: String,
  })
  @IsUUID()
  id: string;
}

export class ReceivingNoteResponse extends UpdateReceivingNoteDto {}
