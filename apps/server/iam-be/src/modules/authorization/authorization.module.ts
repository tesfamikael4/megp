import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account, AccountVerification, SecurityQuestion } from '@entities';
import { AuthHelper } from './helper/auth.helper';
import { JwtStrategy } from './strategy/jwt.strategy';
import { JwtRefreshTokenStrategy } from './strategy/jwt-refresh-token.strategy';
import JwtRefreshGuard from './guards/jwt-refresh.guard';
import { JwtGuard } from './guards/jwt.guard';
import { APP_GUARD } from '@nestjs/core';
import { AuthController } from './controllers/auth.controller';
import { AccountsService } from './services/account.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt', property: 'user' }),
    JwtModule.register({}),
    TypeOrmModule.forFeature([Account, AccountVerification, SecurityQuestion]),
  ],
  controllers: [AuthController],
  providers: [
    AccountsService,
    AuthHelper,
    JwtStrategy,
    JwtRefreshTokenStrategy,
    JwtGuard,
    JwtRefreshGuard,
  ],
})
export class AuthorizationModule {}
