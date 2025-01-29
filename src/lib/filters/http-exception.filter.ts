import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { I18nContext } from 'nestjs-i18n';
import { LoggerService } from '../logger';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private logger: LoggerService) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    // check if internal error happened and log it with Logger
    if (status === (HttpStatus.INTERNAL_SERVER_ERROR as number)) {
      this.logger.error(exception.message, this.generateErrorMeta(exception, request));
    }

    response.status(status).json({
      status: false,
      message: I18nContext.current(host)!.translate(this.getErrorMessage(status)),
    });
  }

  private generateErrorMeta(exception: HttpException, request: Request) {
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
      trace: exception.stack?.split('\n').map(item => item.trim()),
      exception: exception,
    };

    delete errorMeta.request.headers?.authorization; // eslint-disable-line @typescript-eslint/no-unsafe-member-access

    return errorMeta;
  }

  private getErrorMessage(status: HttpStatus): string {
    switch (status) {
      case HttpStatus.BAD_REQUEST:
        return 'errors.basics.bad_request';
      case HttpStatus.UNAUTHORIZED:
        return 'errors.basics.unauthorized';
      case HttpStatus.FORBIDDEN:
        return 'errors.basics.forbidden';
      case HttpStatus.NOT_FOUND:
        return 'errors.basics.not_found';
      default:
        return 'errors.basics.internal';
    }
  }
}
