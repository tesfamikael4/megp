import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString, IsOptional, IsUUID } from 'class-validator';
import { Unit } from '@entities';
import { UnitTypeResponseDto } from './unit-type.dto';
import { UserUnitResponseDto } from './user-unit.dto';

export class CreateUnitDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  shortName: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  status: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  code: string;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  parentId: string;

  @ApiProperty()
  @IsUUID()
  @IsOptional()
  typeId: string;

  @ApiProperty()
  @IsString()
  organizationId: string;

  static fromDto(unitDto: CreateUnitDto): Unit {
    const unit: Unit = new Unit();

    unit.name = unitDto.name;

    unit.name = unitDto.name;

    unit.code = unitDto.code;

    unit.status = unitDto.status;

    unit.shortName = unitDto.shortName;

    unit.description = unitDto.description;

    unit.parentId = unitDto.parentId;

    unit.typeId = unitDto.typeId;

    unit.organizationId = unitDto.organizationId;

    return unit;
  }

  static fromDtos(unitDto: CreateUnitDto[]) {
    return unitDto?.map((unit) => CreateUnitDto.fromDto(unit));
  }
}

export class UpdateUnitDto extends CreateUnitDto {
  id: string;
  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  isActive: boolean;
  static fromDto(unitDto: UpdateUnitDto): Unit {
    const unit: Unit = new Unit();
    unit.id = unitDto.id;

    unit.name = unitDto.name;

    unit.name = unitDto.name;

    unit.code = unitDto.code;

    unit.status = unitDto.status;

    unit.shortName = unitDto.shortName;

    unit.description = unitDto.description;

    unit.parentId = unitDto.parentId;

    unit.typeId = unitDto.typeId;

    unit.organizationId = unitDto.organizationId;

    return unit;
  }
}

export class UnitResponseDto extends UpdateUnitDto {
  unitType: UnitTypeResponseDto;
  userUnits: UserUnitResponseDto[];
  static toDto(unit: Unit): UnitResponseDto {
    const unitDto: UnitResponseDto = new UnitResponseDto();

    unitDto.id = unit.id;

    unitDto.name = unit.name;

    unitDto.name = unit.name;

    unitDto.code = unit.code;

    unitDto.status = unit.status;

    unitDto.shortName = unit.shortName;

    unitDto.description = unit.description;

    unitDto.organizationId = unit.organizationId;

    if (unit.unitType) {
      unitDto.unitType = UnitTypeResponseDto.toDto(unit.unitType);
    }
    if (unit.userUnits) {
      unitDto.userUnits = UserUnitResponseDto.toDtos(unit.userUnits);
    }

    return unitDto;
  }

  static toDtos(units: Unit[]) {
    return units?.map((unit) => UnitResponseDto.toDto(unit));
  }
}
