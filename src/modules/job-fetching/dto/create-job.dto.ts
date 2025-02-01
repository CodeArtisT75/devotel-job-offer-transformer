import { JobSalaryCurrencyEnum } from '../../job-offers/enums/job-salary-currency.enum';
import { JobTypeEnum } from '../../job-offers/enums/job-type.enum';

export class CreateJobDto {
  jobId!: string;

  jobType!: JobTypeEnum;

  title?: string;

  company?: string;

  state?: string;

  city?: string;

  salaryMin?: number;

  salaryMax?: number;

  salaryCurrency?: JobSalaryCurrencyEnum;

  postedAt?: Date;

  skills?: object;

  details?: object;
}
