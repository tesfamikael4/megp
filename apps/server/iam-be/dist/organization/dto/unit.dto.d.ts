import { Unit } from '../entities/unit.entity';
export declare class CreateUnitDto {
  name: string;
  parentId: string;
  organizationId: string;
  static fromDto(unitDto: CreateUnitDto): Unit;
  static fromDtos(unitDto: CreateUnitDto[]): Unit[];
}
export declare class UpdateUnitDto extends CreateUnitDto {
  id: string;
  static fromDto(unitDto: UpdateUnitDto): Unit;
}
export declare class UnitResponseDto extends UpdateUnitDto {
  static toDto(unit: Unit): UnitResponseDto;
  static toDtos(units: Unit[]): UnitResponseDto[];
}
