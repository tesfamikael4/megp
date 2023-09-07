import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Unit } from '../entities/unit.entity';

export class CreateUnitDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  parentId: string;

  @ApiProperty()
  @IsString()
  organizationId: string;

  static fromDto(unitDto: CreateUnitDto): Unit {
    const unit: Unit = new Unit();

    unit.name = unitDto.name;

    unit.parentId = unitDto.parentId;

    unit.organizationId = unitDto.organizationId;

    return unit;
  }

  static fromDtos(unitDto: CreateUnitDto[]) {
    return unitDto?.map((unit) => CreateUnitDto.fromDto(unit));
  }
}

export class UpdateUnitDto extends CreateUnitDto {
  @ApiProperty()
  @IsString()
  id: string;

  static fromDto(unitDto: UpdateUnitDto): Unit {
    const unit: Unit = new Unit();

    unit.id = unitDto.id;

    unit.name = unitDto.name;

    unit.parentId = unitDto.parentId;

    unit.organizationId = unitDto.organizationId;

    return unit;
  }
}

export class UnitResponseDto extends UpdateUnitDto {
  static toDto(unit: Unit): UnitResponseDto {
    const unitDto: UnitResponseDto = new UnitResponseDto();

    unitDto.id = unit.id;

    unitDto.name = unit.name;

    unitDto.parentId = unit.parentId;

    unitDto.organizationId = unit.organizationId;

    return unitDto;
  }

  static toDtos(units: Unit[]) {
    return units?.map((unit) => UnitResponseDto.toDto(unit));
  }
}
