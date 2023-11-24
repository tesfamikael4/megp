import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Column } from 'typeorm';

export class CreateTaxPayerDto {
  @ApiProperty()
  @IsString()
  tin: string;

  @ApiProperty()
  @IsString()
  taxpayerName: string;

  @ApiProperty()
  @IsString()
  tradingNames: string[];

  @ApiProperty()
  @IsString()
  postalAddress: string;

  @ApiProperty()
  @IsString()
  businessSectorISIC: string;

  @ApiProperty()
  @IsString()
  taxpayerSegment: string;

  @ApiProperty()
  @IsString()
  registrationDate: Date;
}
