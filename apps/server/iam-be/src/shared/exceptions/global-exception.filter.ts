import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

interface IError {
  message: string;
  code_error: string;
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request: any = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const message =
      exception instanceof HttpException
        ? (exception.getResponse() as IError)
        : {
            message: (exception as Error).message,
            code_error: (exception as Error).name,
          };

    const responseData = {
      statusCode: status,
      ...message,
      path: request.url,
      timestamp: new Date().toISOString(),
    };

    response.status(status).json(responseData);
  }
}
