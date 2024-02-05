import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { IGNORE_TENANT_INTERCEPTOR_KEY } from '../decorators';

@Injectable()
export class TenantInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest<Request>();

    const isTenantInterceptorIgnored =
      this.reflector?.getAllAndOverride<boolean>(
        IGNORE_TENANT_INTERCEPTOR_KEY,
        [context.getHandler(), context.getClass()],
      );

    if (isTenantInterceptorIgnored) {
      return next.handle();
    }

    const user: any = req.user;

    if (!user) {
      return next.handle();
    }

    const organizationId = user.organization?.id;
    const tenantId = user.tenantId + '';

    let query = req.query.q as string;

    if (!tenantId && !organizationId) {
      return next.handle();
    }

    if (query == undefined) {
      query = '';
    }

    const whereExist: boolean = query.includes('w=');

    const queryArr = query.split('&');
    let whereQuery;
    let whereIndex;
    queryArr.map((q, i) => {
      if (q.startsWith('w=')) {
        whereQuery = q;
        whereIndex = i;
      }
    });
    if (whereIndex == undefined) whereIndex = queryArr.length;
    if (whereQuery == undefined) whereQuery = '';

    if (!whereExist && whereQuery.length == 0) {
      whereQuery = 'w=';
    } else if (!whereExist && whereQuery.length > 0) {
      whereQuery = '&w=';
    }

    if (tenantId) {
      if (whereQuery[whereQuery.length - 1] == '=') {
        whereQuery += `tenantId:=:${tenantId}`;
      } else {
        whereQuery += `|tenantId:=:${tenantId}`;
      }
    }
    if (organizationId) {
      if (whereQuery[whereQuery.length - 1] == '=') {
        whereQuery += `organizationId:=:${organizationId}`;
      } else {
        whereQuery += `|organizationId:=:${organizationId}`;
      }
    }

    queryArr[whereIndex] = whereQuery;

    const finalWhereQuery = queryArr.join('&');
    req.query.q = finalWhereQuery;

    return next.handle();
  }
}
