import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { Permission } from '@entities';

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
  @IsNumber()
  applicationId: number;

  static fromDto(permissionDto: CreatePermissionDto): Permission {
    const permission: Permission = new Permission();
    if (!permissionDto) {
      return;
    }
    permission.name = permissionDto.name;

    permission.description = permissionDto.description;

    permission.key = permissionDto.key;

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
  @IsNumber()
  @IsOptional()
  id: number;

  static fromDto(permissionDto: UpdatePermissionDto): Permission {
    const permission: Permission = new Permission();
    if (!permissionDto) {
      return;
    }
    permission.id = permissionDto.id;

    permission.name = permissionDto.name;

    permission.description = permissionDto.description;

    permission.key = permissionDto.key;

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

    permission.applicationId = permissionDto.applicationId;

    return permissionDto;
  }

  static toDtos(permissions: Permission[]) {
    return permissions?.map((permission) =>
      PermissionResponseDto.toDto(permission),
    );
  }
}
