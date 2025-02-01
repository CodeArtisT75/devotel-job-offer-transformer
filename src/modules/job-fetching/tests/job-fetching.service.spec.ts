import { getConnectionToken } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';
import { LoggerService } from '../../../lib/logger';
import { JobOffersService } from '../../job-offers/services/job-offers.service';
import { JobFetchBatch } from '../entities/JobFetchBatch.entity';
import { Api1ProviderService } from '../providers/api1-provider.service';
import { Api2ProviderService } from '../providers/api2-provider.service';
import { FailedImportedJobRepository } from '../repositories/failed-imported-job.repository';
import { JobFetchBatchRepository } from '../repositories/job-fetch-batch.repository';
import { JobFetchingService } from '../services/job-fetching.service';
import {
  getMockApi1ProviderService,
  getMockApi2ProviderService,
  getMockFailedImportedJobRepository,
  getMockJobFetchBatchRepository,
  getMockJobOffersService,
  getMockLoggerService,
} from './utils/mocks';

describe('JobFetchingService', () => {
  let service: JobFetchingService;
  const mockedJobFetchBatchModel = JobFetchBatch.factory(1)[0];
  const mockApi1ProviderService = getMockApi1ProviderService();
  const mockApi2ProviderService = getMockApi2ProviderService();
  const mockLoggerService = getMockLoggerService();
  const mockJobOffersService = getMockJobOffersService();
  const mockJobFetchBatchRepository = getMockJobFetchBatchRepository();
  const mockFailedImportedJobRepository = getMockFailedImportedJobRepository();

  mockJobFetchBatchRepository.create.mockResolvedValue(mockedJobFetchBatchModel);
  mockJobFetchBatchRepository.update.mockResolvedValue(mockedJobFetchBatchModel);

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JobFetchingService,
        {
          provide: JobOffersService,
          useValue: mockJobOffersService,
        },
        {
          provide: LoggerService,
          useValue: mockLoggerService,
        },
        {
          provide: Api1ProviderService,
          useValue: mockApi1ProviderService,
        },
        {
          provide: Api2ProviderService,
          useValue: mockApi2ProviderService,
        },
        {
          provide: JobFetchBatchRepository,
          useValue: mockJobFetchBatchRepository,
        },
        {
          provide: FailedImportedJobRepository,
          useValue: mockFailedImportedJobRepository,
        },
        {
          provide: getConnectionToken(),
          useValue: {
            transaction: jest.fn(() => ({
              commit: jest.fn(),
              rollback: jest.fn(),
            })),
          },
        },
      ],
    }).compile();

    service = module.get<JobFetchingService>(JobFetchingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should fetch and store jobs from all providers', async () => {
    const mockJobs = [{ id: 1 }, { id: 2 }];
    mockApi1ProviderService.fetchJobs.mockResolvedValue(mockJobs);
    mockApi1ProviderService.transformJobs.mockReturnValue(mockJobs);
    mockApi2ProviderService.fetchJobs.mockResolvedValue(mockJobs);
    mockApi2ProviderService.transformJobs.mockReturnValue(mockJobs);

    await service.fetchAndStoreJobs();

    expect(mockApi1ProviderService.fetchJobs).toHaveBeenCalledTimes(1);
    expect(mockApi1ProviderService.transformJobs).toHaveBeenCalledTimes(1);
    expect(mockApi2ProviderService.fetchJobs).toHaveBeenCalledTimes(1);
    expect(mockApi2ProviderService.transformJobs).toHaveBeenCalledTimes(1);
    expect(mockJobOffersService.createIfJobIdNotExists).toHaveBeenCalledTimes(4);
    expect(mockJobFetchBatchRepository.create).toHaveBeenCalledTimes(2);
  });

  it('should handle errors when fetching jobs from a provider and log errors', async () => {
    const mockJobs = [{ id: 1 }, { id: 2 }];
    mockApi1ProviderService.fetchJobs.mockRejectedValue(new Error('Mock error'));
    mockApi1ProviderService.transformJobs.mockReturnValue(mockJobs);
    mockApi2ProviderService.fetchJobs.mockResolvedValue(mockJobs);
    mockApi2ProviderService.transformJobs.mockReturnValue(mockJobs);

    await service.fetchAndStoreJobs();

    expect(mockApi1ProviderService.fetchJobs).toHaveBeenCalledTimes(1);
    expect(mockApi2ProviderService.fetchJobs).toHaveBeenCalledTimes(1);
    expect(mockApi2ProviderService.transformJobs).toHaveBeenCalledTimes(1);
    expect(mockJobOffersService.createIfJobIdNotExists).toHaveBeenCalledTimes(2);
    expect(mockLoggerService.error).toHaveBeenCalledTimes(1);
    expect(mockJobFetchBatchRepository.create).toHaveBeenCalledTimes(1);
    expect(mockJobFetchBatchRepository.update).toHaveBeenCalledTimes(1);
  });
});
