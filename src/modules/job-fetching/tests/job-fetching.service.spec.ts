import { Test, TestingModule } from '@nestjs/testing';
import { LoggerService } from '../../../lib/logger';
import { JobOffersService } from '../../job-offers/services/job-offers.service';
import { Api1ProviderService } from '../providers/api1-provider.service';
import { Api2ProviderService } from '../providers/api2-provider.service';
import { JobFetchingService } from '../services/job-fetching.service';
import {
  getMockApi1ProviderService,
  getMockApi2ProviderService,
  getMockJobOffersService,
  getMockLoggerService,
} from './utils/mocks';

describe('JobFetchingService', () => {
  let service: JobFetchingService;
  const mockApi1ProviderService = getMockApi1ProviderService();
  const mockApi2ProviderService = getMockApi2ProviderService();
  const mockLoggerService = getMockLoggerService();
  const mockJobOffersService = getMockJobOffersService();

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
  });
});
