import {
  Catch,
  RpcExceptionFilter,
  ArgumentsHost,
  Logger,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { RpcException } from '@nestjs/microservices';

@Catch(RpcException)
export class RabbitMQExceptionFilter
  implements RpcExceptionFilter<RpcException>
{
  private readonly logger = new Logger(RabbitMQExceptionFilter.name);

  catch(exception: RpcException, host: ArgumentsHost): Observable<any> {
    const error = exception.getError();
    const responseData = {
      statusCode: 400,
      error,
      queue: host.getArgs()[1]?.args[2],
      timestamp: new Date().toISOString(),
    };
    this.logger.error(responseData);

    return throwError(() => error);
  }
}
