import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { TEAM_TYPE_ENUM } from '../../../shared/enums/team-type.enum';

export class CreateAdhocTeamDto {
  @ApiProperty()
  @IsString()
  @IsUUID()
  procurementInstitutionId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  status: string;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  startDate: Date;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  endDate: Date;
}

export class UpdateAdhocTeamDto extends CreateAdhocTeamDto {
  @ApiProperty()
  @IsString()
  id: string;
}

export class AdhocTeamDto extends UpdateAdhocTeamDto {}

export class AdhocTeamChangeStatusDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  status: TEAM_TYPE_ENUM;
}
