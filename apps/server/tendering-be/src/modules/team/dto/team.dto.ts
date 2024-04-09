import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsUUID } from 'class-validator';
import { TeamTypeEnum } from 'src/shared/enums/team-type.enum';

export class CreateTeamDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  lotId: string;

  @ApiProperty()
  // { enum: TeamTypeEnum }
  // @IsEnum(TeamTypeEnum)
  teamType: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  memberLimit: number;
}
