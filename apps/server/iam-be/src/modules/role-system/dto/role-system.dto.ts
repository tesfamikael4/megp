import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, IsUUID } from 'class-validator';
import { RoleSystem } from '@entities';

export class CreateRoleSystemDto {
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
  @IsUUID()
  @IsOptional()
  organizationId: string;
}

export class UpdateRoleSystemDto extends CreateRoleSystemDto {
  id: string;
}

export class RoleSystemResponseDto extends UpdateRoleSystemDto {}
