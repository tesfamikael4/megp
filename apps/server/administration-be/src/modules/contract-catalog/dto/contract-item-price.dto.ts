import { ApiProperty } from '@nestjs/swagger';
import {
  IsUUID,
  IsNumber,
  IsDateString,
  IsString,
  IsOptional,
} from 'class-validator';

export class CreateContractItemPriceDto {
  @ApiProperty()
  @IsUUID()
  contactItemId: string;

  @ApiProperty()
  @IsNumber()
  unitPrice: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  currency: string;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  deliveryDate: Date;

  @ApiProperty()
  @IsOptional()
  applicableTax: string;

  @ApiProperty()
  @IsOptional()
  location: { latitude: number; longitude: number };
}
export class UpdateContractItemPriceDto extends CreateContractItemPriceDto {
  @ApiProperty()
  @IsUUID()
  id: string;
}
