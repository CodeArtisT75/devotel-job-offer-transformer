import { Injectable } from '@nestjs/common';
import { LoggerService } from '../../../lib/logger';
import { JobOffersService } from '../../job-offers/services/job-offers.service';
import { FetchJobsApiErrorException } from '../exceptions/fetch-jobs-api-error.exception';
import { JobProviderInterface } from '../interfaces/job-provider.interface';
import { Api1ProviderService } from '../providers/api1-provider.service';
import { Api2ProviderService } from '../providers/api2-provider.service';

@Injectable()
export class JobFetchingService {
  protected providers: JobProviderInterface[];

  constructor(
    protected readonly loggerService: LoggerService,
    protected readonly jobOffersService: JobOffersService,
    protected readonly api1ProviderService: Api1ProviderService,
    protected readonly api2ProviderService: Api2ProviderService,
  ) {
    this.providers = [api1ProviderService, api2ProviderService];
  }

  async fetchAndStoreJobs() {
    let totalStored = 0;

    for (const provider of this.providers) {
      try {
        const transformedJobs = provider.transformJobs(await provider.fetchJobs());
        let totalProviderStored = 0;

        for (const job of transformedJobs) {
          try {
            await this.jobOffersService.createIfJobIdNotExists(job);

            totalStored++;
            totalProviderStored++;
          } catch (error) {
            if (error instanceof Error) {
              this.loggerService.error(`[x] Error adding job: ${error.message}`);
            }
          }
        }

        this.loggerService.info(
          `[-] Total of jobs fetched from ${provider.getProviderName()} provider: ${totalProviderStored}`,
        );
      } catch (providerError) {
        this.logProviderError(providerError);
      }
    }

    this.loggerService.info('[-] Total of jobs fetched from all Providers: ' + totalStored);
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
