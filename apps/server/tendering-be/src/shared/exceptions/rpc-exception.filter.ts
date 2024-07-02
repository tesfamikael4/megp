import {
  Catch,
  RpcExceptionFilter,
  ArgumentsHost,
  Logger,
  Inject,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { ClientProxy, RpcException } from '@nestjs/microservices';

@Catch(RpcException)
export class RabbitMQExceptionFilter
  implements RpcExceptionFilter<RpcException>
{
  private readonly logger = new Logger(RabbitMQExceptionFilter.name);

  constructor(
    @Inject('ERROR_LOG_RMQ_SERVICE')
    private readonly errorRMQClient: ClientProxy,
  ) {}

  catch(exception: RpcException, host: ArgumentsHost): Observable<any> {
    const error = exception.getError();
    const data = host.getArgs()[0];
    const pattern = host.getArgs()[1]?.args[2];

    const responseData = {
      statusCode: 400,
      error,
      pattern,
      timestamp: new Date().toISOString(),
    };
    this.logger.error(responseData);

    this.errorRMQClient.emit('rabbit-mq-error', {
      data,
      error: responseData,
      pattern: pattern || 'default',
      application: process.env.DATABASE_NAME,
    });

    return throwError(() => error);
  }
}
