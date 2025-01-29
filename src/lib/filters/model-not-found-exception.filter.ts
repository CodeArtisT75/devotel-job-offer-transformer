import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { I18nContext } from 'nestjs-i18n';
import { ModelNotFoundException } from '../exceptions/model-not-found.exception';

@Catch(ModelNotFoundException)
export class ModelNotFoundExceptionFilter implements ExceptionFilter {
  catch(exception: ModelNotFoundException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(HttpStatus.NOT_FOUND).json({
      status: false,
      message: exception.message ?? I18nContext.current(host)!.translate('crud.not_found'),
    });
  }
}
