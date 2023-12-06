import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';
import { FppaVendor } from 'src/entities/fppa-vendor.entity';

export class FppaDataValidation {
  @ApiProperty({ isArray: true, type: () => FppaVendor })
  @IsArray()
  fppaDataValidation: FppaVendor[];
}
