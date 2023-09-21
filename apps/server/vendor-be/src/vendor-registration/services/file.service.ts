import * as Minio from 'minio';
import * as Fs from 'fs';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateFileDto, DeleteFileDto } from '../dto/file.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FilesEntity } from '../entities/file.entity';

@Injectable()
export class File {
  constructor(
    @InjectRepository(FilesEntity)
    private readonly fileRepository: Repository<FilesEntity>,
  ) {}
  private minioClient = new Minio.Client({
    endPoint: 'localhost',
    port: 9000,
    useSSL: false,
    accessKey: process.env.ACCESSKEY,
    secretKey: process.env.SECRETKEY,
  });
  async getFileNameByVendorId(vendorId: string) {
    try {
      return (
        await this.fileRepository.findOne({ where: { vendorId: vendorId } })
      ).fileName;
    } catch (error) {}
  }
  async getFileNameByVendorIdFileType(vendorId: string, bucketName: string) {
    try {
      return (
        await this.fileRepository.findOne({
          where: { vendorId: vendorId, fileType: bucketName },
        })
      ).fileName;
    } catch (error) {}
  }
  async getAttachment(
    fileName: string,
    bucketName: string,
    destination: string,
  ) {
    try {
      console.log(bucketName, ' : ', fileName, ' : ', destination);
      this.minioClient.fGetObject(
        bucketName,
        fileName,
        destination,
        function (err) {
          if (err) {
            console.log(err);
            return err;
          }
          return 'successfully downloaded';
        },
      );
    } catch (error) {}
  }
  async uploadAttachment(uploadFileDto: CreateFileDto) {
    try {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const filename = uniqueSuffix + '_' + uploadFileDto.fileName;
      const bucket = uploadFileDto.fileType.toLocaleLowerCase();
      const metaData = {
        'Content-Type': 'application/octet-stream',
        'X-Amz-Meta-Testing': 1234,
        example: 5678,
      };
      this.minioClient.fPutObject(
        bucket,
        filename,
        uploadFileDto.path,
        metaData,
        function (err, etag) {
          if (err) return console.log(err);
        },
      );
      const fileEntity = CreateFileDto.fromDto(uploadFileDto);
      const res = await this.fileRepository.save(fileEntity);
      return res;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
      return error;
    }
  }
  async deleteAttachment(deleteFileDto: DeleteFileDto) {
    try {
      await this.minioClient.removeObject(
        deleteFileDto.bucketName,
        deleteFileDto.fileName,
      );
      const result = await this.fileRepository.delete(deleteFileDto.fileName);
      return result.affected > 0 ? true : false;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
      return error;
    }
  }
}
