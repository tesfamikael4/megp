import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import { AuthHelper } from '../helper/auth.helper';

Injectable();
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(ConfigService)
    config: ConfigService,
    @Inject(AuthHelper)
    private readonly helper: AuthHelper,
  ) {
    const strategyOptions: StrategyOptions = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get('JWT_ACCESS_TOKEN_SECRET'),
    };

    super(strategyOptions);
  }

  async validate(payload: any) {
    return payload;
    // return this.helper.validateUser(payload);
  }
}
