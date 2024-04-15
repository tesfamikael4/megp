import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { Measurement } from 'src/entities/measurement.entity';

export class CreateMeasurementDto {
  id: string;
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsOptional()
  description: string;

  static fromDto(dto: CreateMeasurementDto): Measurement {
    const entity = new Measurement();
    if (!dto) {
      return null;
    }
    entity.name = dto.name;
    entity.description = dto.description;
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
    entity.description = dto.description;
    entity.createdAt = new Date();
    return entity;
  }
}
export class MeasurementResponseDto extends UpdateMeasurementDto {
  static fromEntity(entity: Measurement): MeasurementResponseDto {
    const response = new MeasurementResponseDto();
    response.id = entity.id;
    response.name = entity.name;
    response.description = entity.description;
    return response;
  }
}
