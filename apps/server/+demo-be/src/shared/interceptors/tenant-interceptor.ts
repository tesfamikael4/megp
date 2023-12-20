import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { tap } from 'rxjs/operators';
import { Request } from 'express';

export const TENANT_ID_KEY = 'TENANT-ID';
export const TENANT_ID = 'x-tenant-id';

@Injectable()
export class TenantInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): any {
    const req = context.switchToHttp().getRequest<Request>();
    console.log('Before...');

    const organizationId = req.headers['organization_id'];
    const tenantId = req.headers['tenant_id'];

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

    const now = Date.now();
    return next
      .handle()
      .pipe(tap(() => console.log(`After... ${Date.now() - now}ms`)));
  }
}
