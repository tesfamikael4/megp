import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsString, IsOptional } from 'class-validator';
import { UserRoleSystem } from '@entities';
import { UserResponseDto } from '../../organization/dto/user.dto';
import { RoleSystemResponseDto } from './role-system.dto';
export class CreateUserRoleSystemDto {
  @ApiProperty()
  @IsUUID()
  userId: string;
  @ApiProperty()
  @IsUUID()
  roleSystemId: string;
  @ApiProperty()
  static fromDto(userRoleDto: CreateUserRoleSystemDto): UserRoleSystem {
    const userRoleSystem: UserRoleSystem = new UserRoleSystem();
    userRoleSystem.userId = userRoleDto.userId;
    userRoleSystem.roleSystemId = userRoleDto.roleSystemId;

    return userRoleSystem;
  }

  static fromDtos(userRoleDto: CreateUserRoleSystemDto[]) {
    return userRoleDto?.map((userRoleSystem) =>
      CreateUserRoleSystemDto.fromDto(userRoleSystem),
    );
  }
}

export class UpdateUserRoleSystemDto extends CreateUserRoleSystemDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  id: string;
  static fromDto(userRoleDto: UpdateUserRoleSystemDto): UserRoleSystem {
    const userRoleSystem: UserRoleSystem = new UserRoleSystem();
    userRoleSystem.id = userRoleDto.id;
    userRoleSystem.userId = userRoleDto.userId;
    userRoleSystem.roleSystemId = userRoleDto.roleSystemId;
    return userRoleSystem;
  }
}

export class UserRoleSystemResponseDto extends UpdateUserRoleSystemDto {
  roleSystem: RoleSystemResponseDto;
  user: UserResponseDto;
  static toDto(userRoleSystem: UserRoleSystem): UserRoleSystemResponseDto {
    const userRoleDto: UserRoleSystemResponseDto =
      new UserRoleSystemResponseDto();

    userRoleDto.id = userRoleSystem.id;

    userRoleDto.id = userRoleSystem.id;
    userRoleDto.userId = userRoleSystem.userId;
    userRoleDto.roleSystemId = userRoleSystem.roleSystemId;
    if (userRoleSystem.roleSystem) {
      userRoleDto.roleSystem = userRoleSystem.roleSystem as any;
    }
    if (userRoleSystem.user) {
      userRoleDto.user = UserResponseDto.toDto(userRoleSystem.user);
    }
    return userRoleDto;
  }

  static toDtos(userRoles: UserRoleSystem[]) {
    return userRoles?.map((userRoleSystem) =>
      UserRoleSystemResponseDto.toDto(userRoleSystem),
    );
  }
}
