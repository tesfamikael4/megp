import { ApiProperty, ApiResponse } from '@nestjs/swagger';
import { IsArray, IsDateString, IsNotEmpty, Length } from 'class-validator';
import { TaxPayer } from '@entities';

export class TinValidation {
  @ApiProperty({ isArray: true, type: () => TaxPayer })
  @IsArray()
  tinValidation: TaxPayer[];
}

@ApiResponse({
  status: 200,
  description: 'Successfully retrieved tax payer information',
  type: TaxPayer,
})
@ApiResponse({ status: 404, description: 'Tax Payer not found' })
export class GetUserByTinAndIssuedDateDto {
  @ApiProperty({
    description: 'Tax Identification Number (TIN) of the user',
    type: String,
    required: true,
  })
  @IsNotEmpty({ message: 'TIN is required.' })
  @Length(8, 10, { message: 'TIN must be 8 or 10 digits.' })
  tin: string;

  @ApiProperty({
    description:
      'Date when the user information was issued like 2023-12-20 or date format yyyy-mm-dd',
    type: String,
    required: true,
  })
  @IsNotEmpty({ message: 'TIN is required.' })
  @IsDateString(
    { strict: true },
    { message: 'Invalid date format. Use yyyy-mm-dd.' },
  )
  issuedDate: string;
}
