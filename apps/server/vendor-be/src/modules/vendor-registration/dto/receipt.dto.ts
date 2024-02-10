import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, isNotEmpty } from 'class-validator';

export class ReceiptDto {
  @ApiProperty()
  @IsNotEmpty()
  transactionNumber: string;
  @ApiProperty()
  @IsNotEmpty()
  invoiceIds: string;
  //   @ApiProperty()
  // @IsOptional()
  // attachmentUrl: Express.Multer.File
}
