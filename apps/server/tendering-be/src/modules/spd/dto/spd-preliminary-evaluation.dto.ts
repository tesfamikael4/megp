import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateSpdPreliminaryEvaluationDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  spdId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  criteria: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  formLink: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  itbReference: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  itbDescription?: string;
}

export class UpdateSpdPreliminaryEvaluationDto {
  @ApiProperty()
  @IsUUID()
  id: string;
}

export class SpdPreliminaryEvaluationResponseDto extends UpdateSpdPreliminaryEvaluationDto {}
