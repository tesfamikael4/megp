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
  constructor() {
    const strategyOptions: StrategyOptions = {
      jwtFromRequest: (req) => req.body.refresh_token,
      ignoreExpiration: false,
      secretOrKey:
        process.env.JWT_REFRESH_TOKEN_SECRET ?? 'OfvWfxHrOjwhXuaTKQee',
    };

    super(strategyOptions);
  }

  async validate(payload: any) {
    return payload;
    // return this.helper.validateUser(payload);
  }
}
