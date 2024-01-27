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
  user: UserResponseDto;
}
