import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsUUID, IsObject } from 'class-validator';
import { FileUploadDto } from 'src/shared/min-io';

export class CreateSorDocumentDto {
  @IsString()
  @IsUUID()
  @ApiProperty()
  itemId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  description: string;

  @IsObject()
  @ApiProperty({ isArray: false, type: () => FileUploadDto })
  file: FileUploadDto;
}

export class UpdateSorDocumentDto extends CreateSorDocumentDto {
  @IsString()
  @IsUUID()
  @ApiProperty()
  id: string;
}

export class SorDocumentResponseDto extends UpdateSorDocumentDto {}
