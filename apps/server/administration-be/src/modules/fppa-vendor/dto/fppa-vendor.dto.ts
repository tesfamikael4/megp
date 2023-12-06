import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class CreateFppaVendorDto {
  @ApiProperty()
  @IsString()
  tin: string;

  @ApiProperty()
  @IsString()
  supplierCode: string;

  @ApiProperty()
  @IsString()
  supplierName: string;

  @ApiProperty()
  @IsString()
  businessType: string;

  @ApiProperty()
  @IsString()
  accountNo: string;

  @ApiProperty()
  @IsString()
  accountName: string;

  @ApiProperty()
  @IsString()
  mobileNumber: string;
}
export class UpdateFppaVendorDto extends CreateFppaVendorDto {
  @ApiProperty({
    format: 'uuid',
    required: true,
  })
  @IsUUID()
  id: string;
}
