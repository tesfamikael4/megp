import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { CreateTaxPayerDto } from './create-tax-payer.dto';

export class UpdateTaxPayerDto extends CreateTaxPayerDto {
  @ApiProperty({
    format: 'uuid',
    required: true,
  })
  @IsUUID()
  id: string;
}
