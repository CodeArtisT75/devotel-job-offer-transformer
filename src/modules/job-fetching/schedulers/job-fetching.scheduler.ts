import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { Error } from 'sequelize';
import { LoggerService } from '../../../lib/logger';
import { JobFetchingService } from '../services/job-fetching.service';

@Injectable()
export class JobFetchingScheduler implements OnModuleInit, OnModuleDestroy {
  protected readonly CRON_JOB_NAME = 'job_fetching_cron_job';
  protected readonly CRON_JOB_EXPRESSION: string;

  constructor(
    protected configService: ConfigService,
    protected schedulerRegistry: SchedulerRegistry,
    protected loggerService: LoggerService,
    protected jobFetchingService: JobFetchingService,
  ) {
    this.CRON_JOB_EXPRESSION = this.configService.get<string>(
      'app.job_fetching_cron_expression',
      CronExpression.EVERY_MINUTE,
    );
  }

  onModuleInit() {
    const job = new CronJob(this.CRON_JOB_EXPRESSION, async () => this.handle());

    this.schedulerRegistry.addCronJob(this.CRON_JOB_NAME, job);
    job.start();

    this.loggerService.info('[-] Job Fetching Scheduler initialized with Cron Expression: ', this.CRON_JOB_EXPRESSION);
  }

  onModuleDestroy() {
    this.schedulerRegistry.deleteCronJob(this.CRON_JOB_NAME);
  }

  async handle() {
    try {
      await this.jobFetchingService.fetchAndStoreJobs();
    } catch (error) {
      this.logCronError(error);
    }
  }

  private logCronError(error: any) {
    let errorMessage = 'Unknown Error';

    if (error instanceof Error) {
      errorMessage = error.message;
    }

    this.loggerService.error('[x] Error in Job Fetching Scheduler: ', errorMessage);
  }
}
