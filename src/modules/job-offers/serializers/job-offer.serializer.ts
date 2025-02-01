import { JobOffer } from '../entities/JobOffer.entity';
import { JobSalaryCurrencyEnum } from '../enums/job-salary-currency.enum';
import { JobTypeEnum } from '../enums/job-type.enum';

export class JobOfferSerializer {
  constructor(jobOffer: JobOffer) {
    this.id = +jobOffer.id;
    this.jobId = jobOffer.jobId;
    this.jobType = jobOffer.jobType;
    this.title = jobOffer.title;
    this.company = jobOffer.company;
    this.state = jobOffer.state;
    this.city = jobOffer.city;
    this.salaryMin = jobOffer.salaryMin;
    this.salaryMax = jobOffer.salaryMax;
    this.salaryCurrency = jobOffer.salaryCurrency;
    this.postedAt = jobOffer.postedAt;
    this.skills = jobOffer.skills;
    this.details = jobOffer.details;
    this.createdAt = jobOffer.createdAt;
    this.updatedAt = jobOffer.updatedAt;
  }

  id: number;

  jobId!: string;

  jobType: JobTypeEnum;

  title: string;

  company: string;

  state: string;

  city: string;

  salaryMin: number;

  salaryMax: number;

  salaryCurrency: JobSalaryCurrencyEnum;

  postedAt: Date;

  skills: object;

  details: object;

  createdAt: Date;

  updatedAt: Date;
}
