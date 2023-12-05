import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';
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
export class UpdateTaxPayerDto extends CreateTaxPayerDto {
  @ApiProperty({
    format: 'uuid',
    required: true,
  })
  @IsUUID()
  id: string;
}
