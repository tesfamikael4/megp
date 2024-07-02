import {
  IsString,
  IsUUID,
  IsNumber,
  IsDate,
  IsJSON,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export enum ReceivingItemStatus {
  Draft = 'Draft',
  Completed = 'Completed',
  Rejected = 'Rejected',
}

export class CreateReceivingItemDto {
  @ApiProperty({
    description: 'UUID of the receivingNote record',
    type: String,
  })
  @IsUUID()
  receivingNoteId: string;

  @ApiProperty({
    description: 'Reference number of the received item',
    type: String,
  })
  @IsString()
  referenceNumber: string;

  @ApiProperty({
    description: 'Quantity of the received item',
    type: Number,
  })
  @IsNumber()
  quantity: number;

  @ApiProperty({
    description: 'Description of the received item',
    type: String,
  })
  @IsString()
  itemName: string;

  @ApiProperty({
    description: 'Date the item was received',
    type: Date,
  })
  @IsDate()
  @Type(() => Date)
  receivedDate: Date;

  @ApiProperty({
    description: 'Name of the person who received the item',
    type: String,
  })
  @IsString()
  receivedBy: string;

  @ApiProperty({
    description: 'Name of the person who delivered the item',
    type: String,
  })
  @IsString()
  deliveredBy: string;

  @ApiProperty({
    description: 'UUID of the PO Item',
    type: String,
  })
  @IsUUID()
  poItemId: string;

  @ApiProperty({
    description: 'Unit of measure for the received item',
    type: String,
  })
  @IsString()
  uom: string;

  @ApiProperty({
    description: 'Specification details in JSON format',
    type: Object,
  })
  @IsJSON()
  specification: any;

  @ApiProperty({
    description: 'Quantity delivered',
    type: Number,
  })
  @IsNumber()
  quantityDelivered: number;

  @ApiProperty({
    description: 'Quantity accepted',
    type: Number,
  })
  @IsNumber()
  quantityAccepted: number;

  @ApiProperty({
    description: 'Quantity rejected',
    type: Number,
  })
  @IsNumber()
  quantityRejected: string;

  @ApiProperty({
    description: 'Reason for rejection',
    type: String,
  })
  @IsString()
  rejectReason: string;

  @ApiProperty({
    description: 'Notes from the receiver',
    type: String,
  })
  @IsString()
  receiverNote: string;

  @ApiProperty({
    description: 'Status of the received item',
    type: 'enum',
    enum: ReceivingItemStatus,
  })
  @IsEnum(ReceivingItemStatus)
  status: ReceivingItemStatus;
}

export class UpdateReceivingItemDto extends CreateReceivingItemDto {
  @ApiProperty({
    description: 'UUID of the received item record',
    type: String,
  })
  @IsUUID()
  id: string;
}

export class ReceivingItemResponse extends UpdateReceivingItemDto {}
