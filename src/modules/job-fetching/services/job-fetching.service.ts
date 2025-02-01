import { Injectable } from '@nestjs/common';
import { Transaction } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { LoggerService } from '../../../lib/logger';
import { JobOffersService } from '../../job-offers/services/job-offers.service';
import { JobFetchBatch } from '../entities/JobFetchBatch.entity';
import { FetchJobsApiErrorException } from '../exceptions/fetch-jobs-api-error.exception';
import { JobProviderInterface } from '../interfaces/job-provider.interface';
import { Api1ProviderService } from '../providers/api1-provider.service';
import { Api2ProviderService } from '../providers/api2-provider.service';
import { FailedImportedJobRepository } from '../repositories/failed-imported-job.repository';
import { JobFetchBatchRepository } from '../repositories/job-fetch-batch.repository';

@Injectable()
export class JobFetchingService {
  protected providers: JobProviderInterface[];

  constructor(
    protected readonly sequelize: Sequelize,
    protected readonly loggerService: LoggerService,
    protected readonly jobOffersService: JobOffersService,
    protected readonly jobFetchBatchRepository: JobFetchBatchRepository,
    protected readonly failedImportedJobRepository: FailedImportedJobRepository,
    protected readonly api1ProviderService: Api1ProviderService,
    protected readonly api2ProviderService: Api2ProviderService,
  ) {
    this.providers = [api1ProviderService, api2ProviderService];
  }

  async fetchAndStoreJobs() {
    let totalJobNumberStored = 0;

    for (const provider of this.providers) {
      const transaction = await this.sequelize.transaction();

      try {
        const jobsResponse: unknown = await provider.fetchJobs();
        const jobFetchBatch = await this.jobFetchBatchRepository.create(
          {
            providerName: provider.getProviderName(),
            jobs: jobsResponse as object,
            startedAt: new Date(),
          },
          { transaction },
        );

        const transformedJobs = provider.transformJobs(jobsResponse);
        let providerJobNumberStored = 0;

        for (const job of transformedJobs) {
          try {
            await this.jobOffersService.createIfJobIdNotExists(job, jobFetchBatch.id, transaction);

            totalJobNumberStored++;
            providerJobNumberStored++;
          } catch (error) {
            await this.handleJobStoringError(job, error, jobFetchBatch, transaction);
          }
        }

        await this.jobFetchBatchRepository.update(
          jobFetchBatch.id,
          {
            endedAt: new Date(),
          },
          { transaction: transaction },
        );

        await transaction.commit();

        this.loggerService.info(
          `[-] Total of jobs fetched from ${provider.getProviderName()} provider: ${providerJobNumberStored}`,
        );
      } catch (providerError) {
        await transaction.rollback();

        this.logProviderError(providerError);
      }
    }

    this.loggerService.info('[-] Total of jobs fetched from all Providers: ' + totalJobNumberStored);
  }

  private async handleJobStoringError(job: object, error: any, jobFetchBatch: JobFetchBatch, transaction: Transaction) {
    let errorMessage = 'Unknown Error';

    if (error instanceof Error) {
      errorMessage = error.message;
    }

    await this.failedImportedJobRepository.create(
      {
        fetchBatchId: jobFetchBatch.id,
        jobDetails: job,
        error: errorMessage,
      },
      { transaction },
    );

    this.loggerService.error(`[x] Error adding job: ${errorMessage}`);
  }

  private logProviderError(providerError: any) {
    if (providerError instanceof FetchJobsApiErrorException) {
      this.loggerService.error(
        `[x] Error fetching jobs from provider: ${providerError.provider}. Error: ${providerError.message}`,
      );
    } else if (providerError instanceof Error) {
      this.loggerService.error(`[x] Error processing provider: ${providerError.message}`);
    } else {
      this.loggerService.error(`[x] Error processing provider: Unknown Error`);
    }
  }
}
