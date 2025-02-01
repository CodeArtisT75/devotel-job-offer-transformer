import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { JobOffersModule } from '../job-offers/job-offers.module';
import { Api1ProviderService } from './providers/api1-provider.service';
import { Api2ProviderService } from './providers/api2-provider.service';
import { JobFetchingService } from './services/job-fetching.service';

@Module({
  imports: [HttpModule, JobOffersModule],

  providers: [JobFetchingService, Api1ProviderService, Api2ProviderService],

  exports: [JobFetchingService],
})
export class JobFetchingModule {}
