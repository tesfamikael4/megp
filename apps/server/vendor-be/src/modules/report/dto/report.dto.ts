import { ApiProperty } from '@nestjs/swagger';

export class DateRange {
  fromDate: Date;
  toDate: Date;
}
export class VendorListDto {
  @ApiProperty()
  country: string;
  @ApiProperty()
  district: string;
  @ApiProperty()
  financialClass: string;
  @ApiProperty()
  category: string;
}
