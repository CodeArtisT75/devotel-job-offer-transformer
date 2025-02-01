import { ApiProperty } from '@nestjs/swagger';
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

  @ApiProperty()
  id: number;

  @ApiProperty()
  jobId!: string;

  @ApiProperty({ enum: JobTypeEnum })
  jobType: JobTypeEnum;

  @ApiProperty()
  title: string;

  @ApiProperty()
  company: string;

  @ApiProperty()
  state: string;

  @ApiProperty()
  city: string;

  @ApiProperty()
  salaryMin: number;

  @ApiProperty()
  salaryMax: number;

  @ApiProperty({ enum: JobSalaryCurrencyEnum })
  salaryCurrency: JobSalaryCurrencyEnum;

  @ApiProperty()
  postedAt: Date;

  @ApiProperty()
  skills: object;

  @ApiProperty()
  details: object;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
