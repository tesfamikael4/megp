import { IsString, IsUUID, IsNumber, IsBoolean, IsJSON } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePOTermDto {
  @ApiProperty({
    description: 'UUID of the Purchase Order',
    type: String,
  })
  @IsUUID()
  purchaseOrderId: string;

  @ApiProperty({
    description: 'Warranty period in months',
    type: Number,
    example: 12,
  })
  @IsNumber()
  warrantyPeriod: number;

  @ApiProperty({
    description: 'Liquidity damage amount',
    type: Number,
    example: 1000.0,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  liquidityDamage: number;

  @ApiProperty({
    description: 'Liquidity damage limit amount',
    type: Number,
    example: 5000.0,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  liquidityDamageLimit: number;

  @ApiProperty({
    description: 'Payment terms for the purchase order',
    type: String,
  })
  @IsString()
  paymentTerms: string;

  @ApiProperty({
    description: 'Terms and conditions in JSON format',
    type: Object,
  })
  @IsJSON()
  terms: any;

  @ApiProperty({
    description: 'Delivery period for the purchase order',
    type: String,
  })
  @IsString()
  deliveryPeriod: string;

  @ApiProperty({
    description: 'Indicates if partial payment is allowed',
    type: Boolean,
  })
  @IsBoolean()
  isPartialPaymentAllowed: boolean;
}

export class UpdatePOTermDto extends CreatePOTermDto {
  @ApiProperty({
    description: 'UUID of the purchase order term',
    type: String,
  })
  @IsUUID()
  id: string;
}

export class POTermResponseDto extends UpdatePOTermDto {}
