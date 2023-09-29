import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Permission } from '../entities/permission.entity';
export class CreatePermissionDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsString()
  key: string;

  @ApiProperty()
  @IsString()
  applicationKey: string;

  @ApiProperty()
  @IsString()
  applicationId: string;

  @ApiProperty()
  @IsString()
  applicationName: string;

  static fromDto(permissionDto: CreatePermissionDto): Permission {
    const permission: Permission = new Permission();
    // if (!permissionDto) {
    //   return;
    // }
    permission.name = permissionDto.name;

    permission.description = permissionDto.description;

    permission.key = permissionDto.key;

    permission.applicationKey = permissionDto.applicationKey;

    permission.applicationName = permissionDto.applicationName;

    permission.applicationId = permissionDto.applicationId;

    return permission;
  }

  static fromDtos(permissionDto: CreatePermissionDto[]) {
    return permissionDto?.map((permission) =>
      CreatePermissionDto.fromDto(permission),
    );
  }
}

export class UpdatePermissionDto extends CreatePermissionDto {
  @ApiProperty()
  @IsString()
  id: string;

  static fromDto(permissionDto: UpdatePermissionDto): Permission {
    const permission: Permission = new Permission();
    // if (!permissionDto) {
    //   return;
    // }
    permission.id = permissionDto.id;

    permission.name = permissionDto.name;

    permission.description = permissionDto.description;

    permission.key = permissionDto.key;

    permission.applicationKey = permissionDto.applicationKey;

    permission.applicationName = permissionDto.applicationName;

    permission.applicationId = permissionDto.applicationId;

    return permission;
  }
}

export class PermissionResponseDto extends UpdatePermissionDto {
  static toDto(permission: Permission): PermissionResponseDto {
    const permissionDto: PermissionResponseDto = new PermissionResponseDto();

    permissionDto.id = permission.id;

    permissionDto.name = permission.name;

    permissionDto.description = permission.description;

    permissionDto.key = permission.key;

    permissionDto.applicationKey = permission.applicationKey;

    permissionDto.applicationName = permission.applicationName;

    permissionDto.applicationId = permission.applicationId;

    return permissionDto;
  }

  static toDtos(permissions: Permission[]) {
    return permissions?.map((permission) =>
      PermissionResponseDto.toDto(permission),
    );
  }
}
