import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { DataResponseFormat } from 'src/shared/api-data';
import { File } from '../services/file.service';
import { CreateFileDto, DeleteFileDto } from '../dto/file.dto';

@Controller('File')
@ApiTags('File')
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiExtraModels(DataResponseFormat)
export class FileController {
  constructor(private readonly file: File) {}

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
    return await this.file.uploadAttachment(uploadFileDto);
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
}
