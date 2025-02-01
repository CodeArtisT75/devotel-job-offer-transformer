import { Injectable } from '@nestjs/common';
import { JobSalaryCurrencyEnum } from '../../job-offers/enums/job-salary-currency.enum';
import { JobTypeEnum } from '../../job-offers/enums/job-type.enum';
import { JobProvidersConfig } from '../config/job-providers.config';
import { CreateJobDto } from '../dto/create-job.dto';
import { JobProviderInterface } from '../interfaces/job-provider.interface';
import { Api1ResponseType } from '../types/api1.response.type';
import { BaseProviderService } from './base-provider.service';

@Injectable()
export class Api1ProviderService
  extends BaseProviderService<Api1ResponseType>
  implements JobProviderInterface<Api1ResponseType>
{
  public getProviderName(): string {
    return JobProvidersConfig.providers.api1.name;
  }

  public getProviderUrl(): string {
    return JobProvidersConfig.providers.api1.url;
  }

  public transformJobs(rawJobsResponse: Api1ResponseType): CreateJobDto[] {
    return rawJobsResponse.jobs.map(job => {
      const salaryDetails = this.extractSalaryDetails(job.details.salaryRange);
      const locationDetails = this.extractLocation(job.details.location);
      const details = {
        company_industry: job.company.industry,
      };

      return {
        jobId: job.jobId,
        title: job.title,
        company: job.company.name,
        city: locationDetails.city,
        state: locationDetails.state,
        salaryMin: salaryDetails.min,
        salaryMax: salaryDetails.max,
        salaryCurrency: salaryDetails.currency,
        postedAt: new Date(job.postedDate),
        skills: job.skills,
        jobType: job.details.type as JobTypeEnum,
        rawJobData: job,
        details,
      };
    });
  }

  private extractSalaryDetails(salaryInfo: string): { min: number; max: number; currency: JobSalaryCurrencyEnum } {
    return {
      min: parseFloat(salaryInfo.split('-')[0].trim().replaceAll('$', '')) * 1000,
      max: parseFloat(salaryInfo.split('-')[1].trim().replaceAll('$', '')) * 1000,
      currency: salaryInfo.includes('$') ? JobSalaryCurrencyEnum.USD : JobSalaryCurrencyEnum.OTHER,
    };
  }

  private extractLocation(location: string): { city: string; state: string } {
    return {
      city: location.split(', ')[0],
      state: location.split(', ')[1],
    };
  }
}
