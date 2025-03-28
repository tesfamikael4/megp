import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class CreateNcicVendorDto {
  @ApiProperty()
  @IsString()
  tin: string;

  @ApiProperty()
  @IsString()
  nameOfFirm: string;

  @ApiProperty()
  @IsString()
  postalAddress: string;

  @ApiProperty()
  @IsString()
  telephoneNumber: string;

  @ApiProperty()
  @IsString()
  email: string;

  @ApiProperty()
  @IsString()
  nationalOfFirm: string;

  @ApiProperty()
  @IsString()
  typeOfRegistration: string;

  @ApiProperty()
  @IsString()
  branch: string;

  @ApiProperty()
  @IsString()
  category: string;

  @ApiProperty()
  @IsString()
  district: string;

  @ApiProperty()
  @IsString()
  region: string;
}
export class UpdateNcicVendorDto extends CreateNcicVendorDto {
  @ApiProperty({
    format: 'uuid',
    required: true,
  })
  @IsUUID()
  id: string;
}
