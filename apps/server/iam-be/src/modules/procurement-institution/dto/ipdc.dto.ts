import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { TEAM_TYPE_ENUM } from 'src/shared/enums/team-type.enum';

export class CreateIPDCDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
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

export class UpdateIPDCDto extends CreateIPDCDto {
  @ApiProperty()
  @IsString()
  id: string;
}

export class IPDCDto extends UpdateIPDCDto {}

export class IPDCTeamChangeStatusDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  status: TEAM_TYPE_ENUM;
}
