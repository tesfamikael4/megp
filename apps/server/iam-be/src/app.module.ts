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
import { GroupModule } from './groups/group.module';
import { ApplicationModule } from './application/application.module';
import { MandateModule } from './mandate/mandate.module';
import { AuthorizationModule } from './modules/authorization/authorization.module';
import { EmailConfig } from './shared/email/email.config';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailService } from './shared/email/email.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    MailerModule.forRootAsync({ useClass: EmailConfig }),
    AuthorizationModule,
    OrganizationModule,
    GroupModule,
    ApplicationModule,
    MandateModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
