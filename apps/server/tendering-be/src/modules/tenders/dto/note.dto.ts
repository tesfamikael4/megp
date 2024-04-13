import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateNoteDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  tenderId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  key: string;

  @ApiProperty()
  @IsOptional()
  @IsObject()
  metadata: any;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  objectId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  objectType: string;
}

export class UpdateNoteDto extends CreateNoteDto {
  @ApiProperty()
  @IsUUID()
  id: string;
}

export class NoteResponseDto extends UpdateNoteDto {}
