import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { EvaluationResponse } from 'src/utils/enums';

export class CreateEvalItemResponseDto {
  @ApiProperty()
  @IsUUID()
  rfxProductInvitaitonId: string;

  @ApiProperty()
  @IsUUID()
  rfxItemId: string;

  @ApiProperty()
  @IsUUID()
  vendorId: string;

  @ApiProperty()
  @IsEnum(EvaluationResponse)
  qualified: EvaluationResponse;

  @ApiProperty()
  @IsString()
  @IsOptional()
  remark: string;

  solRegistrationId: string;
  evaluatorId: string;
  isTeamAssessment: boolean;
}
