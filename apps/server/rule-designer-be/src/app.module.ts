import { Module } from '@nestjs/common';
import { RuleModule } from './modules/rule/rule.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './shared/typeorm/typeorm.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { AuthorizationModule } from './shared/authorization';
import { EmailConfig } from './shared/email/email.config';
import { ConfigModule } from '@nestjs/config';
import { DataSeeder } from './modules/seeders/data.seeder';

@Module({
  imports: [
    RuleModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    AuthorizationModule,
    MailerModule.forRootAsync({ useClass: EmailConfig }),
  ],
  controllers: [],
  providers: [DataSeeder],
})
export class AppModule {}
