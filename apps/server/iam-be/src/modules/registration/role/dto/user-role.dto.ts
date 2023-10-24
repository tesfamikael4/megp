import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsString, IsOptional } from 'class-validator';
import { UserRole } from '../entities/user-role.entity';
import { UserResponseDto } from '../../organization/dto/user.dto';
import { RoleResponseDto } from './role.dto';
export class CreateUserRoleDto {
  @ApiProperty()
  @IsUUID()
  userId: string;
  @ApiProperty()
  @IsUUID()
  roleId: string;
  @ApiProperty()
  static fromDto(userRoleDto: CreateUserRoleDto): UserRole {
    const userRole: UserRole = new UserRole();
    userRole.userId = userRoleDto.userId;
    userRole.roleId = userRoleDto.roleId;

    return userRole;
  }

  static fromDtos(userRoleDto: CreateUserRoleDto[]) {
    return userRoleDto?.map((userRole) => CreateUserRoleDto.fromDto(userRole));
  }
}

export class UpdateUserRoleDto extends CreateUserRoleDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  id: string;
  static fromDto(userRoleDto: UpdateUserRoleDto): UserRole {
    const userRole: UserRole = new UserRole();
    userRole.id = userRoleDto.id;
    userRole.userId = userRoleDto.userId;
    userRole.roleId = userRoleDto.roleId;
    return userRole;
  }
}

export class UserRoleResponseDto extends UpdateUserRoleDto {
  role: RoleResponseDto;
  user: UserResponseDto;
  static toDto(userRole: UserRole): UserRoleResponseDto {
    const userRoleDto: UserRoleResponseDto = new UserRoleResponseDto();

    userRoleDto.id = userRole.id;

    userRoleDto.id = userRole.id;
    userRoleDto.userId = userRole.userId;
    userRoleDto.roleId = userRole.roleId;
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
