/* eslint-disable @typescript-eslint/no-empty-function */
import { Injectable, Res, UploadedFile } from '@nestjs/common';
import { Response } from 'express';
import * as Minio from 'minio';
import { BrifecaseEntity } from 'src/entities/brifecase.entity';
import { FileService } from 'src/modules/vendor-registration/services/file.service';
@Injectable()
export class BrifecasesService {
  private minioClient = new Minio.Client({
    endPoint: process.env.MINIO_END_POINT_URL,
    port: parseInt(process.env.MINIO_PORT),
    useSSL: false,
    accessKey: process.env.ACCESSKEY,
    secretKey: process.env.SECRETKEY,
  });
  private bucketName = process.env.BUCKETNAME;
  constructor(private readonly fileService: FileService) {}

  async downloadMyBrifecase(userId: string, fileId: string) {
    try {
      const fileaddress = `${userId}/brifecase/fileId`;
      this.minioClient.getObject(
        this.bucketName,
        fileaddress,
        function (err, dataStream) {
          if (err) {
            return err;
          }
          return 'successfully downloaded';
        },
      );
    } catch (error) {
      throw error;
    }
  }
  async getFile(userId: string, fileId: string, @Res() res: Response) {
    try {
      return this.fileService.getFile(userId, fileId, 'brifecase', res);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async uploadBrifecase(file: Express.Multer.File, userInfo: any) {
    try {
      const fileId = this.fileService.uploadBrifecase(file, userInfo);
      const brifecaseEntity = new BrifecaseEntity();
      brifecaseEntity.userId = userInfo.id;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
