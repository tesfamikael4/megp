import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';

import { v4 as uuidv4 } from 'uuid';
import { Server } from '@tus/server';
import { S3Store } from '@tus/s3-store';
import * as Minio from 'minio';
import { GlobalExceptionFilter } from './shared/exceptions/global-exception.filter';
//import { JwtAuthGuard } from './authorization';

async function bootstrap() {
  const app: NestExpressApplication = await NestFactory.create(AppModule, {
    cors: true,
  });

  app.enableCors();

  const config: ConfigService = app.get(ConfigService);
  const port: number = config.get<number>('PORT') || 3000;

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  app.useGlobalFilters(new GlobalExceptionFilter());

  // const reflector = app.get(Reflector);
  // app.useGlobalGuards(new JwtAuthGuard(reflector));

  app.setGlobalPrefix('api');

  //Tus server started
  const minioClient = new Minio.Client({
    endPoint: 'localhost',
    port: 9000,
    useSSL: false,
    accessKey: process.env.ACCESSKEY,
    secretKey: process.env.SECRETKEY,
  });

  const s3Store = new S3Store({
    partSize: 8 * 1024 * 1024,
    s3ClientConfig: {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      s3Client: minioClient,
      bucket: 'your-minio-bucket',
    },
  });

  const server = new Server({ path: '/files', datastore: s3Store });

  server.get('/see', (req, res) => {
    // Handle the GET request logic
    res.write('Hello, World!');
    res.end();
  });
  server.listen({ port: 8000 }, () => {
    console.log('Server is running on port 8000');
  });

  // Tus Server Ends

  const document = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle('Vendor Registration API')
      .setDescription('My Vendor Registration API')
      .addBearerAuth()
      .build(),
  );
  const customOptions: SwaggerCustomOptions = {
    swaggerOptions: { docExpansion: 'none' },
  };

  SwaggerModule.setup('docs', app, document, customOptions);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  await app.listen(port, () => {
    console.log('[WEB]', config.get<string>('BASE_URL') + '/docs');
  });
}

bootstrap();
