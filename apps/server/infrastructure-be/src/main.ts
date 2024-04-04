import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { GlobalExceptionFilter } from 'megp-shared-be';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app: NestExpressApplication = await NestFactory.create(AppModule, {
    cors: true,
  });

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RMQ_URL],
      queue: 'work-plan-initiate',
      queueOptions: {
        durable: false,
      },
    },
  });
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RMQ_URL],
      queue: 'send-notification',
      queueOptions: {
        durable: false,
      },
    },
  });

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      // noAck: false,
      urls: [process.env.RMQ_URL],
      queue: 'notifications',
      queueOptions: {
        durable: false,
      },
    },
  });

  await app.startAllMicroservices();

  app.enableCors();

  const port: number = Number(process.env.PORT) || 3000;

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  app.useGlobalFilters(new GlobalExceptionFilter());

  app.setGlobalPrefix('api');
  const customOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      docExpansion: 'none',
    },
  };

  const document = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle('Infrastructure  API')
      .setDescription('My Infrastructure API')
      .addBearerAuth()
      .build(),
  );

  SwaggerModule.setup('docs', app, document, customOptions);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  await app.listen(port, () => {
    console.log('[WEB]', process.env.BASE_URL + '/docs');
  });
}

bootstrap();
