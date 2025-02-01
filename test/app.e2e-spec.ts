import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(() => {
    app = global.app; // eslint-disable-line @typescript-eslint/no-unsafe-assignment
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer()).get('/').expect(200).expect({
      status: true,
      data: 'Hello World!',
      message: 'Hello World!',
    });
  });
});
