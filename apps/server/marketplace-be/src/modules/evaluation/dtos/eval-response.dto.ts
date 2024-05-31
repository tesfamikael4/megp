import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { EvaluationResponse } from 'src/utils/enums';

export class CreateEvalResponseDto {
  @ApiProperty()
  @IsUUID()
  rfxId: string;

  @ApiProperty()
  @IsUUID()
  rfxDocumentaryEvidenceId: string;

  @ApiProperty()
  @IsEnum(EvaluationResponse)
  qualified: EvaluationResponse;

  @ApiProperty()
  @IsString()
  @IsOptional()
  remark: string;

  @ApiProperty()
  @IsString()
  solRegistrationId: string;

  @ApiProperty()
  @IsBoolean()
  isTeamAssessment: boolean;

  openedResponseId: string;
  teamMemberId: string;
}
