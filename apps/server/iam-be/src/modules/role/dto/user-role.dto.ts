import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsString, IsOptional } from 'class-validator';
import { UserRole } from '@entities';
import { UserResponseDto } from '../../organization/dto/user.dto';
import { RoleResponseDto } from './role.dto';
export class CreateUserRoleDto {
  @ApiProperty()
  @IsUUID()
  userId: string;
  @ApiProperty()
  @IsUUID()
  roleId: string;
}

export class UpdateUserRoleDto extends CreateUserRoleDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  id: string;
}

export class UserRoleResponseDto extends UpdateUserRoleDto {
  role: RoleResponseDto;
  user: any;

  static toDto(permission: UserRole): UserRoleResponseDto {
    const permissionDto: UserRoleResponseDto = new UserRoleResponseDto();

    permissionDto.id = permission.id;

    permissionDto.roleId = permission.roleId;

    permissionDto.userId = permission.userId;

    permissionDto.user = {
      id: permission.user.id,
      firstName: permission.user.account.firstName,
      lastName: permission.user.account.lastName,
      email: permission.user.account.email,
    };

    return permissionDto;
  }

  static toDtos(permissions: UserRole[]) {
    return permissions?.map((permission) =>
      UserRoleResponseDto.toDto(permission),
    );
  }
}
