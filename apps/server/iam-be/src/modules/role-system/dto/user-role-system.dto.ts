import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsString, IsOptional, IsNumber } from 'class-validator';
import { UserRoleSystem } from '@entities';
import { UserResponseDto } from '../../organization/dto/user.dto';
import { RoleSystemResponseDto } from './role-system.dto';
export class CreateUserRoleSystemDto {
  @ApiProperty()
  @IsUUID()
  userId: string;
  @ApiProperty()
  @IsNumber()
  roleSystemId: number;
}

export class UpdateUserRoleSystemDto extends CreateUserRoleSystemDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  id: string;
}

export class UserRoleSystemResponseDto extends UpdateUserRoleSystemDto {
  roleSystem: RoleSystemResponseDto;
  user: any;

  static toDto(permission: UserRoleSystem): UserRoleSystemResponseDto {
    const permissionDto: UserRoleSystemResponseDto =
      new UserRoleSystemResponseDto();

    permissionDto.id = permission.id;

    permissionDto.roleSystemId = permission.roleSystemId;

    permissionDto.userId = permission.userId;

    permissionDto.user = {
      id: permission.user.id,
      firstName: permission.user.account.firstName,
      lastName: permission.user.account.lastName,
      email: permission.user.account.email,
    };

    return permissionDto;
  }

  static toDtos(permissions: UserRoleSystem[]) {
    return permissions?.map((permission) =>
      UserRoleSystemResponseDto.toDto(permission),
    );
  }
}
