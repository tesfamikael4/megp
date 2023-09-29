import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsString } from 'class-validator';
import { UserRole } from '../entities/user-role.entity';
import { RoleResponseDto } from './role.dto';
import { UserResponseDto } from './employee.dto';
export class CreateUserRoleDto {
  @ApiProperty()
  @IsUUID()
  userId: string;
  @ApiProperty()
  @IsUUID()
  roleId: string;
  @ApiProperty()
  @IsString()
  roleName: string;
  static fromDto(userRoleDto: CreateUserRoleDto): UserRole {
    const userRole: UserRole = new UserRole();
    userRole.userId = userRoleDto.userId;
    userRole.roleId = userRoleDto.roleId;
    userRole.roleName = userRoleDto.roleName;

    return userRole;
  }

  static fromDtos(userRoleDto: CreateUserRoleDto[]) {
    return userRoleDto?.map((userRole) => CreateUserRoleDto.fromDto(userRole));
  }
}

export class UpdateUserRoleDto extends CreateUserRoleDto {
  @ApiProperty()
  @IsString()
  id: string;
  role: RoleResponseDto;
  user: UserResponseDto;
  static fromDto(userRoleDto: UpdateUserRoleDto): UserRole {
    const userRole: UserRole = new UserRole();
    // if (!userRoleDto) {
    //   return;
    // }
    userRole.id = userRoleDto.id;
    userRole.userId = userRoleDto.userId;
    userRole.roleId = userRoleDto.roleId;
    userRole.roleName = userRoleDto.roleName;
    return userRole;
  }
}

export class UserRoleResponseDto extends UpdateUserRoleDto {
  static toDto(userRole: UserRole): UserRoleResponseDto {
    const userRoleDto: UserRoleResponseDto = new UserRoleResponseDto();

    userRoleDto.id = userRole.id;

    userRoleDto.id = userRole.id;
    userRoleDto.userId = userRole.userId;
    userRoleDto.roleId = userRole.roleId;
    userRoleDto.roleName = userRole.roleName;
    if (userRole.role) {
      userRoleDto.role = RoleResponseDto.toDto(userRole.role);
    }
    if (userRole.user) {
      userRoleDto.user = UserResponseDto.toDto(userRole.user);
    }
    return userRoleDto;
  }

  static toDtos(userRoles: UserRole[]) {
    return userRoles?.map((userRole) => UserRoleResponseDto.toDto(userRole));
  }
}
