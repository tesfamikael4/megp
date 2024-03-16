import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsUUID,
  IsBoolean,
  IsNumber,
} from 'class-validator';

export class CreateBidSecurityDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  lotId: string;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  bidSecurityRequired: boolean;

  @ApiProperty()
  @IsNumber()
  bidSecurityAmount: number;

  @ApiProperty()
  @IsString()
  bidSecurityCurrency: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  bidSecurityForm: string;
}

export class UpdateBidSecurityDto {
  @ApiProperty()
  @IsUUID()
  id: string;
}

export class SpdBidSecurityDto extends UpdateBidSecurityDto {}
