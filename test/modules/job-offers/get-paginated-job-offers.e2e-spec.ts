import { INestApplication } from '@nestjs/common';
import { getModelToken } from '@nestjs/sequelize';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { JobOffer } from '../../../src/modules/job-offers/entities/JobOffer.entity';
import { refreshDatabase } from '../../utils/database';

describe('Get paginated Job Offers (e2e)', () => {
  let app: INestApplication<App>;
  let JobOfferModel: typeof JobOffer;

  beforeEach(() => {
    app = global.app; // eslint-disable-line @typescript-eslint/no-unsafe-assignment
    JobOfferModel = app.get(getModelToken(JobOffer));
  });

  it('should get paginated job offers', async () => {
    // Arrange
    await refreshDatabase(app);
    const jobOffers = await JobOfferModel.bulkCreate(JobOffer.factory(20));
    const page = 1;
    const perPage = 5;

    // Act
    const response = await request(app.getHttpServer()).get('/api/job-offers').send().query({ page, perPage });

    // Assert
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('status', true);
    expect(response.body).toHaveProperty('data');
    expect(response.body).toHaveProperty('data.items');
    expect(response.body).toHaveProperty('data.pagination');
    expect(response.body.data.items.length).toBe(5); // eslint-disable-line @typescript-eslint/no-unsafe-member-access
    expect(response.body).toHaveProperty('data.pagination.total', jobOffers.length);
  });

  it('should return 422 error if query params page is invalid', async () => {
    return request(app.getHttpServer())
      .get('/api/job-offers')
      .query({ page: -1 })
      .send()
      .expect(422)
      .expect(({ body }) => {
        expect(body).toHaveProperty('errors');
        expect(body).toHaveProperty('errors[0].property', 'page');
      });
  });

  it('should return 422 error if query params page is invalid', async () => {
    return request(app.getHttpServer())
      .get('/api/job-offers')
      .query({ perPage: 52 })
      .send()
      .expect(422)
      .expect(({ body }) => {
        expect(body).toHaveProperty('errors');
        expect(body).toHaveProperty('errors[0].property', 'perPage');
      });
  });
});
