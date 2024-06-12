import { Module } from '@nestjs/common';
import { S3Client } from '@aws-sdk/client-s3';
import { StorageService } from './services/storage.service';
import { AwsS3 } from './services/aws-s3.service';
import { S3 } from './types';

@Module({
  providers: [
    {
      provide: S3Client,
      useFactory: () => {
        return new S3Client({
          credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
          },
          endpoint: process.env.AWS_ENDPOINT,
          forcePathStyle: true,
        });
      },
    },
    {
      provide: S3,
      useClass: AwsS3,
    },

    StorageService,
  ],
  controllers: [],
  exports: [StorageService],
})
export class StorageModule {}
