import { ConfigService } from '@nestjs/config';
import { SchedulerRegistry } from '@nestjs/schedule';
import { Test, TestingModule } from '@nestjs/testing';
import { LoggerService } from '../../../lib/logger';
import { JobFetchingScheduler } from '../schedulers/job-fetching.scheduler';
import { JobFetchingService } from '../services/job-fetching.service';
import { getMockJobFetchingService, getMockLoggerService, getMockSchedulerRegistry } from './utils/mocks';

describe('JobFetchingScheduler', () => {
  let schedulerService: JobFetchingScheduler;
  let module: TestingModule;
  const mockJobFetchingService = getMockJobFetchingService();
  const mockLoggerService = getMockLoggerService();
  const mockSchedulerRegistry = getMockSchedulerRegistry();

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        JobFetchingScheduler,
        {
          provide: SchedulerRegistry,
          useValue: mockSchedulerRegistry,
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: LoggerService,
          useValue: mockLoggerService,
        },
        {
          provide: JobFetchingService,
          useValue: mockJobFetchingService,
        },
      ],
    }).compile();

    schedulerService = module.get<JobFetchingScheduler>(JobFetchingScheduler);
  });

  it('should be defined', () => {
    expect(schedulerService).toBeDefined();
  });

  it('should initialize with Cron Expression', () => {
    // set CRON_JOB_EXPRESSION for test purposes
    (schedulerService as object)['CRON_JOB_EXPRESSION'] = '* * * * *';

    schedulerService.onModuleInit();

    expect(mockSchedulerRegistry.addCronJob).toHaveBeenCalledTimes(1);
    expect(mockSchedulerRegistry.addCronJob).toHaveBeenCalledWith('job_fetching_cron_job', expect.anything());
    expect(mockLoggerService.info).toHaveBeenCalledTimes(1);
  });

  it('should handle job fetching', async () => {
    await schedulerService.handle();

    expect(mockJobFetchingService.fetchAndStoreJobs).toHaveBeenCalledTimes(1);
  });

  it('should log error when job fetching fails', async () => {
    mockJobFetchingService.fetchAndStoreJobs.mockRejectedValue(new Error('Mock error'));

    await schedulerService.handle();

    expect(mockLoggerService.error).toHaveBeenCalledTimes(1);
  });
});
