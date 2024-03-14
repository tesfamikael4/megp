import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsString, IsOptional, IsArray } from 'class-validator';

export class CreateClarificationResponseDTO {
  @ApiProperty()
  @IsString()
  rephrasedQuestion: string;

  @ApiProperty()
  @IsString()
  response: string;

  @ApiProperty()
  @IsOptional()
  fileInfo: any;

  @ApiProperty()
  @IsOptional()
  @IsString()
  title: string;

  @ApiProperty()
  @IsUUID()
  @IsOptional()
  responderId: string;

  @ApiProperty()
  @IsArray()
  clarificationRequests: any[];
}

export class UpdateClarificationResponseDTO extends CreateClarificationResponseDTO {
  @ApiProperty()
  @IsUUID()
  id: string;
}
