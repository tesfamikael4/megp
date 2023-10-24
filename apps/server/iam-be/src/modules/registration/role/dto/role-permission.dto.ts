import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { RolePermission } from '../entities/role-permission.entity';

export class CreateRolePermissionDto {
  id: string;
  @ApiProperty()
  @IsUUID()
  roleId: string;
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  permissionId: string;
  static fromDto(rolePermissionDto: CreateRolePermissionDto): RolePermission {
    const rolePermission: RolePermission = new RolePermission();
    rolePermission.id = rolePermissionDto.id;
    rolePermission.roleId = rolePermissionDto.roleId;

    rolePermission.permissionId = rolePermissionDto.permissionId;

    return rolePermission;
  }

  static fromDtos(rolePermissionDto: CreateRolePermissionDto[]) {
    return rolePermissionDto?.map((rolePermission) =>
      CreateRolePermissionDto.fromDto(rolePermission),
    );
  }
}

export class UpdateRolePermissionDto extends CreateRolePermissionDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  id: string;
  @ApiProperty()
  @IsUUID()
  @IsOptional()
  organizationId: string;
  static fromDto(rolePermissionDto: UpdateRolePermissionDto): RolePermission {
    const rolePermission: RolePermission = new RolePermission();
    rolePermissionDto.id = rolePermission.id;

    rolePermission.roleId = rolePermissionDto.roleId;

    rolePermission.permissionId = rolePermissionDto.permissionId;

    return rolePermission;
  }
}

export class RolePermissionResponseDto extends UpdateRolePermissionDto {
  static toDto(rolePermission: RolePermission): RolePermissionResponseDto {
    const rolePermissionDto: RolePermissionResponseDto =
      new RolePermissionResponseDto();

    rolePermissionDto.id = rolePermission.id;

    rolePermissionDto.roleId = rolePermission.roleId;

    rolePermissionDto.permissionId = rolePermission.permissionId;

    return rolePermissionDto;
  }

  static toDtos(rolePermissions: RolePermission[]) {
    return rolePermissions?.map((rolePermission) =>
      RolePermissionResponseDto.toDto(rolePermission),
    );
  }
}
