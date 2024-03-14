import { ApiProperty } from '@nestjs/swagger';
import {
  IsUUID,
  IsString,
  IsOptional,
  IsArray,
  IsEmail,
} from 'class-validator';

export class CreateClarificationRequestDTO {
  @ApiProperty()
  @IsString()
  @IsOptional()
  requesterId: string;

  @ApiProperty()
  @IsEmail()
  @IsOptional()
  requesterEmail: string;

  @ApiProperty()
  @IsUUID()
  objectId: string;

  @ApiProperty()
  @IsString()
  objectType: string;

  @ApiProperty()
  @IsString()
  subject: string;

  @ApiProperty()
  @IsString()
  request: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  title: string;

  @ApiProperty()
  @IsOptional()
  fileInfo: any;

  @ApiProperty()
  @IsArray()
  @IsOptional()
  tags: string[];
}

export class UpdateClarificationRequestDTO extends CreateClarificationRequestDTO {
  @ApiProperty()
  @IsUUID()
  id: string;
}
