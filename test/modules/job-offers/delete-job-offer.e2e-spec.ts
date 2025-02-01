import { INestApplication } from '@nestjs/common';
import { getModelToken } from '@nestjs/sequelize';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { JobOffer } from '../../../src/modules/job-offers/entities/JobOffer.entity';
import { refreshDatabase } from '../../utils/database';

describe('Delete Job Offer (e2e)', () => {
  let app: INestApplication<App>;
  let JobOfferModel: typeof JobOffer;

  beforeEach(() => {
    app = global.app; // eslint-disable-line @typescript-eslint/no-unsafe-assignment
    JobOfferModel = app.get(getModelToken(JobOffer));
  });

  it('should delete a job offer', async () => {
    // Arrange
    await refreshDatabase(app);
    const jobOffer = await JobOfferModel.create(JobOffer.factory(1)[0]);

    // Act
    const response = await request(app.getHttpServer()).delete(`/api/job-offers/${jobOffer.id}`).send();

    // Assert
    const fetchedJobOffer = await JobOfferModel.findByPk(jobOffer.id);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('status', true);
    expect(fetchedJobOffer).toBeNull();
  });
});
