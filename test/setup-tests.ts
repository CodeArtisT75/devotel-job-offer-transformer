import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { ValidationPipe } from '../src/lib/pipes/validation.pipe';

jest.setTimeout(30000);

global.beforeEach(async function () {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleFixture.createNestApplication();
  app.useGlobalPipes(new ValidationPipe());

  await app.init();

  global.app = app;
});

global.afterEach(async () => {
  // eslint-disable-next-line
  await global.app.close();
});
