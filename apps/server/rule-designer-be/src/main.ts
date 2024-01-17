import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import {
  SwaggerCustomOptions,
  SwaggerModule,
  DocumentBuilder,
} from '@nestjs/swagger';
import { GlobalExceptionFilter } from './shared/exceptions/global-exception.filter';

async function bootstrap() {
  const app: NestExpressApplication = await NestFactory.create(AppModule, {
    cors: true,
  });

  app.enableCors();

  const port = Number(process.env.PORT ?? 3000);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  app.useGlobalFilters(new GlobalExceptionFilter());

  // const reflector = app.get(Reflector);
  // app.useGlobalGuards(new Aut  app.useGlobalGuards(new AuthGuard(reflector));

  app.setGlobalPrefix('api');

  const customOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      persistAuthorization: false,
      docExpansion: 'none',
    },
    customSiteTitle: 'Rule Designer API Documentation',
  };
  const document = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle('Rule Designer API')
      .setDescription(`My Rule Designer API. Version: ${process.env.VERSION}`)
      .addBearerAuth()
      .build(),
    {
      deepScanRoutes: true,
    },
  );

  SwaggerModule.setup('docs', app, document, customOptions);

  await app.listen(port, () => {
    console.log('[WEB]', process.env.BASE_URL + '/docs');
  });
}
bootstrap();
