import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsUrl, Min } from 'class-validator';

export class InitiatePaymentDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  invoiceReference: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  amount: number;

  @ApiProperty({
    default: 'MWK',
  })
  @IsNotEmpty()
  @IsString()
  currency: string;

  @ApiProperty({
    default: 'Vendor',
  })
  @IsNotEmpty()
  @IsString()
  applicationKey: string;

  @ApiProperty()
  @IsNotEmpty()
  service: string;

  @ApiProperty()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsUrl()
  callbackUrl: string;
}

export class PaymentCompletedDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  invoiceReference: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  bankReferenceNumber: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  status: string;
}
