import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsNotEmpty, IsUUID } from 'class-validator';

export class TeamMember {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  personnelId: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  personnelName: string;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  isTeamLead: boolean;
}

export class CreateTeamMemberDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  teamId: string;
}

export class BulkTeamMemberDto {
  @ApiProperty({ isArray: true, type: () => TeamMember })
  @IsArray()
  members: TeamMember[];

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  teamId: string;
}
