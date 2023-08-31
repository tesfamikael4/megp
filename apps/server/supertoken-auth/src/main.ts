import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import supertokens from 'supertokens-node';
import { SupertokensExceptionFilter } from './auth/auth.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['<YOUR_WEBSITE_DOMAIN>'],
    allowedHeaders: ['content-type', ...supertokens.getAllCORSHeaders()],
    credentials: true,
  });


  app.useGlobalFilters(new SupertokensExceptionFilter());
  
  const port = 3568;

  await app.listen(port, () => {
    console.log('[WEB]', `http://localhost:${port}`);
  });
}
bootstrap();
