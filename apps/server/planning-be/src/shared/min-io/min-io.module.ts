import { Module } from '@nestjs/common';
import { MinioModule } from 'nestjs-minio-client';
import { MinIOService } from './min-io.service';

@Module({
  imports: [
    MinioModule.register({
      endPoint: process.env.MINIO_ENDPOINT ?? 'files.megp.peragosystems.com',
      port: Number(process.env.MINIO_PORT ?? 443),
      useSSL: Boolean(process.env.MINIO_USESSL ?? true),
      accessKey: process.env.MINIO_ACCESSKEY ?? 'Szzt6Zo5yEJCfa7ay5sy',
      secretKey:
        process.env.MINIO_SECRETKEY ??
        'dGtjFGcLjKU6pXRYx1tOnqGeycJtxJoavgwqYgDd',
    }),
  ],
  controllers: [],
  providers: [MinIOService],
  exports: [MinIOService],
})
export class MinIOModule {}
