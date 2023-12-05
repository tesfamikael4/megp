import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateCustomerBussinesInfoDto {
  @ApiProperty()
  @IsString()
  tin: string;

  @ApiProperty()
  @IsString()
  businessLicenseNumber: string;

  @ApiProperty()
  @IsString()
  nationality: string;

  @ApiProperty()
  @IsString()
  legalStatus: string;

  @ApiProperty()
  @IsString()
  businessName: string;

  @ApiProperty()
  @IsDate()
  dateRegistered: Date;

  @ApiProperty()
  @IsString()
  @IsOptional()
  organizationName: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  firstName: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  middleName: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  lastName: string;
}
export class UpdateCustomerBussinesInfoDto extends CreateCustomerBussinesInfoDto {
  @ApiProperty({
    format: 'uuid',
    required: true,
  })
  @IsUUID()
  id: string;
}
