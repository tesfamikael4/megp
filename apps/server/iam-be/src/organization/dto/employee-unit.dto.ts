import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsString } from 'class-validator';
import { UserUnit } from '../entities/user-unit.entity';
import { CreateUserDto, UserResponseDto } from './employee.dto';
import { CreateUnitDto, UnitResponseDto } from './unit.dto';
export class CreateUserUnitDto {
  @ApiProperty()
  @IsUUID()
  userId: string;
  @ApiProperty()
  @IsUUID()
  unitId: string;
  @ApiProperty()
  @IsString()
  unitName: string;
  static fromDto(userUnitDto: CreateUserUnitDto): UserUnit {
    const userUnit: UserUnit = new UserUnit();
    userUnit.userId = userUnitDto.userId;
    userUnit.unitId = userUnitDto.unitId;
    userUnit.unitName = userUnitDto.unitName;

    return userUnit;
  }

  static fromDtos(userUnitDto: CreateUserUnitDto[]) {
    return userUnitDto?.map((userUnit) => CreateUserUnitDto.fromDto(userUnit));
  }
}

export class UpdateUserUnitDto extends CreateUserUnitDto {
  @ApiProperty()
  @IsString()
  id: string;
  user: UserResponseDto;
  unit: UnitResponseDto;

  static fromDto(userUnitDto: UpdateUserUnitDto): UserUnit {
    const userUnit: UserUnit = new UserUnit();
    // if (!userUnitDto) {
    //   return;
    // }
    userUnit.id = userUnitDto.id;
    userUnit.userId = userUnitDto.userId;
    userUnit.unitId = userUnitDto.unitId;
    userUnit.unitName = userUnitDto.unitName;

    return userUnit;
  }
}

export class UserUnitResponseDto extends UpdateUserUnitDto {
  static toDto(userUnit: UserUnit): UserUnitResponseDto {
    const userUnitDto: UserUnitResponseDto = new UserUnitResponseDto();

    userUnitDto.id = userUnit.id;
    userUnitDto.userId = userUnit.userId;
    userUnitDto.unitId = userUnit.unitId;
    userUnitDto.unitName = userUnit.unitName;

    if (userUnit.user) {
      userUnitDto.user = UserResponseDto.toDto(userUnit.user);
    }
    if (userUnit.unit) {
      userUnitDto.unit = UnitResponseDto.fromDto(userUnit.unit);
    }
    return userUnitDto;
  }

  static toDtos(userUnits: UserUnit[]) {
    return userUnits?.map((userUnit) => UserUnitResponseDto.toDto(userUnit));
  }
}
