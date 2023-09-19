import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './shared/typeorm/typeorm.service';
import { AuthenticationModule } from './authentication';
import { CategoriesModule } from './categories/category.module';
import { VendorRegistrationModule } from './vendor-registration/vendor-registration.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    AuthenticationModule,
    CategoriesModule,
    VendorRegistrationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
