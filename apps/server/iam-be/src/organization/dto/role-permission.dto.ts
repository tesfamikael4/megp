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
  applicationId: string;
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  permissionId: string;
  @ApiProperty()
  @IsNotEmpty()
  applicationName: string;
  @ApiProperty()
  @IsNotEmpty()
  permissionName: string;
  @ApiProperty()
  @IsNotEmpty()
  applicationKey: string;
  @ApiProperty()
  @IsNotEmpty()
  permissionKey: string;
  static fromDto(rolePermissionDto: CreateRolePermissionDto): RolePermission {
    const rolePermission: RolePermission = new RolePermission();
    // if (!rolePermissionDto) {
    //   return;
    // }
    rolePermission.id = rolePermissionDto.id;
    rolePermission.roleId = rolePermissionDto.roleId;

    rolePermission.permissionId = rolePermissionDto.permissionId;

    rolePermission.applicationId = rolePermissionDto.applicationId;

    rolePermission.permissionName = rolePermissionDto.permissionName;

    rolePermission.applicationName = rolePermissionDto.applicationName;

    rolePermission.permissionKey = rolePermissionDto.permissionKey;

    rolePermission.applicationKey = rolePermissionDto.applicationKey;

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
  id: string;
  @ApiProperty()
  @IsUUID()
  @IsOptional()
  seedRoleId: string;
  @ApiProperty()
  @IsUUID()
  @IsOptional()
  seedRoleIdOrgId: string;
  @ApiProperty()
  @IsUUID()
  @IsOptional()
  organizationId: string;
  static fromDto(rolePermissionDto: UpdateRolePermissionDto): RolePermission {
    const rolePermission: RolePermission = new RolePermission();
    // if (!rolePermissionDto) {
    //   return;
    // }
    rolePermissionDto.id = rolePermission.id;

    rolePermission.roleId = rolePermissionDto.roleId;

    rolePermission.permissionId = rolePermissionDto.permissionId;

    rolePermission.applicationId = rolePermissionDto.applicationId;

    rolePermission.permissionName = rolePermissionDto.permissionName;

    rolePermission.applicationName = rolePermissionDto.applicationName;

    rolePermission.permissionKey = rolePermissionDto.permissionKey;

    rolePermission.applicationKey = rolePermissionDto.applicationKey;

    rolePermission.seedRoleId = rolePermissionDto.seedRoleId;

    rolePermission.seedRoleIdOrgId = rolePermissionDto.seedRoleIdOrgId;

    rolePermission.organizationId = rolePermissionDto.organizationId;

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

    rolePermissionDto.applicationId = rolePermission.applicationId;

    rolePermissionDto.permissionName = rolePermission.permissionName;

    rolePermissionDto.applicationName = rolePermission.applicationName;

    rolePermissionDto.permissionKey = rolePermission.permissionKey;

    rolePermissionDto.applicationKey = rolePermission.applicationKey;

    rolePermissionDto.seedRoleId = rolePermission.seedRoleId;

    rolePermissionDto.seedRoleIdOrgId = rolePermission.seedRoleIdOrgId;

    rolePermissionDto.organizationId = rolePermission.organizationId;

    return rolePermissionDto;
  }

  static toDtos(rolePermissions: RolePermission[]) {
    return rolePermissions?.map((rolePermission) =>
      RolePermissionResponseDto.toDto(rolePermission),
    );
  }
}
