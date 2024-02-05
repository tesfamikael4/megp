import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthorizationModule } from './authorization';
import { DocxModule } from './docx';
import { MinIOModule } from './min-io';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthorizationModule,
    DocxModule,
    MinIOModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
