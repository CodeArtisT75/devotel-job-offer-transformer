import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { JobTypeEnum } from '../../job-offers/enums/job-type.enum';
import { Api2ProviderService } from '../providers/api2-provider.service';
import { Api2ResponseType } from '../types/api2.response.type';

describe('Api2ProviderService', () => {
  let service: Api2ProviderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Api2ProviderService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<Api2ProviderService>(Api2ProviderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get provider name', () => {
    expect(service.getProviderName()).toBe('Provider 2');
  });

  it('should get provider url', () => {
    expect(service.getProviderUrl()).toBe('https://assignment.devotel.io/api/provider2/jobs');
  });

  it('should transform jobs', () => {
    const rawJobsResponse = {
      status: 'success',
      data: {
        jobsList: {
          'job-id-1': {
            position: 'Job Title',
            employer: {
              companyName: 'Company Name',
              website: 'https://company1.com',
            },
            location: {
              city: 'New York',
              state: 'NY',
              remote: true,
            },
            compensation: {
              min: 100000,
              max: 150000,
              currency: 'USD',
            },
            datePosted: '2022-01-01',
            requirements: {
              experience: 5,
              technologies: ['JavaScript', 'TypeScript'],
            },
          },
        },
      },
    };

    const result = service.transformJobs(rawJobsResponse as Api2ResponseType);

    expect(result).toEqual([
      {
        jobId: 'job-id-1',
        title: 'Job Title',
        company: 'Company Name',
        city: 'New York',
        state: 'NY',
        salaryMin: 100000,
        salaryMax: 150000,
        salaryCurrency: 'usd',
        postedAt: new Date('2022-01-01'),
        skills: ['JavaScript', 'TypeScript'],
        jobType: JobTypeEnum.REMOTE_TIME,
        rawJobData: rawJobsResponse.data.jobsList['job-id-1'],
        details: {
          location_remote: true,
          employer_website: 'https://company1.com',
          requirements_experience: 5,
        },
      },
    ]);
  });
});
