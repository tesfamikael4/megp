import {
    CanActivate,
    Injectable,
    ExecutionContext,
    UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { ALLOW_ANONYMOUS_META_KEY } from '../decorator/allow-anonymous.decorator';
import { Reflector } from '@nestjs/core';
import { JwtConstant } from '../utils/jwt-constant';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) { }

    async canActivate(context: ExecutionContext) {
        const isAnonymousAllowed = this.reflector?.getAllAndOverride<boolean>(
            ALLOW_ANONYMOUS_META_KEY,
            [context.getHandler(), context.getClass()],
        );
        if (isAnonymousAllowed) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new UnauthorizedException();
        }
        try {
            const secretOrPublicKey = JwtConstant.JWT_SECRET;

            let payload: any;

            jwt.verify(token, secretOrPublicKey, function (err: any, decoded: any) {
                if (err) {
                    throw new UnauthorizedException(err);
                }
                payload = decoded;
            });

            request['user'] = payload;
        } catch (error) {
            throw new UnauthorizedException(error);
        }

        return true;
    }

    private extractTokenFromHeader(request: Request) {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}
