import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseRepository } from '../../../lib/base/base-repository';
import { FailedImportedJob } from '../entities/FailedImportedJob.entity';

@Injectable()
export class FailedImportedJobRepository extends BaseRepository<FailedImportedJob> {
  constructor(@InjectModel(FailedImportedJob) protected readonly failedImportedJobModel: typeof FailedImportedJob) {
    super(failedImportedJobModel);
  }
}
