import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { I18nContext } from 'nestjs-i18n';
import { map } from 'rxjs';

@Injectable()
export class TransformResponseInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler) {
    const status = this.reflector.get<string>('responseStatus', context.getHandler());
    const message = this.reflector.get<string>('responseMessage', context.getHandler());
    const i18n = I18nContext.current(context) as I18nContext;

    return next.handle().pipe(
      map((data: unknown) => ({
        status,
        data,
        message: i18n.translate(message),
      })),
    );
  }
}
