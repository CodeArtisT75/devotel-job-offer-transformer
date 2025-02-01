import { Injectable } from '@nestjs/common';
import { JobSalaryCurrencyEnum } from '../../job-offers/enums/job-salary-currency.enum';
import { JobTypeEnum } from '../../job-offers/enums/job-type.enum';
import { JobProvidersConfig } from '../config/job-providers.config';
import { CreateJobDto } from '../dto/create-job.dto';
import { JobProviderInterface } from '../interfaces/job-provider.interface';
import { Api2ResponseType } from '../types/api2.response.type';
import { BaseProviderService } from './base-provider.service';

@Injectable()
export class Api2ProviderService
  extends BaseProviderService<Api2ResponseType>
  implements JobProviderInterface<Api2ResponseType>
{
  public getProviderName(): string {
    return JobProvidersConfig.providers.api2.name;
  }

  public getProviderUrl(): string {
    return JobProvidersConfig.providers.api2.url;
  }

  public transformJobs(rawJobsResponse: Api2ResponseType): CreateJobDto[] {
    return Object.entries(rawJobsResponse.data.jobsList).map(([jobId, job]) => {
      const details = {
        location_remote: job.location.remote,
        employer_website: job.employer.website,
        requirements_experience: job.requirements.experience,
      };

      return {
        jobId: jobId,
        title: job.position,
        company: job.employer.companyName,
        city: job.location.city,
        state: job.location.state,
        salaryMin: job.compensation.min,
        salaryMax: job.compensation.max,
        salaryCurrency:
          job.compensation.currency?.trim() === 'USD' ? JobSalaryCurrencyEnum.USD : JobSalaryCurrencyEnum.OTHER,
        postedAt: new Date(job.datePosted),
        skills: job.requirements.technologies,
        jobType: job.location.remote ? JobTypeEnum.REMOTE_TIME : JobTypeEnum.FULL_TIME,
        rawJobData: job,
        details,
      };
    });
  }
}
