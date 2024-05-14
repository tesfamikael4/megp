import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { GlobalExceptionFilter } from './shared/exceptions/global-exception.filter';

async function bootstrap() {
  const app: NestExpressApplication = await NestFactory.create(AppModule, {
    cors: true,
  });

  app.enableCors();

  const port = Number(process.env.PORT || 3000);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  app.useGlobalFilters(new GlobalExceptionFilter());

  app.setGlobalPrefix('api');

  const customOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      persistAuthorization: false,
      docExpansion: 'none',
    },
    customSiteTitle: 'Tendering System API Documentation',
  };

  const document = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle('Tendering API')
      .setDescription('Tendering API')
      .addBearerAuth()
      .build(),
    {
      deepScanRoutes: true,
    },
  );

  // Sorting the paths and definitions alphabetically
  document.paths = Object.keys(document.paths)
    .sort()
    .reduce((sortedPaths, key) => {
      sortedPaths[key] = document.paths[key];
      return sortedPaths;
    }, {});

  if (document.components && document.components.schemas) {
    document.components.schemas = Object.keys(document.components.schemas)
      .sort()
      .reduce((sortedSchemas, key) => {
        sortedSchemas[key] = document.components.schemas[key];
        return sortedSchemas;
      }, {});
  }

  SwaggerModule.setup('docs', app, document, customOptions);

  await app.listen(port, async () => {
    console.log('[WEB]', process.env.BASE_URL + '/docs');
  });
}

bootstrap();
