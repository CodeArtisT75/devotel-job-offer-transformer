import { NotFoundException } from '@nestjs/common';

export class ModelNotFoundException extends NotFoundException {
  public message: string;

  constructor(message: string = 'Entity not found') {
    super();

    this.message = message;
  }
}
