import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateGroupDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  organizationId: string;
}

export class UpdateGroupDto extends CreateGroupDto {
  @ApiProperty()
  @IsString()
  id: string;
}

export class GroupResponseDto extends UpdateGroupDto {}
