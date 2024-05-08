import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateUnitOfMeasurementDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  abbreviation: string;

  @ApiProperty()
  @IsNotEmpty()
  measurementId: string;
}

export class UpdateUnitOfMeasurementDto extends CreateUnitOfMeasurementDto {
  @ApiProperty()
  @IsUUID()
  id: string;
}

export class UnitOfMeasurementResponseDto extends UpdateUnitOfMeasurementDto {}
