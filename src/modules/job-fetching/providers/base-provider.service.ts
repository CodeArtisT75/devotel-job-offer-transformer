import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { CreateJobDto } from '../dto/create-job.dto';
import { FetchJobsApiErrorException } from '../exceptions/fetch-jobs-api-error.exception';
import { JobProviderInterface } from '../interfaces/job-provider.interface';

@Injectable()
export abstract class BaseProviderService<JobProviderResponse> implements JobProviderInterface<JobProviderResponse> {
  constructor(protected httpService: HttpService) {}

  public async fetchJobs(): Promise<JobProviderResponse> {
    try {
      const response = await this.httpService.axiosRef.get<JobProviderResponse>(this.getProviderUrl());

      return response.data;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_e) {
      throw new FetchJobsApiErrorException(this.getProviderName());
    }
  }

  public abstract getProviderName(): string;

  public abstract getProviderUrl(): string;

  public abstract transformJobs(rawJobsResponse: JobProviderResponse): CreateJobDto[];
}
