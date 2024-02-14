import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class DateRange {
  @ApiProperty()
  @IsOptional()
  fromDate: Date;
  @ApiProperty()
  @IsOptional()
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
