import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { Response } from 'express';
import { ValidationErrorException } from '../exceptions/validation-error.exception';

@Catch(ValidationErrorException)
export class ValidationErrorExceptionFilter implements ExceptionFilter {
  catch(exception: ValidationErrorException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const { errors } = exception.getResponse() as {
      errors: ValidationError[];
    };

    response.status(status).json({
      status: false,
      errors: this.transformValidationErrors(errors),
      message: exception.message,
    });
  }

  private transformValidationErrors(errors: ValidationError[]): unknown[] {
    return errors.map(error => ({
      property: error.property,
      value: error.value as unknown,
      children: this.transformValidationErrors(error.children ?? []),
      errors: error.constraints ? Object.values(error.constraints) : undefined,
    }));
  }
}
