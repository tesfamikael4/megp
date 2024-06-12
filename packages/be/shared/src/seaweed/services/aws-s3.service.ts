import {
  DeleteObjectCommand,
  GetObjectCommand,
  NoSuchKey,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';
import { S3 } from '../types';
import { FileNotFoundException } from '../exceptions';

@Injectable()
export class AwsS3 extends S3 {
  constructor(private readonly s3: S3Client) {
    super();
  }

  async presignedPutObject(
    bucketName: string,
    objectName: string,
    contentType: string,
    duration: number,
  ): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: bucketName ? bucketName : '',
      Key: objectName,
      ContentType: contentType,
    });

    return await getSignedUrl(this.s3, command, {
      expiresIn: duration,
      signingDate: new Date(),
    });
  }

  async presignedGetObject(
    bucketName: string,
    objectName: string,
    contentType: string,
    duration: number,
  ): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: bucketName ? bucketName : '',
      Key: objectName,
    });

    try {
      return await getSignedUrl(this.s3, command, { expiresIn: duration });
    } catch (e) {
      if (e instanceof NoSuchKey) {
        throw new FileNotFoundException(objectName);
      }
    }
  }

  async deleteObject(bucketName: string, objectName: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: bucketName ? bucketName : '',
      Key: objectName,
    });

    await this.s3.send(command);
  }

  async getObject(bucketName: string, objectName: string): Promise<any> {
    const command = new GetObjectCommand({
      Bucket: bucketName ? bucketName : '',
      Key: objectName,
    });

    const result = await this.s3.send(command);
    try {
      return Buffer.from(await result.Body.transformToByteArray());
    } catch (e) {
      if (e instanceof NoSuchKey) {
        throw new FileNotFoundException(objectName);
      }
    }
  }

  async putObject(
    bucketName: string,
    objectName: string,
    data: Buffer,
  ): Promise<void> {
    const command = new PutObjectCommand({
      Bucket: bucketName ? bucketName : '',
      Key: objectName,
      Body: data,
    });

    await this.s3.send(command);
  }
}
