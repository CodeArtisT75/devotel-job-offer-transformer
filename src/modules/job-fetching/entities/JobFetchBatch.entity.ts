import { Factory } from 'nestjs-seeder';
import { AllowNull, AutoIncrement, Column, DataType, HasMany, PrimaryKey, Table } from 'sequelize-typescript';
import { BaseModel } from '../../../lib/base/base-model';
import { JobOffer } from '../../job-offers/entities/JobOffer.entity';
import { FailedImportedJob } from './FailedImportedJob.entity';

@Table({ tableName: 'job_fetch_batches', underscored: true })
export class JobFetchBatch extends BaseModel {
  @Factory((faker, ctx) => (ctx?.id as number) ?? faker!.number.int({ min: 1, max: 1000 }))
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT)
  id!: number;

  @Factory((faker, ctx) => (ctx?.providerName as string) ?? faker!.word.noun())
  @AllowNull(false)
  @Column
  providerName!: string;

  @Factory((_faker, ctx) => (ctx?.jobs as object) ?? {})
  @Column(DataType.JSON)
  jobs: any;

  @Factory((faker, ctx) => (ctx?.startedAt as Date) ?? faker!.date.past())
  @Column
  startedAt: Date;

  @Factory((faker, ctx) => (ctx?.endedAt as Date) ?? faker!.date.past())
  @Column
  endedAt: Date;

  @AllowNull(false)
  @Column
  createdAt: Date;

  @HasMany(() => JobOffer)
  jobOffers: JobOffer[];

  @HasMany(() => FailedImportedJob)
  failedJobs: FailedImportedJob[];
}
