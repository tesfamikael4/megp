import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { CreateProcurementThresholdDto } from './create-procurement-threshold.dto';

export class UpdateProcurementThresholdDto extends CreateProcurementThresholdDto {
  @ApiProperty({
    format: 'uuid',
    required: true,
  })
  @IsUUID()
  id: string;
}
