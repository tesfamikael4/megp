import { ApiProperty } from '@nestjs/swagger';
import {
  IsJSON,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateNotesDto {
  @ApiProperty()
  @IsUUID()
  objectId: string;

  @ApiProperty()
  @IsNotEmpty()
  objectType: string;

  @ApiProperty()
  @IsOptional()
  parentId: string;

  @ApiProperty()
  @IsNotEmpty()
  content: string;

  @ApiProperty()
  @IsJSON()
  @IsOptional()
  metaData: any;

  @ApiProperty()
  @IsUUID()
  @IsOptional()
  organizationId: string;
  @ApiProperty()
  @IsString()
  key: string;
}

export class UpdateNotesDto extends CreateNotesDto {
  @ApiProperty()
  @IsUUID()
  id: string;
}
