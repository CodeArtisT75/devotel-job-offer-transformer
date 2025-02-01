import { CreateJobDto } from '../dto/create-job.dto';

export interface JobProviderInterface<JobProviderResponse = any> {
  getProviderName(): string;

  getProviderUrl(): string;

  fetchJobs(): Promise<JobProviderResponse>;

  transformJobs(rawJobsResponse: JobProviderResponse): CreateJobDto[];
}
