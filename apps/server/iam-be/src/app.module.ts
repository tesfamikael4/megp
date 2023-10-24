import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailConfig } from './shared/email/email.config';
import { MailerModule } from '@nestjs-modules/mailer';
import { TypeOrmConfigService } from './shared/typeorm/typeorm.service';
import { OrganizationModule } from './modules/registration/organization';
import { AuthorizationModule } from './modules/authorization/authorization.module';
import { ApplicationModule } from './modules/registration/application/application.module';
import { GroupModule } from './modules/registration/groups/group.module';
import { MandateModule } from './modules/registration/mandate/mandate.module';
import { RoleModule } from './modules/registration/role/role.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    MailerModule.forRootAsync({ useClass: EmailConfig }),
    AuthorizationModule,
    OrganizationModule,
    GroupModule,
    RoleModule,
    ApplicationModule,
    MandateModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
