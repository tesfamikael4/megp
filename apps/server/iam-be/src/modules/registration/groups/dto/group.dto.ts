import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateGroupDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;
}

export class UpdateGroupDto extends CreateGroupDto {
  @ApiProperty()
  @IsString()
  id: string;
}

export class GroupResponseDto extends UpdateGroupDto {}
