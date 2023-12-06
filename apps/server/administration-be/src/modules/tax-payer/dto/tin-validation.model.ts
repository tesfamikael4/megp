import { ApiProperty } from '@nestjs/swagger';
import { CreateTaxPayerDto } from './tax-payer.dto';
import { IsArray } from 'class-validator';
import { TaxPayer } from 'src/entities/tax-payer.entity';

export class TinValidation {
  @ApiProperty({ isArray: true, type: () => TaxPayer })
  @IsArray()
  tinValidation: TaxPayer[];
}
