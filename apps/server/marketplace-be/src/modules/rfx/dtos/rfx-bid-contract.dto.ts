import {
  IsString,
  IsUUID,
  IsInt,
  Min,
  Max,
  IsArray,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRfxBidContractConditionDTO {
  @ApiProperty()
  @IsUUID()
  rfxId: string;

  @ApiProperty()
  @IsInt()
  @Min(1)
  deliveryPeriod: number;

  @ApiProperty()
  @IsString()
  deliverySite: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  warrantyPeriod: string;

  @ApiProperty()
  @IsInt()
  @Min(0)
  @Max(100)
  liquidityDamage: number;

  @ApiProperty()
  @IsInt()
  @Min(0)
  @Max(100)
  liquidityDamageLimit: number;

  @ApiProperty()
  @IsString()
  paymentTerm: string;

  @ApiProperty()
  @IsArray()
  paymentMode: string[];

  @ApiProperty()
  @IsInt()
  @Min(1)
  paymentReleasePeriod: number;
}

export class UpdateRfxBidContractConditionDTO extends CreateRfxBidContractConditionDTO {
  @ApiProperty()
  @IsString()
  id: string;
}
