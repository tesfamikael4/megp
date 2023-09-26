import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './shared/typeorm/typeorm.service';
import { CategoriesModule } from './categories/category.module';
import { VendorRegistrationModule } from './vendor-registration/vendor-registration.module';
import { BpmModule } from './bpm/bpm.module';
import { AuthorizationModule } from './authorization';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    AuthorizationModule,
    CategoriesModule,
    VendorRegistrationModule,
    BpmModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
