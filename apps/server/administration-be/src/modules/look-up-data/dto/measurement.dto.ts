import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  ValidateIf,
} from 'class-validator';
import { Measurement } from 'src/entities/measurement.entity';
export enum MeasurementType {
  Length = 'length',
  Time = 'time',
  Mass = 'Mass',
  AmountofMatter = 'AmountofMatter',
  ElectricCurrent = 'ElectricCurrent',
  Luminosity = 'Luminosity',
  Temperature = 'Temperature',
  // Add more measurement types here
}

export enum LengthUnit {
  Meter = 'meter',
  Kilometer = 'kilometer',
  Centimeter = 'centimeter',
}

export enum TimeUnit {
  Second = 'second',
  Minute = 'minute',
  Hour = 'hour',
}
export class CreateMeasurementDto {
  id: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(MeasurementType)
  name: MeasurementType;

  @ApiProperty({ enum: LengthUnit, required: false })
  @IsOptional()
  @ValidateIf((o) => o.name === MeasurementType.Length)
  unitLength: LengthUnit;

  @ApiProperty({ enum: TimeUnit, required: false })
  @IsOptional()
  @ValidateIf((o) => o.name === MeasurementType.Time)
  unitTime: TimeUnit;

  @ApiProperty()
  @IsNotEmpty()
  shortName: string;
  @ApiProperty()
  @IsNotEmpty()
  code: string;

  static fromDto(dto: CreateMeasurementDto): Measurement {
    const entity = new Measurement();
    if (!dto) {
      return null;
    }
    entity.name = dto.name;
    entity.shortName = dto.shortName;
    entity.code = dto.code;
    return entity;
  }

  static fromDtos(dto: CreateMeasurementDto[]): Measurement[] {
    return dto?.map((d) => CreateMeasurementDto.fromDto(d));
  }
}

export class UpdateMeasurementDto extends CreateMeasurementDto {
  @ApiProperty()
  @IsUUID()
  id: string;

  static fromDto(dto: UpdateMeasurementDto): Measurement {
    const entity = new Measurement();
    if (!dto) {
      return;
    }
    entity.id = dto.id;
    entity.name = dto.name;
    entity.shortName = dto.shortName;
    entity.code = dto.code;
    entity.createdAt = new Date();
    return entity;
  }
}
export class MeasurementResponseDto extends UpdateMeasurementDto {
  static fromEntity(entity: Measurement): MeasurementResponseDto {
    const response = new MeasurementResponseDto();
    response.id = entity.id;
    response.name = MeasurementType[entity.name];
    response.shortName = entity.shortName;
    response.code = entity.code;
    return response;
  }
}
