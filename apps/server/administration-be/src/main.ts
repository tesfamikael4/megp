import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { GlobalExceptionFilter } from './shared/exceptions/global-exception.filter';

async function bootstrap() {
  const app: NestExpressApplication = await NestFactory.create(AppModule, {
    cors: true,
    rawBody: true,
  });

  app.enableCors();
  app.useBodyParser('json', { limit: '500mb' });

  const port = Number(process.env.PORT ?? 3000);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  app.useGlobalFilters(new GlobalExceptionFilter());

  app.setGlobalPrefix('api');

  const document = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle('Administration API')
      .setDescription(`My Administration API. Version: ${process.env.VERSION}`)
      .addBearerAuth()
      .build(),
  );

  SwaggerModule.setup('docs', app, document);

  await app.listen(port, () => {
    console.log('[WEB]', process.env.BASE_URL + '/docs');
  });
}

bootstrap();
