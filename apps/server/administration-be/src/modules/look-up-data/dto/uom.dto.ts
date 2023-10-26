import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  ValidateIf,
} from 'class-validator';
import { UnitOfMeasurement } from 'src/entities/uom.entity';
export enum MeasurementType {
  Meter = 'meter',
  Second = 'Second',
  kilogram = 'kilogram',
  Mole = 'Mole',
  Ampere = 'Ampere',
  Candella = 'Candella',
  Kelvin = 'Kelvin',
  // Add more measurement types here
}
export class CreateUnitOfMeasurementDto {
  id: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(MeasurementType)
  @ValidateIf((object, value) => value !== MeasurementType.Meter) // Custom validation rule
  name: MeasurementType;
  @ApiProperty()
  @IsNotEmpty()
  shortName: string;
  @ApiProperty()
  @IsNotEmpty()
  code: string;
  @ApiProperty()
  @IsNotEmpty()
  measurementId: string;
  static fromDto(dto: CreateUnitOfMeasurementDto): UnitOfMeasurement {
    const entity = new UnitOfMeasurement();
    if (!dto) {
      return null;
    }
    entity.name = dto.name;
    entity.shortName = dto.shortName;
    entity.code = dto.code;
    entity.measurementId = dto.measurementId;
    return entity;
  }

  static fromDtos(dto: CreateUnitOfMeasurementDto[]): UnitOfMeasurement[] {
    return dto?.map((d) => CreateUnitOfMeasurementDto.fromDto(d));
  }
}

export class UpdateUnitOfMeasurementDto extends CreateUnitOfMeasurementDto {
  @ApiProperty()
  @IsUUID()
  id: string;

  static fromDto(dto: UpdateUnitOfMeasurementDto): UnitOfMeasurement {
    const entity = new UnitOfMeasurement();
    if (!dto) {
      return;
    }
    entity.id = dto.id;
    entity.name = dto.name;
    entity.shortName = dto.shortName;
    entity.code = dto.code;
    entity.measurementId = dto.measurementId;
    entity.createdAt = new Date();
    return entity;
  }
}
export class UnitOfMeasurementResponseDto extends UpdateUnitOfMeasurementDto {
  static fromEntity(entity: UnitOfMeasurement): UnitOfMeasurementResponseDto {
    const response = new UnitOfMeasurementResponseDto();
    response.id = entity.id;
    response.name = MeasurementType[entity.name];
    response.shortName = entity.shortName;
    response.code = entity.code;
    response.measurementId = entity.measurementId;
    return response;
  }
}
