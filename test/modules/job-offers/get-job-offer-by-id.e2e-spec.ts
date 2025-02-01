import { INestApplication } from '@nestjs/common';
import { getModelToken } from '@nestjs/sequelize';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { JobOffer } from '../../../src/modules/job-offers/entities/JobOffer.entity';
import { refreshDatabase } from '../../utils/database';

describe('Get Job offer by ID (e2e)', () => {
  let app: INestApplication<App>;
  let JobOfferModel: typeof JobOffer;

  beforeEach(() => {
    app = global.app; // eslint-disable-line @typescript-eslint/no-unsafe-assignment
    JobOfferModel = app.get(getModelToken(JobOffer));
  });

  it('should return job offer', async () => {
    // Arrange
    await refreshDatabase(app);
    const jobOffer = await JobOfferModel.create(JobOffer.factory(1)[0]);

    // Act
    const response = await request(app.getHttpServer()).get(`/api/job-offers/${jobOffer.id}`).send();

    // Assert
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('status', true);
    expect(response.body).toHaveProperty('data');
    expect(response.body).toHaveProperty('data.id', jobOffer.id);
    expect(response.body).toHaveProperty('data.title', jobOffer.title);
  });

  it('should return 404 if job offer not found', async () => {
    // Arrange
    await refreshDatabase(app);
    const id = 20;

    // Act
    const response = await request(app.getHttpServer()).get(`/api/job-offers/${id}`).send();

    // Assert
    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty('status', false);
  });
});
