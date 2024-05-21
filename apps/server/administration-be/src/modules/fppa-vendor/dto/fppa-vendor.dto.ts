import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateFppaVendorDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  @IsNumber()
  supplierCode: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  supplierName: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  emailOfficial: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  website: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  businessTelephone: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  mobileNumber: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  postalAddress: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  businessPremise: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  expireDate: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  signature: string;

  @ApiProperty()
  @IsNumber()
  branchName: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  accountName: string;

  @ApiProperty()
  @IsNumber()
  accountNumber: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  tradingName: string;

  @ApiProperty()
  @IsString()
  companyTin: string;

  @ApiProperty()
  @IsNumber()
  numberEmployeesStaff: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  shareholderFirstName: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  shareholderLastName: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  gender: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  contactNumber: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  businessType: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  nationality: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  businessLocation: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  country: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  supplierStatus: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  applicationType: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  dgApproval: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  bankName: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  accountType: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  currency: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  msmeType: string;

  @ApiProperty()
  @IsString()
  goods_category: string;

  @ApiProperty()
  @IsString()
  services_category: string;
}
export class UpdateFppaVendorDto extends CreateFppaVendorDto {
  @ApiProperty({
    format: 'uuid',
    required: true,
  })
  id: string;
}
