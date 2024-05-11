import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsObject, IsString, IsUUID } from 'class-validator';

export class FileUploadDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  originalname: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  contentType: string;

  bucketName: string;
}

export class CreateRfxItemDocumentDto {
  @IsString()
  @IsUUID()
  @ApiProperty()
  rfxItemId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  description: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  title: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  key: string;

  @IsObject()
  @ApiProperty({ isArray: false, type: () => FileUploadDto })
  fileInfo: FileUploadDto;
}
