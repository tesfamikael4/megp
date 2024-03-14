import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateAdhocTeamDto {
  @ApiProperty()
  @IsString()
  @IsUUID()
  procurementInstitutionId: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  organizationId: string;

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
