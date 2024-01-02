import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { UnitOfMeasurement } from 'src/entities/uom.entity';

export class CreateUnitOfMeasurementDto {
  id: string;
  @ApiProperty()
  @IsNotEmpty()
  name: string;
  @ApiProperty()
  @IsNotEmpty()
  abbreviation: string;
  @ApiProperty()
  @IsNotEmpty()
  measurementId: string;
  @ApiProperty()
  //temporarly set optional
  @IsOptional()
  measurementName: string;
  static fromDto(dto: CreateUnitOfMeasurementDto): UnitOfMeasurement {
    const entity = new UnitOfMeasurement();
    if (!dto) {
      return null;
    }
    entity.name = dto.name;
    entity.abbreviation = dto.abbreviation;
    entity.measurementId = dto.measurementId;
    entity.measurementName = dto.measurementName;
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
    entity.abbreviation = dto.abbreviation;
    entity.measurementId = dto.measurementId;
    entity.measurementName = dto.measurementName;
    entity.createdAt = new Date();
    return entity;
  }
}
export class UnitOfMeasurementResponseDto extends UpdateUnitOfMeasurementDto {
  static fromEntity(entity: UnitOfMeasurement): UnitOfMeasurementResponseDto {
    const response = new UnitOfMeasurementResponseDto();
    response.id = entity.id;
    response.name = entity.name;
    response.abbreviation = entity.abbreviation;
    response.measurementId = entity.measurementId;
    return response;
  }
}
