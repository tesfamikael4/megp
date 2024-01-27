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
  @IsNumber()
  @IsOptional()
  id: number;
}

export class UserRoleSystemResponseDto extends UpdateUserRoleSystemDto {
  roleSystem: RoleSystemResponseDto;
  user: UserResponseDto;
}
