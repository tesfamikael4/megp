import { ApiOperation, ApiProperty, ApiResponse } from '@nestjs/swagger';
import { IsArray, Length } from 'class-validator';
import { CustomerBussinesInfo } from '@entities';

export class TraderDataValidation {
  @ApiProperty({ isArray: true, type: () => CustomerBussinesInfo })
  @IsArray()
  traderDataValidation: CustomerBussinesInfo[];
}

@ApiResponse({
  status: 200,
  description: 'Successfully retrieved trader information',
  type: CustomerBussinesInfo,
})
@ApiResponse({ status: 404, description: 'Trader Information not found' })
export class GetTraderInfoDto {
  @ApiProperty({
    description: 'Tax Identification Number (TIN) of the trader',
    required: true,
    minLength: 8,
    maxLength: 10,
  })
  @ApiProperty({
    description: 'Tax Identification Number (TIN) of the trader',
    type: String,
    required: true,
  })
  @Length(8, 10, { message: 'TIN must be between 8 and 10 characters.' })
  tin: string;

  @ApiProperty({
    description: 'Trade License Number of the trader',
    type: String,
    required: true,
  })
  licenseNumber: string;
}
