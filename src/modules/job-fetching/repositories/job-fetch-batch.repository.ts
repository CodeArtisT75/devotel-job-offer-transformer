import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseRepository } from '../../../lib/base/base-repository';
import { JobFetchBatch } from '../entities/JobFetchBatch.entity';

@Injectable()
export class JobFetchBatchRepository extends BaseRepository<JobFetchBatch> {
  constructor(@InjectModel(JobFetchBatch) protected readonly jobFetchBatchModel: typeof JobFetchBatch) {
    super(jobFetchBatchModel);
  }
}
