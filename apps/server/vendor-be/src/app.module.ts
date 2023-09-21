import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './shared/typeorm/typeorm.service';
import { AuthenticationModule } from './authentication';
import { CategoriesModule } from './categories/category.module';
import { VendorRegistrationModule } from './vendor-registration/vendor-registration.module';
import { BpmModule } from './bpm/bpm.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    AuthenticationModule,
    CategoriesModule,
    VendorRegistrationModule,
    BpmModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
