import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class CreateProcurementThresholdDto {
  @ApiProperty()
  @IsString()
  procurementType: string;
  @ApiProperty()
  @IsString()
  minThreshold: number;
  @ApiProperty()
  @IsString()
  maxThreshold: number;
  @ApiProperty()
  @IsString()
  procurementMethod: string;
  @ApiProperty()
  @IsString()
  approvalDelegation: string;
}
export class UpdateProcurementThresholdDto extends CreateProcurementThresholdDto {
  @ApiProperty({
    format: 'uuid',
    required: true,
  })
  @IsUUID()
  id: string;
}
