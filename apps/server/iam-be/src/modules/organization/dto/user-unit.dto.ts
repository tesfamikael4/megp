import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsString, IsOptional } from 'class-validator';
import { UserUnit } from '@entities';
import { UserResponseDto } from './user.dto';
import { UnitResponseDto } from './unit.dto';
export class CreateUserUnitDto {
  @ApiProperty()
  @IsUUID()
  userId: string;
  @ApiProperty()
  @IsUUID()
  unitId: string;
  static fromDto(userUnitDto: CreateUserUnitDto): UserUnit {
    const userUnit: UserUnit = new UserUnit();
    userUnit.userId = userUnitDto.userId;
    userUnit.unitId = userUnitDto.unitId;

    return userUnit;
  }

  static fromDtos(userUnitDto: CreateUserUnitDto[]) {
    return userUnitDto?.map((userUnit) => CreateUserUnitDto.fromDto(userUnit));
  }
}

export class UpdateUserUnitDto extends CreateUserUnitDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  id: string;

  static fromDto(userUnitDto: UpdateUserUnitDto): UserUnit {
    const userUnit: UserUnit = new UserUnit();
    userUnit.id = userUnitDto.id;
    userUnit.userId = userUnitDto.userId;
    userUnit.unitId = userUnitDto.unitId;

    return userUnit;
  }
}

export class UserUnitResponseDto extends UpdateUserUnitDto {
  user: UserResponseDto;
  unit: UnitResponseDto;
  static toDto(userUnit: UserUnit): UserUnitResponseDto {
    const userUnitDto: UserUnitResponseDto = new UserUnitResponseDto();

    userUnitDto.id = userUnit.id;
    userUnitDto.userId = userUnit.userId;
    userUnitDto.unitId = userUnit.unitId;

    return userUnitDto;
  }

  static toDtos(userUnits: UserUnit[]) {
    return userUnits?.map((userUnit) => UserUnitResponseDto.toDto(userUnit));
  }
}
