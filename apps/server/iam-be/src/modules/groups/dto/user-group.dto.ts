import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';
import { UserGroup } from '../entity/user-group.entity';

export class CreateUserGroupDto {
  @ApiProperty()
  @IsUUID()
  userId: string;

  @ApiProperty()
  @IsUUID()
  groupId: string;

  @ApiProperty()
  @IsString()
  userName: string;

  @ApiProperty()
  @IsString()
  groupName: string;

  static fromDto(permissionDto: CreateUserGroupDto): UserGroup {
    const permission: UserGroup = new UserGroup();
    if (!permissionDto) {
      return;
    }

    permission.groupId = permissionDto.groupId;

    permission.userId = permissionDto.userId;

    permission.userId = permissionDto.userId;

    permission.userId = permissionDto.userId;

    return permission;
  }

  static fromDtos(permissionDto: CreateUserGroupDto[]) {
    return permissionDto?.map((permission) =>
      CreateUserGroupDto.fromDto(permission),
    );
  }
}

export class UpdateUserGroupDto extends CreateUserGroupDto {
  @ApiProperty()
  @IsUUID()
  id: string;

  static fromDto(permissionDto: UpdateUserGroupDto): UserGroup {
    const permission: UserGroup = new UserGroup();
    if (!permissionDto) {
      return;
    }
    permission.id = permissionDto.id;

    permission.groupId = permissionDto.groupId;

    permission.userId = permissionDto.userId;

    permission.userName = permissionDto.userName;

    permission.groupName = permissionDto.groupName;

    return permission;
  }
}

export class UserGroupResponseDto extends UpdateUserGroupDto {
  static toDto(permission: UserGroup): UserGroupResponseDto {
    const permissionDto: UserGroupResponseDto = new UserGroupResponseDto();

    permissionDto.id = permission.id;

    permissionDto.groupId = permission.groupId;

    permission.userId = permissionDto.userId;

    permission.userName = permissionDto.userName;

    permission.groupName = permissionDto.groupName;

    return permissionDto;
  }

  static toDtos(permissions: UserGroup[]) {
    return permissions?.map((permission) =>
      UserGroupResponseDto.toDto(permission),
    );
  }
}
