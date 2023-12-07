import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';
import { TaxPayer } from '@entities';

export class TinValidation {
  @ApiProperty({ isArray: true, type: () => TaxPayer })
  @IsArray()
  tinValidation: TaxPayer[];
}
