import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { RoleSystemPermission } from '@entities';

export class CreateRoleSystemPermissionDto {
  id: string;
  @ApiProperty()
  @IsUUID()
  roleSystemId: string;
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  permissionId: string;
  static fromDto(
    rolePermissionDto: CreateRoleSystemPermissionDto,
  ): RoleSystemPermission {
    const rolePermission: RoleSystemPermission = new RoleSystemPermission();
    rolePermission.id = rolePermissionDto.id;
    rolePermission.roleSystemId = rolePermissionDto.roleSystemId;

    rolePermission.permissionId = rolePermissionDto.permissionId;

    return rolePermission;
  }

  static fromDtos(rolePermissionDto: CreateRoleSystemPermissionDto[]) {
    return rolePermissionDto?.map((rolePermission) =>
      CreateRoleSystemPermissionDto.fromDto(rolePermission),
    );
  }
}

export class UpdateRoleSystemPermissionDto extends CreateRoleSystemPermissionDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  id: string;
  @ApiProperty()
  @IsUUID()
  @IsOptional()
  organizationId: string;
  static fromDto(
    rolePermissionDto: UpdateRoleSystemPermissionDto,
  ): RoleSystemPermission {
    const rolePermission: RoleSystemPermission = new RoleSystemPermission();
    rolePermissionDto.id = rolePermission.id;

    rolePermission.roleSystemId = rolePermissionDto.roleSystemId;

    rolePermission.permissionId = rolePermissionDto.permissionId;

    return rolePermission;
  }
}

export class RolePermissionSystemResponseDto extends UpdateRoleSystemPermissionDto {
  static toDto(
    rolePermission: RoleSystemPermission,
  ): RolePermissionSystemResponseDto {
    const rolePermissionDto: RolePermissionSystemResponseDto =
      new RolePermissionSystemResponseDto();

    rolePermissionDto.id = rolePermission.id;

    rolePermissionDto.roleSystemId = rolePermission.roleSystemId;

    rolePermissionDto.permissionId = rolePermission.permissionId;

    return rolePermissionDto;
  }

  static toDtos(rolePermissions: RoleSystemPermission[]) {
    return rolePermissions?.map((rolePermission) =>
      RolePermissionSystemResponseDto.toDto(rolePermission),
    );
  }
}
