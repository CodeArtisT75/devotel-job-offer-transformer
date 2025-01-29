import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { TransformResponse } from './lib/decorators/transform-response.decorator';

@ApiTags('Home')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @TransformResponse({ message: 'hello.message' })
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
