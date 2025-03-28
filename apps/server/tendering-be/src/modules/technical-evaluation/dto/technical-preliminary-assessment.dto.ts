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
  lotId: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  tenderId: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  bidderId: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  spdPreliminaryEvaluationId: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  isTeamAssessment: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  checked: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  remark: string;
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
export class CompleteBidderEvaluationDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  lotId: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  bidderId: string;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  isTeamLead: boolean;
}
export class CompleteScoringBidderEvaluationDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  lotId: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  bidderId: string;
}

export class CompleteResponsivenessBidderEvaluationDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  lotId: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  itemId: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  bidderId: string;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  isTeamLead: boolean;
}
