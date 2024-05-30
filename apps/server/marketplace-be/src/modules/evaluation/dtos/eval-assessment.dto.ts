import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { EvaluationResponse } from 'src/utils/enums';

export class CreateEvalAssessmentDto {
  @ApiProperty()
  @IsUUID()
  rfxId: string;

  @ApiProperty()
  @IsEnum(EvaluationResponse)
  qualified: EvaluationResponse;

  @ApiProperty()
  @IsString()
  solRegistrationId: string;

  teamMemberId: string;
  isTeamAssessment: boolean;
}
