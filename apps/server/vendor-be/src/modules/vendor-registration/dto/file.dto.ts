import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { FilesEntity } from 'src/entities';

export class CreateFileDto {
  // @ApiProperty()
  // id: string;
  @ApiProperty()
  @IsNotEmpty()
  // @IsUUID()
  ownerId: string;
  @ApiProperty()
  @IsNotEmpty()
  fileName: string;
  attachmentUrl: string;
  fileType: string;
  path: string;
  originalName: string;
  @ApiProperty()
  @IsNotEmpty()
  bucketName: string;

  // @ApiProperty()
  /**
   *A method that mapes  CreateAttachmentCommand object data to  Attachment domain object
   *@returns Attachment domain object which contains Attachment  information
   */
  static fromDto(attachmentCommand: CreateFileDto): FilesEntity {
    const attachment: FilesEntity = new FilesEntity();
    attachment.vendorId = attachmentCommand.ownerId;
    attachment.fileName = attachmentCommand.fileName;
    attachment.attachmentUrl = attachmentCommand.attachmentUrl;
    attachment.fileType = attachmentCommand.fileType;
    attachment.path = attachmentCommand.path;
    attachment.originalName = attachmentCommand.originalName;
    attachment.bucketName = attachmentCommand.bucketName;
    return attachment;
  }
}

export class GetFileDto {
  @ApiProperty()
  @IsNotEmpty()
  fileName: string;

  @ApiProperty()
  @IsNotEmpty()
  bucketName: string;

  @ApiProperty()
  @IsNotEmpty()
  destination: string;
}

export class DeleteFileDto {
  @ApiProperty()
  @IsNotEmpty()
  fileName: string;

  @ApiProperty()
  @IsNotEmpty()
  bucketName: string;
}
export class FileResponseDto {
  @ApiProperty()
  @IsNotEmpty()
  // @IsUUID()
  ownerId: string;
  @ApiProperty()
  @IsNotEmpty()
  fileName: string;
  @ApiProperty()
  @IsNotEmpty()
  fileType: string;
  path: string;
  originalName: string;
  @ApiProperty()
  @IsNotEmpty()
  bucketName: string;
  static toResponseDto(entity: FilesEntity): FileResponseDto {
    const response: FileResponseDto = new FileResponseDto();
    response.fileName = entity.fileName;
    response.fileType = entity.fileType;
    response.path = entity.path;
    response.originalName = entity.originalName;
    response.bucketName = entity.bucketName;
    return response;
  }
}
export class UploadFileDto {
  @ApiProperty()
  @IsNotEmpty()
  transactionNumber: string;
  @ApiProperty()
  @IsNotEmpty()
  // @IsUUID()
  invoiceIds: string[];
  @ApiProperty()
  // @IsNotEmpty()
  @IsOptional()
  userInfo: any;

  attachment: string;
}
