import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { registerSwagger } from './lib/utils/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());

  registerSwagger(app);

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap(); // eslint-disable-line @typescript-eslint/no-floating-promises
