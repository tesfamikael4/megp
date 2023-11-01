import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import { AuthHelper } from '../helper/auth.helper';
import { Request } from 'express';

Injectable();
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  @Inject(AuthHelper)
  private readonly helper: AuthHelper;

  constructor(@Inject(ConfigService) config: ConfigService) {
    const strategyOptions: StrategyOptions = {
      jwtFromRequest: (req) => req.body.refresh_token,
      ignoreExpiration: false,
      secretOrKey: config.get('JWT_REFRESH_TOKEN_SECRET'),
    };

    super(strategyOptions);
  }

  async validate(payload: any) {
    return payload;
    // return this.helper.validateUser(payload);
  }
}
