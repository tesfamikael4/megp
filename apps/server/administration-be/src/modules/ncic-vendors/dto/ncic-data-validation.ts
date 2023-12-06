import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';
import { NcicVendor } from '@entities';

export class NcicDataValidation {
  @ApiProperty({ isArray: true, type: () => NcicVendor })
  @IsArray()
  ncicDataValidation: NcicVendor[];
}
