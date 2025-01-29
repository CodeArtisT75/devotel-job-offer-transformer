import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { ValidationError, validate } from 'class-validator';
import { ValidationErrorException } from '../exceptions/validation-error.exception';
import { BaseValidationDto } from '../validators/base-validation-dto';

/**
 * Validate user inputs with class-validator and class-transformer
 */
@Injectable()
export class ValidationPipe implements PipeTransform {
  async transform(value: any, { metatype }: ArgumentMetadata): Promise<any> {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    const _object = plainToInstance(metatype, value) as object;
    if (!_object) {
      return value;
    }

    const errors = await validate(_object, { whitelist: true });

    if (errors.length > 0) {
      throw new ValidationErrorException({
        errors: errors,
        message: this.firstErrorMessage(errors[0]),
      });
    }

    return instanceToPlain(_object);
  }

  // check if class extends BaseValidationDto
  private toValidate(metaType: object): boolean {
    let parent = Object.getPrototypeOf(metaType) as object;

    while ((Object.getPrototypeOf(parent) as { name: string }).name) {
      parent = Object.getPrototypeOf(parent) as object;
    }

    return parent === BaseValidationDto || (parent as { name: string }).name === 'PartialTypeClass';
  }

  private firstErrorMessage(error: ValidationError): string {
    if (error.children && error.children?.length > 0) {
      return this.firstErrorMessage(error.children[0]);
    }

    return Object.values(error.constraints!)[0];
  }
}
