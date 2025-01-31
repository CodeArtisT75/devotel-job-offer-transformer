import { Factory } from 'nestjs-seeder';
import {
  AllowNull,
  AutoIncrement,
  Column,
  CreatedAt,
  DataType,
  DeletedAt,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { BaseModel } from '../../../lib/base/base-model';
import { JobSalaryCurrencyEnum } from '../enums/job-salary-currency.enum';
import { JobTypeEnum } from '../enums/job-type.enum';

@Table({ tableName: 'job_offers', underscored: true })
export class JobOffer extends BaseModel {
  @Factory((faker, ctx) => (ctx?.id as number) ?? faker!.number.int({ min: 1, max: 1000 }))
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT)
  id!: number;

  @Factory((_faker, ctx) => (ctx?.fetchBatchId as string) ?? null)
  // @ForeignKey(() => JobFetchBatch)
  @Column(DataType.BIGINT)
  fetchBatchId: number;

  @Factory((faker, ctx) => (ctx?.jobId as string) ?? faker!.string.uuid())
  @AllowNull(false)
  @Column(DataType.STRING)
  jobId!: string;

  @Factory((faker, ctx) => (ctx?.jobType as string) ?? faker!.helpers.enumValue(JobTypeEnum))
  @Column(DataType.STRING)
  jobType: JobTypeEnum;

  @Factory((faker, ctx) => (ctx?.title as string) ?? faker!.person.jobTitle())
  @Column(DataType.STRING)
  title: string;

  @Factory((faker, ctx) => (ctx?.company as string) ?? faker!.company.name())
  @Column(DataType.STRING)
  company: string;

  @Factory((faker, ctx) => (ctx?.state as string) ?? faker!.location.state())
  @Column(DataType.STRING)
  state: string;

  @Factory((faker, ctx) => (ctx?.city as string) ?? faker!.location.city())
  @Column(DataType.STRING)
  city: string;

  @Factory((faker, ctx) => (ctx?.salaryMin as number) ?? faker!.number.int({ max: 5000 }))
  @Column(DataType.DOUBLE)
  salaryMin: number;

  @Factory((faker, ctx) => (ctx?.salaryMax as number) ?? faker!.number.int({ min: 5000 }))
  @Column(DataType.DOUBLE)
  salaryMax: number;

  @Factory((faker, ctx) => (ctx?.salaryCurrency as string) ?? faker!.helpers.enumValue(JobSalaryCurrencyEnum))
  @Column(DataType.STRING)
  salaryCurrency: JobSalaryCurrencyEnum;

  @Factory((faker, ctx) => (ctx?.postedAt as Date) ?? faker!.date.past())
  @Column(DataType.DATE)
  postedAt: Date;

  @Factory((faker, ctx) => (ctx?.skills as string[]) ?? faker!.helpers.arrayElements(['skill_1', 'skill_2', 'skill_3']))
  @Column(DataType.JSON)
  skills: object;

  @Factory((_faker, ctx) => (ctx?.details as object) ?? null)
  @Column(DataType.JSON)
  details: object;

  @Factory((_faker, ctx) => (ctx?.rawJobData as object) ?? null)
  @Column(DataType.JSON)
  rawJobData: object;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt: Date;

  // @BelongsTo(() => JobFetchBatch)
  // jobFetchBatch: JobFetchBatch;
}
