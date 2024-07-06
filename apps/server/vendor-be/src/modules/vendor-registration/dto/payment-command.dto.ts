import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class PaymentCommand {
  @ApiProperty()
  @IsNotEmpty()
  invoiceReference: string;
  @ApiProperty()
  @IsNotEmpty()
  amount: number;
  currency: string;
  applicationKey: string; //Vendor
  callbackUrl: string;
  service: string;
  description: string;
  @ApiProperty()
  @IsOptional()
  status: string
}
export class PaymentReceiptCommand {
  @ApiProperty()
  @IsNotEmpty()
  referenceNo: string;
  @ApiProperty()
  @IsNotEmpty()
  status: string;
  transactionNumber: string;
}
