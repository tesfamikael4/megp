import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './shared/typeorm/typeorm.service';
import { OrganizationModule } from './organization';
import { AuthenticationModule } from './supertokens';
import { GroupModule } from './groups/group.module';
import { ApplicationModule } from './application/application.module';
import { MandateModule } from './mandate/mandate.module';
import { UserModule } from './users/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    AuthenticationModule,
    OrganizationModule,
    GroupModule,
    ApplicationModule,
    MandateModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
