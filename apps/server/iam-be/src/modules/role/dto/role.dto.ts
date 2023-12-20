import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, IsUUID } from 'class-validator';
import { Role } from '@entities';
import { RolePermissionResponseDto } from './role-permission.dto';

export class CreateRoleDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsBoolean()
  isSystemRole: boolean;

  @ApiProperty()
  @IsUUID()
  @IsOptional()
  organizationId: string;

  static fromDto(roleDto: CreateRoleDto): Role {
    const role: Role = new Role();
    role.name = roleDto.name;

    role.description = roleDto.description;

    role.isSystemRole = roleDto.isSystemRole;

    role.organizationId = roleDto.organizationId;

    return role;
  }

  static fromDtos(roleDto: CreateRoleDto[]) {
    return roleDto?.map((role) => CreateRoleDto.fromDto(role));
  }
}

export class UpdateRoleDto extends CreateRoleDto {
  id: string;

  static fromDto(roleDto: UpdateRoleDto): Role {
    const role: Role = new Role();
    role.id = roleDto.id;

    role.name = roleDto.name;

    role.description = roleDto.description;

    role.isSystemRole = roleDto.isSystemRole;

    role.organizationId = roleDto.organizationId;

    return role;
  }
}

export class RoleResponseDto extends UpdateRoleDto {
  rolePermissions: RolePermissionResponseDto[];
  static toDto(role: Role): RoleResponseDto {
    const roleDto: RoleResponseDto = new RoleResponseDto();

    roleDto.id = role.id;

    roleDto.name = role.name;

    roleDto.description = role.description;

    roleDto.isSystemRole = role.isSystemRole;

    roleDto.organizationId = role.organizationId;
    if (role.rolePermissions) {
      roleDto.rolePermissions = RolePermissionResponseDto.toDtos(
        role.rolePermissions,
      );
    }

    return roleDto;
  }

  static toDtos(roles: Role[]) {
    return roles?.map((role) => RoleResponseDto.toDto(role));
  }
}
