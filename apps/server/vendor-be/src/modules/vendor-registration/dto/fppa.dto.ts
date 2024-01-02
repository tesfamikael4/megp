import { ApiProperty } from '@nestjs/swagger';

export class FppaData {
  @ApiProperty()
  id: string;
  @ApiProperty()
  tin: string;
  @ApiProperty()
  supplierCode: string;
  @ApiProperty()
  supplierName: string;
  @ApiProperty()
  businessType: string;
  @ApiProperty()
  accountNo: string;
  @ApiProperty()
  accountName: string;
  @ApiProperty()
  mobileNumber: string;
}
