import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { AuthGuard } from './supertokens';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import supertokens from 'supertokens-node';
import { SupertokensExceptionFilter } from './supertokens/auth/filters/auth.filter';
import { GlobalExceptionFilter } from './shared/exceptions/global-exception.filter';

async function bootstrap() {
  const app: NestExpressApplication = await NestFactory.create(AppModule);

  const config: ConfigService = app.get(ConfigService);

  app.enableCors({
    origin: config.get<string>('WEBSITE_DOMAIN'),
    allowedHeaders: ['content-type', ...supertokens.getAllCORSHeaders()],
    credentials: true,
  });

  const port: number = config.get<number>('PORT') || 3000;

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  app.useGlobalFilters(new SupertokensExceptionFilter());
  app.useGlobalFilters(new GlobalExceptionFilter());

  const reflector = app.get(Reflector);
  // app.useGlobalGuards(new Aut  app.useGlobalGuards(new AuthGuard(reflector));
  const customOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      persistAuthorization: false,
      docExpansion: 'none',
    },
    customSiteTitle: 'Registration System API Documentation',
  };
  const document = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle('IAM API')
      .setDescription('My IAM API')
      .addBearerAuth()
      .build(),
    {
      deepScanRoutes: true,
    },
  );

  SwaggerModule.setup('docs', app, document, customOptions);

  await app.listen(port, () => {
    console.log('[WEB]', config.get<string>('BASE_URL') + '/docs');
  });
}

bootstrap();
