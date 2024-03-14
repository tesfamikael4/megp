import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsUUID, IsObject } from 'class-validator';

class SorFileDto {
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
  @ApiProperty({ isArray: false, type: () => SorFileDto })
  file: SorFileDto;
}

export class UpdateSorDocumentDto extends CreateSorDocumentDto {
  @IsString()
  @IsUUID()
  @ApiProperty()
  id: string;
}

export class SorDocumentResponseDto extends UpdateSorDocumentDto {}
