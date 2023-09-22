import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AuthGuard } from './authentication';
import supertokens from 'supertokens-node';
import { SupertokensExceptionFilter } from './authentication/auth/filters/auth.filter';

async function bootstrap() {
  const app: NestExpressApplication = await NestFactory.create(AppModule, {
    cors: true,
  });

  const config: ConfigService = app.get(ConfigService);

  app.enableCors({
    origin: [config.get<string>('WEBSITE_DOMAIN')],
    allowedHeaders: ['content-type', ...supertokens.getAllCORSHeaders()],
    credentials: true,
  });

  const port: number = config.get<number>('PORT') || 3000;

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  app.useGlobalFilters(new SupertokensExceptionFilter());

  const reflector = app.get(Reflector);
  app.useGlobalGuards(new AuthGuard(reflector));

  app.setGlobalPrefix('api');

  const document = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle('IAM API')
      .setDescription('My IAM API')
      .addBearerAuth()
      .build(),
  );

  SwaggerModule.setup('docs', app, document);

  await app.listen(port, () => {
    console.log('[WEB]', config.get<string>('BASE_URL') + '/docs');
  });
}

bootstrap();
