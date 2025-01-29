import { HttpException, HttpStatus } from '@nestjs/common';
import { ValidationError } from 'class-validator';

export class ValidationErrorException extends HttpException {
  constructor(error: { message: string; errors: ValidationError[] }) {
    super(error, HttpStatus.UNPROCESSABLE_ENTITY);
  }
}
