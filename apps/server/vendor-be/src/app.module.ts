import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './shared/typeorm/typeorm.service';
import { AuthenticationModule } from './authentication';
import { VendorRegistrationModule } from './vendor-registration/vendor-registration.module';
import { CategoriesModule } from './categories/category.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    AuthenticationModule,
    VendorRegistrationModule,
    CategoriesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
