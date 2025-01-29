import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';

interface IApiResponseSchemaOptions {
  httpStatus?: number;
  model?: Function; // eslint-disable-line @typescript-eslint/no-unsafe-function-type
  message?: string;
  isArray?: boolean;
  isPagination?: boolean;
  noApiSchema?: boolean;
}

export const ApiResponseSchema = (options: IApiResponseSchemaOptions = {}) => {
  if (options.noApiSchema) {
    return applyDecorators();
  }

  const status = options.httpStatus || HttpStatus.OK;
  const message = options.message ?? 'message';
  const isArray = options.isArray ?? false;
  const isPagination = options.isPagination ?? false;
  const model = options.model;
  let data = {};

  if (!model) {
    return applyDecorators(
      ApiResponse({
        status,
        schema: {
          type: 'object',
          properties: {
            status: {
              type: 'boolean',
            },
            message: {
              type: 'string',
              default: message,
            },
          },
        },
      }),
    );
  }

  if (isPagination) {
    // create pagination response
    data = {
      type: 'object',
      properties: {
        items: {
          type: 'array',
          items: {
            $ref: getSchemaPath(model),
          },
        },
        paginationMeta: {
          type: 'object',
          properties: {
            currentPage: {
              type: 'number',
            },
            lastPage: {
              type: 'number',
            },
            perPage: {
              type: 'number',
            },
            total: {
              type: 'number',
            },
          },
        },
      },
    };
  } else if (isArray) {
    // create array response
    data = {
      type: 'array',
      items: {
        $ref: getSchemaPath(model),
      },
    };
  } else {
    // create model response
    data = {
      $ref: getSchemaPath(model),
    };
  }

  return applyDecorators(
    ApiExtraModels(model),
    ApiResponse({
      status,
      schema: {
        type: 'object',
        properties: {
          status: {
            type: 'boolean',
          },
          data,
          message: {
            type: 'string',
            default: message,
          },
        },
      },
    }),
  );
};
