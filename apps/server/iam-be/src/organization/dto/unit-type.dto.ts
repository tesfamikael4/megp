import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';
import { UnitType } from '../entities/unit-type.entity';
import { UnitResponseDto } from './unit.dto';

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
    // if (!unitTypeDto) {
    //   return;
    // }
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
  @ApiProperty()
  @IsString()
  id: string;
  units: UnitResponseDto[];

  static fromDto(unitTypeDto: UpdateUnitTypeDto): UnitType {
    const unitType: UnitType = new UnitType();
    // if (!unitTypeDto) {
    //   return;
    // }
    unitType.id = unitTypeDto.id;

    unitType.name = unitTypeDto.name;

    unitType.description = unitTypeDto.description;

    unitType.organizationId = unitTypeDto.organizationId;

    return unitType;
  }
}

export class UnitTypeResponseDto extends UpdateUnitTypeDto {
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
