import { Module } from '@nestjs/common';
import { AuthorizationModule } from '@auth';
import { AuthController } from './controllers/auth.controller';
import { AccountsService } from './services/account.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account, AccountVerification, SecurityQuestion } from '@entities';
import { EmailService } from 'src/shared/email/email.service';
import { AccountCredential } from 'src/entities/account-credential.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Account,
      AccountVerification,
      SecurityQuestion,
      AccountCredential,
    ]),
    AuthorizationModule,
  ],
  controllers: [AuthController],
  providers: [AccountsService, EmailService],
  exports: [AccountsService],
})
export class AccountModule {}
