import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { OrgAudit } from 'src/shared/entities';

export class CreatePreliminaryAssessment extends OrgAudit {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  bidRegistrationDetailId: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  spdPreliminaryEvaluationId: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  evaluatorId: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  isTeamAssessment: boolean;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  status: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  version: string;
}

export class SubmitDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  lotId: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  bidderId: string;
}
