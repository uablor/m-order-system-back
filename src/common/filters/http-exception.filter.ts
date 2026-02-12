import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { LoggerService } from '../logger/logger.service';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly fallbackLogger = new Logger(AllExceptionsFilter.name);

  constructor(private readonly loggerService: LoggerService) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : exception instanceof Error
          ? exception.message
          : 'Internal server error';

    const stack = exception instanceof Error ? exception.stack : undefined;
    const correlationId = request.correlationId;

    this.loggerService.error(
      typeof message === 'object' ? JSON.stringify(message) : String(message),
      stack,
      'ExceptionFilter',
      {
        correlationId,
        method: request.method,
        path: request.url,
        statusCode: status,
      },
    );

    const body =
      typeof message === 'object' && message !== null && !(message instanceof Error)
        ? message
        : { message: String(message) };

    response.status(status).json({
      statusCode: status,
      ...body,
      correlationId,
    });
  }
}
