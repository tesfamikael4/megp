import { IsString, IsUUID, IsDate, IsOptional, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { AcceptanceNoteStatus } from 'src/utils/enums';

export class CreateAcceptanceNoteDto {
  @ApiProperty({
    description: 'Acceptance number of the note',
    type: String,
  })
  @IsString()
  acceptanceNumber: string;

  @ApiProperty({
    description: 'UUID of the Purchase Order',
    type: String,
  })
  @IsUUID()
  purchaseOrderId: string;

  @ApiProperty({
    description: 'Date when the items were received',
    type: Date,
  })
  @IsDate()
  @Type(() => Date)
  receivedDate: Date;

  @ApiProperty({
    description: 'Location where the items were delivered',
    type: String,
  })
  @IsString()
  deliveryLocation: any;

  @ApiProperty({
    description: 'UUID of the person who checked the items',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsUUID()
  checkedById: string;

  @ApiProperty({
    description: 'Name of the person who checked the items',
    type: String,
  })
  @IsString()
  checkedByName: string;

  @ApiProperty({
    description: 'Description of the acceptance note',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Order number associated with the acceptance note',
    type: String,
  })
  @IsString()
  orderNumber: string;

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

export class UpdateAcceptanceNoteDto extends CreateAcceptanceNoteDto {
  @ApiProperty({
    description: 'UUID of the acceptance note',
    type: String,
  })
  @IsUUID()
  id: string;
}

export class AcceptanceNoteResponse extends UpdateAcceptanceNoteDto {}
