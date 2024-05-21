/* eslint-disable @typescript-eslint/no-empty-function */
import { HttpException, HttpStatus, Injectable, Res, UploadedFile } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Response } from 'express';
import * as Minio from 'minio';
import { BriefecaseEntity } from 'src/entities/brifecase.entity';
import { FileService } from 'src/modules/vendor-registration/services/file.service';
import { Repository } from 'typeorm';
import { BriefCaseDto } from '../dto/briefcase.dto';
@Injectable()
export class BriefcasesService {
    subdirectory: string;
    private minioClient = new Minio.Client({
        endPoint: process.env.MINIO_END_POINT_URL,
        port: parseInt(process.env.MINIO_PORT),
        useSSL: false,
        accessKey: process.env.ACCESSKEY,
        secretKey: process.env.SECRETKEY,
    });
    private bucketName = process.env.BUCKETNAME;
    constructor(private readonly fileService: FileService,
        @InjectRepository(BriefecaseEntity)
        private readonly briefcaseRepository: Repository<BriefecaseEntity>) {
        this.subdirectory = 'briefcases';

    }

    async downloadMyBriefcase(userId: string, fileId: string) {
        try {
            const fileaddress = `${userId}/brifecase/fileId`;
            this.minioClient.getObject(
                this.bucketName,
                fileaddress,
                function (err, dataStream) {
                    if (err) {
                        return err;
                    }
                    return dataStream
                },
            );
        } catch (error) {
            throw error;
        }
    }
    async getFile(userId: string, fileId: string, @Res() res: Response) {
        try {
            return this.fileService.getFile(userId, fileId, this.subdirectory, res);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    async uploadBriefcase(file: Express.Multer.File, briefcase: BriefCaseDto, user: any) {
        try {
            const fileURL = await this.fileService.uploadDocuments(file, user, this.subdirectory);
            const briefcaseEntity = new BriefecaseEntity();
            briefcaseEntity.userId = user.id;
            briefcaseEntity.attachmentId = fileURL;
            briefcaseEntity.name = briefcase.name;
            briefcaseEntity.description = briefcase.description;
            this.briefcaseRepository.save(briefcaseEntity);
        } catch (error) {
            console.log(error);
            throw error;
        }
        return HttpStatus.CREATED;
    }

    async removeBriefcase(id: string, user: any) {
        try {
            const bc = await this.briefcaseRepository.findOne({ where: { id: id } });
            if (bc) {
                const path = `${user.id}/${this.subdirectory}/${bc.attachmentId}`;
                await this.fileService.removeObject(path);
                this.briefcaseRepository.delete(id);
            } else {
                throw new HttpException("briefcase Not found", 404);
            }

        } catch (error) {
            throw Error;
        }
    }
    async getBriefcases(user: any) {
        return await this.briefcaseRepository.find({ where: { userId: user.id } });
    }




}
