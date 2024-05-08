import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
export class CreateMeasurementDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsOptional()
  description: string;
}

export class UpdateMeasurementDto extends CreateMeasurementDto {
  @ApiProperty()
  @IsUUID()
  id: string;
}

export class MeasurementResponseDto extends UpdateMeasurementDto {}
