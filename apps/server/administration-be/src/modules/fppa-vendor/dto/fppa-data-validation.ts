import { ApiParam, ApiProperty, ApiResponse } from '@nestjs/swagger';
import { IsAlphanumeric, IsArray, Length } from 'class-validator';
import { FppaVendor } from 'src/entities/fppa-vendor.entity';

export class FppaDataValidation {
  @ApiProperty({ isArray: true, type: () => FppaVendor })
  @IsArray()
  fppaDataValidation: FppaVendor[];
}

@ApiResponse({
  status: 200,
  description: 'Successfully retrieved tax payer information',
  type: FppaVendor,
})
@ApiResponse({ status: 404, description: 'Vendor not found' })
export class GetFPPAVendorByTinDto {
  @ApiProperty({
    description: 'Tax Identification Number (TIN) of the user',
    required: true,
    minLength: 8,
    maxLength: 10,
  })
  @Length(8, 10, { message: 'TIN must be between 8 and 10 characters.' })
  tin: string;
}
