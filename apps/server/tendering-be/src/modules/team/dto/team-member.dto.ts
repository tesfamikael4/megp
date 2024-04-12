import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsString,
  IsUUID,
} from 'class-validator';
import { CreateTeamDto } from './team.dto';

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

export class BulkCreateWithTeamDto {
  @ApiProperty({ isArray: true, type: () => TeamMember })
  @IsArray()
  members: TeamMember[];

  @ApiProperty()
  @IsNotEmpty()
  team: CreateTeamDto;
}

export class CreateByTenderIdDto {
  @ApiProperty({ isArray: true, type: () => TeamMember })
  @IsArray()
  members: TeamMember[];

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  tenderId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  teamType: string;
}
