import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { I18nContext } from 'nestjs-i18n';
import { LoggerService } from '../logger';

/**
 * This exception-filter must be handled in the end if other exception occurs.
 * It will handle unexpected errors in App, log it and return a response to client.
 */
@Catch(Error)
export class UnhandledErrorExceptionFilter implements ExceptionFilter {
  constructor(private logger: LoggerService) {}

  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const errMsg = exception.message;
    const errorMeta = this.generateErrorMeta(exception, request);

    this.logger.error(errMsg, errorMeta);

    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      status: false,
      message: I18nContext.current(host)!.translate('errors.basics.internal'),
    });
  }

  private generateErrorMeta(exception: Error, request: Request) {
    const errorMeta = {
      request: {
        ip: request.ip,
        url: request.url,
        method: request.method,
        params: request.params,
        query: request.query,
        headers: JSON.parse(JSON.stringify(request.headers)), // eslint-disable-line @typescript-eslint/no-unsafe-assignment
        body: request.body, // eslint-disable-line @typescript-eslint/no-unsafe-assignment
        date: new Date().toLocaleDateString(),
      },
      trace: exception?.stack?.split('\n').map(item => item.trim()),
      exception: exception,
    };

    delete errorMeta.request.headers?.authorization; // eslint-disable-line @typescript-eslint/no-unsafe-member-access

    return errorMeta;
  }
}
