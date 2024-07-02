import {
  IsString,
  IsDate,
  IsEnum,
  IsJSON,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PurchaseOrderStatus } from 'src/utils/enums';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePurchaseOrderDto {
  @ApiProperty()
  @IsString()
  referenceNumber: string;
  @ApiProperty()
  @IsString()
  awardNoteId: string;

  @ApiProperty()
  @IsString()
  procurementReference: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  version?: string;

  @ApiProperty()
  @IsString()
  vendorId: string;

  @ApiProperty()
  @IsString()
  vendorName: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsJSON()
  contactPerson: any;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  expectedDeliveryDate: Date;
}
export class UpdatePurchaseOrderDto {
  @ApiProperty()
  @IsUUID()
  id: string;
}

export class PurchaseOrderDtoResponseDto extends UpdatePurchaseOrderDto {}
