import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateTeamMemberDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  teamId: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  personnelId: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  personnelName: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  isTeamLead: string;
}

export class BulkTeamMemberDto {
  @ApiProperty({ isArray: true, type: () => CreateTeamMemberDto })
  @IsArray()
  members: CreateTeamMemberDto[];

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  teamId: string;
}
