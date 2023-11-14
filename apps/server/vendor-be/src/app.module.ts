import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './shared/typeorm/typeorm.service';
import { VendorRegistrationModule } from './modules/vendor-registration/vendor-registration.module';
import { AuthorizationModule } from './shared/authorization';
import { CategoriesModule } from './modules/categories/category.module';
import { BpmModule } from './modules/bpm/bpm.module';
import { ServiceModule } from './modules/services/service.module';
import { ServicePricingModule } from './modules/pricing/pricing.module';

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
    ServiceModule,
    ServicePricingModule,
    BpmModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
