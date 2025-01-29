import { HttpCode, HttpStatus, SetMetadata, UseInterceptors, applyDecorators } from '@nestjs/common';
import { PaginationInterceptor } from '../interceptors/pagination.interceptor';
import { TransformResponseInterceptor } from '../interceptors/transform-response.interceptor';
import { ApiResponseSchema } from './api-response-schema.decorator';

interface ITransformResponseOptions {
  status?: boolean;
  httpStatus?: HttpStatus;
  message?: string;
  isPagination?: boolean;
  isArray?: boolean;
  model?: Function; // eslint-disable-line @typescript-eslint/no-unsafe-function-type
  noApiSchema?: boolean;
}

export const TransformResponse = (options: ITransformResponseOptions = {}) => {
  const status = options?.status ?? true;
  const httpStatus = options?.httpStatus ?? HttpStatus.OK;
  const message = options?.message ?? '';

  if (options.isPagination) {
    return applyDecorators(
      SetMetadata('responseStatus', status),
      SetMetadata('responseMessage', message),
      UseInterceptors(TransformResponseInterceptor),
      UseInterceptors(PaginationInterceptor),
      HttpCode(httpStatus),
      ApiResponseSchema(options),
    );
  }

  return applyDecorators(
    SetMetadata('responseStatus', status),
    SetMetadata('responseMessage', message),
    UseInterceptors(TransformResponseInterceptor),
    HttpCode(httpStatus),
    ApiResponseSchema(options),
  );
};
