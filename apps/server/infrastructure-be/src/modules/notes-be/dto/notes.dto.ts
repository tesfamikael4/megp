import { ApiProperty } from '@nestjs/swagger';
import { IsJSON, IsNotEmpty, IsUUID } from 'class-validator';

export class NotesDto {
  @ApiProperty()
  @IsUUID()
  objectId: string;

  @ApiProperty()
  @IsNotEmpty()
  objectType: string;

  @ApiProperty()
  @IsUUID()
  parentId?: string;

  @ApiProperty()
  @IsNotEmpty()
  content: string;

  @ApiProperty()
  @IsJSON()
  metaData: any;
}

export class CreateNotesDto extends NotesDto {
  @ApiProperty()
  @IsUUID()
  id: string;
}

export class UpdateNotesDto extends CreateNotesDto {}
