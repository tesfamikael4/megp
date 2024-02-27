import { ApiProperty } from '@nestjs/swagger';

export class FileResponseDto {
  @ApiProperty()
  filename: string;
  @ApiProperty()
  filepath: string;
  @ApiProperty()
  originalname: string;
  @ApiProperty()
  contentType: string;
  @ApiProperty()
  bucketName: string;
  @ApiProperty()
  size?: number;

  constructor(
    filename: string,
    filepath: string,
    originalname: string,
    bucketName: string,
    contentType: string,
    size: number,
  ) {
    this.filename = filename;
    this.filepath = filepath;
    this.originalname = originalname;
    this.bucketName = bucketName;
    this.contentType = contentType;
    this.size = size;
  }
}
