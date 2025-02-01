import { INestApplication } from '@nestjs/common';
import { getModelToken } from '@nestjs/sequelize';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { JobOffer } from '../../../src/modules/job-offers/entities/JobOffer.entity';
import { refreshDatabase } from '../../utils/database';

describe('Update Job Offer (e2e)', () => {
  let app: INestApplication<App>;
  let JobOfferModel: typeof JobOffer;

  beforeEach(() => {
    app = global.app; // eslint-disable-line @typescript-eslint/no-unsafe-assignment
    JobOfferModel = app.get(getModelToken(JobOffer));
  });

  it('should update a job offer', async () => {
    // Arrange
    await refreshDatabase(app);
    const jobOffer = await JobOfferModel.create(
      JobOffer.factory(1, {
        title: 'Job offer Title',
      })[0],
    );
    const jobOfferData: Partial<JobOffer> = {
      title: 'Job Offer UPDATED',
    };

    // Act
    const response = await request(app.getHttpServer()).patch(`/api/job-offers/${jobOffer.id}`).send(jobOfferData);

    // Assert

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('status', true);
    expect(response.body).toHaveProperty('data');
    expect(response.body).toHaveProperty('data.id', +jobOffer.id);
    expect(response.body).toHaveProperty('data.title', jobOfferData.title);
  });
});
