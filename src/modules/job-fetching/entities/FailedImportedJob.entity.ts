import { Factory } from 'nestjs-seeder';
import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from '../../../lib/base/base-model';
import { JobFetchBatch } from './JobFetchBatch.entity';

@Table({ tableName: 'failed_imported_jobs', underscored: true, updatedAt: false })
export class FailedImportedJob extends BaseModel {
  @Factory((_faker, ctx) => ctx?.id as number)
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT)
  id!: number;

  @Factory((_faker, ctx) => (ctx?.fetchBatchId as number) ?? null)
  @ForeignKey(() => JobFetchBatch)
  @Column({ type: DataType.BIGINT })
  fetchBatchId: number;

  @Factory((_faker, ctx) => (ctx?.jobDetails as object) ?? {})
  @AllowNull(false)
  @Column(DataType.JSON)
  jobDetails: object;

  @Factory((faker, ctx) => (ctx?.error as string) ?? faker!.lorem.text())
  @Column(DataType.TEXT)
  error: string;

  @Factory((faker, ctx) => (ctx?.failedAt as Date) ?? faker!.date.past())
  @CreatedAt
  failedAt: Date;

  @BelongsTo(() => JobFetchBatch)
  batch: JobFetchBatch;
}
