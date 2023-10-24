import { ApiProperty } from '@nestjs/swagger';
import { UnitType } from '../entities/unit-type.entity';
import { UnitResponseDto } from './unit.dto';
import { IsString, IsUUID } from 'class-validator';

export class CreateUnitTypeDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsUUID()
  organizationId: string;

  static fromDto(unitTypeDto: CreateUnitTypeDto): UnitType {
    const unitType: UnitType = new UnitType();
    unitType.name = unitTypeDto.name;

    unitType.description = unitTypeDto.description;

    unitType.organizationId = unitTypeDto.organizationId;

    return unitType;
  }

  static fromDtos(unitTypeDto: CreateUnitTypeDto[]) {
    return unitTypeDto?.map((unitType) => CreateUnitTypeDto.fromDto(unitType));
  }
}

export class UpdateUnitTypeDto extends CreateUnitTypeDto {
  id: string;

  static fromDto(unitTypeDto: UpdateUnitTypeDto): UnitType {
    const unitType: UnitType = new UnitType();
    unitType.id = unitTypeDto.id;

    unitType.name = unitTypeDto.name;

    unitType.description = unitTypeDto.description;

    unitType.organizationId = unitTypeDto.organizationId;

    return unitType;
  }
}

export class UnitTypeResponseDto extends UpdateUnitTypeDto {
  units: UnitResponseDto[];
  static toDto(unitType: UnitType): UnitTypeResponseDto {
    const unitTypeDto: UnitTypeResponseDto = new UnitTypeResponseDto();

    unitTypeDto.id = unitType.id;

    unitTypeDto.name = unitType.name;

    unitTypeDto.description = unitType.description;

    unitTypeDto.organizationId = unitType.organizationId;
    if (unitType.units) {
      unitTypeDto.units = UnitResponseDto.toDtos(unitType.units);
    }

    return unitTypeDto;
  }

  static toDtos(unitTypes: UnitType[]) {
    return unitTypes?.map((unitType) => UnitTypeResponseDto.toDto(unitType));
  }
}
