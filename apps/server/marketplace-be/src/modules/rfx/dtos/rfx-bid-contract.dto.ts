import {
  IsString,
  IsUUID,
  IsInt,
  Min,
  Max,
  IsArray,
  IsOptional,
  IsNumber,
  IsBoolean,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRfxBidContractConditionDTO {
  @ApiProperty()
  @IsUUID()
  rfxId: string;

  @ApiProperty()
  @Min(0)
  @Max(100)
  liquidityDamage: number;

  @ApiProperty()
  @Min(0)
  @Max(100)
  liquidityDamageLimit: number;

  @ApiProperty()
  @IsBoolean()
  isPartialAllowed: boolean;

  @ApiProperty()
  @IsInt()
  @Min(1)
  paymentReleasePeriod: number;

  @ApiProperty()
  @IsArray()
  contractTerms: string[];
}

export class UpdateRfxBidContractConditionDTO extends CreateRfxBidContractConditionDTO {
  @ApiProperty()
  @IsString()
  id: string;
}
