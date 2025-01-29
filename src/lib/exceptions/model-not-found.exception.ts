import { NotFoundException } from '@nestjs/common';

export class ModelNotFoundException extends NotFoundException {
  public message: string;

  constructor(message: string = '') {
    super();

    this.message = message;
  }
}
