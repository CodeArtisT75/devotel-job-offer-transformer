import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { JobOffersModule } from '../job-offers/job-offers.module';
import { FailedImportedJob } from './entities/FailedImportedJob.entity';
import { JobFetchBatch } from './entities/JobFetchBatch.entity';
import { Api1ProviderService } from './providers/api1-provider.service';
import { Api2ProviderService } from './providers/api2-provider.service';
import { FailedImportedJobRepository } from './repositories/failed-imported-job.repository';
import { JobFetchBatchRepository } from './repositories/job-fetch-batch.repository';
import { JobFetchingService } from './services/job-fetching.service';

@Module({
  imports: [SequelizeModule.forFeature([JobFetchBatch, FailedImportedJob]), HttpModule, JobOffersModule],

  providers: [
    JobFetchingService,
    JobFetchBatchRepository,
    FailedImportedJobRepository,
    Api1ProviderService,
    Api2ProviderService,
  ],

  exports: [JobFetchingService],
})
export class JobFetchingModule {}
