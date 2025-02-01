import { INestApplication } from '@nestjs/common';
import { getModelToken } from '@nestjs/sequelize';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { JobOffer } from '../../../src/modules/job-offers/entities/JobOffer.entity';
import { JobTypeEnum } from '../../../src/modules/job-offers/enums/job-type.enum';
import { refreshDatabase } from '../../utils/database';

describe('Create Job Offer (e2e)', () => {
  let app: INestApplication<App>;
  let JobOfferModel: typeof JobOffer;

  beforeEach(() => {
    app = global.app; // eslint-disable-line @typescript-eslint/no-unsafe-assignment
    JobOfferModel = app.get(getModelToken(JobOffer));
  });

  it('should create job offer', async () => {
    // Arrange
    await refreshDatabase(app);
    const jobOfferData: Partial<JobOffer> = {
      jobId: 'job-id-1',
      title: 'New Job Offer',
      jobType: JobTypeEnum.FULL_TIME,
    };

    // Act
    const response = await request(app.getHttpServer()).post(`/api/job-offers`).send(jobOfferData);

    // Assert
    const jobOffer = await JobOfferModel.findOneOrFail({});
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('status', true);
    expect(response.body).toHaveProperty('data');
    expect(response.body).toHaveProperty('data.id', jobOffer.id);
    expect(response.body).toHaveProperty('data.title', jobOffer.title);
  });

  it('should return error if jobId is not present', async () => {
    // Arrange
    await refreshDatabase(app);
    const jobOfferData: Partial<JobOffer> = {
      title: 'New Job Offer',
      jobType: JobTypeEnum.FULL_TIME,
    };

    // Act
    const response = await request(app.getHttpServer()).post(`/api/job-offers`).send(jobOfferData);

    // Assert
    expect(response.statusCode).toBe(422);
    expect(response.body).toHaveProperty('errors');
    expect(response.body).toHaveProperty('errors[0].property', 'jobId');
  });
});
