import { Module } from '@nestjs/common';
import { AuthorizationModule } from '@auth';
import { AuthController } from './controllers/auth.controller';
import { AccountsService } from './services/account.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account, AccountVerification, SecurityQuestion } from '@entities';
import { EmailService } from 'src/shared/email/email.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Account, AccountVerification, SecurityQuestion]),
    AuthorizationModule,
  ],
  controllers: [AuthController],
  providers: [AccountsService, EmailService],
})
export class AccountModule {}
