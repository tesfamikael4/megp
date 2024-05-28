import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { EvaluationResponse } from 'src/utils/enums';

export class CreateEvalResponseDto {
  @ApiProperty()
  @IsUUID()
  vendorId: string;

  @ApiProperty()
  @IsUUID()
  rfxId: string;

  @ApiProperty()
  @IsEnum(EvaluationResponse)
  qualified: EvaluationResponse;

  @ApiProperty()
  @IsString()
  @IsOptional()
  remark: string;

  solRegistrationId: string;
  evaluatorId: string;
  isTeamAssesment: boolean;
}
