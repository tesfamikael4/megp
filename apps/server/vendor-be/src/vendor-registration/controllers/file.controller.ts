import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiExtraModels,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { DataResponseFormat } from 'src/shared/api-data';
import { File } from '../services/file.service';
import { diskStorage } from 'multer';
import { Multer } from 'multer';
import * as Minio from 'minio';
import { CreateFileDto, DeleteFileDto } from '../dto/file.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('File')
@ApiTags('File')
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiExtraModels(DataResponseFormat)
export class FileController {
  constructor(private readonly file: File) {}
  private minioClient = new Minio.Client({
    endPoint: 'localhost',
    port: 9000,
    useSSL: false,
    accessKey: process.env.ACCESSKEY,
    secretKey: process.env.SECRETKEY,
  });
  @Get('get-fileName-by-vendorId/:vendorId')
  async getFileNameByVendorId(@Param('vendorId') vendorId: string) {
    return await this.file.getFileNameByVendorId(vendorId);
  }
  @Get('get-fileName-byVendorId-fileType/:vendorId/:fileType')
  async getFileNameByVendorIdFileType(
    @Param('vendorId') vendorId: string,
    @Param('fileType') fileType: string,
  ) {
    return await this.file.getFileNameByVendorIdFileType(vendorId, fileType);
  }
  @Post('upload-attachment')
  async uploadAttachment(@Body() uploadFileDto: CreateFileDto) {
    // return await this.file.uploadAttachment(uploadFileDto);
  }
  @Get('get-attachment/:fileName/:fileType/:destination')
  // @ApiQuery({ name: 'destination', required: false })
  async getAttachment(
    @Param('fileName') fileName: string,
    @Param('fileType') fileType: string,
    @Param('destination') destination: string,
  ) {
    // const defaultDestination = destination ? destination : 'C:/megp/' + fileName
    return await this.file.getAttachment(
      fileName.trim(),
      fileType.trim(),
      destination,
    );
  }
  @Delete('delete-attachment')
  async deleteAttachment(@Body() deleteFileDto: DeleteFileDto) {
    return await this.file.deleteAttachment(deleteFileDto);
  }
  // @Post('uts-upload-attachment')
  // async utsUploadAttachment(@Body() uploadFileDto: CreateFileDto) {
  //   return await this.file.utsUploadAttachment(uploadFileDto);
  // }
  @Post('add-attachment')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        ownerId: { type: 'string' },
        bucketName: { type: 'string' },
        fileName: { type: 'string' },
        attachmentUrl: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('attachmentUrl', {
      storage: diskStorage({}),
      fileFilter: (req, file, callback) => {
        if (
          file.mimetype === 'application/pdf' ||
          file.mimetype.startsWith('image/')
        ) {
          callback(null, true);
        } else {
          callback(new Error('Only PDF and image files are allowed'), false);
        }
      },
      limits: { fileSize: Math.pow(2024, 200) },
    }),
  )
  async addAttachment(
    @Body() command: CreateFileDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<any> {
    try {
      return this.file.uploadAttachment(file, command);
    } catch (error) {}
  }
}
