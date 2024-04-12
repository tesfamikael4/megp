import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { EnvelopTypeEnum } from 'src/shared/enums';
import { TeamRoleEnum } from 'src/shared/enums/team-type.enum';

export class CreateTeamDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  tenderId: string;

  @ApiProperty({ enum: TeamRoleEnum })
  @IsEnum(TeamRoleEnum)
  teamType: TeamRoleEnum;

  @ApiProperty({ enum: EnvelopTypeEnum })
  @IsEnum(EnvelopTypeEnum)
  envelopeType: EnvelopTypeEnum;
}
