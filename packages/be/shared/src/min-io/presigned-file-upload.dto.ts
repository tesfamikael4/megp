import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

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
