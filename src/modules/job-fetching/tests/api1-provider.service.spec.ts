import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { Api1ProviderService } from '../providers/api1-provider.service';
import { Api1ResponseType } from '../types/api1.response.type';

describe('Api1ProviderService', () => {
  let service: Api1ProviderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Api1ProviderService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<Api1ProviderService>(Api1ProviderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get provider name', () => {
    expect(service.getProviderName()).toBe('Provider 1');
  });

  it('should get provider url', () => {
    expect(service.getProviderUrl()).toBe('https://assignment.devotel.io/api/provider1/jobs');
  });

  it('should transform raw jobs to CreateJobDto', () => {
    const rawJobsResponse = {
      jobs: [
        {
          jobId: 'job-id-1',
          title: 'Job Title',
          company: {
            name: 'Company Name',
            industry: 'Industry Name',
          },
          details: {
            salaryRange: '$10k - $20k',
            location: 'New York, NY',
            type: 'Full-Time',
          },
          postedDate: '2022-01-01',
          skills: ['Skill 1', 'Skill 2'],
        },
      ],
    };

    const result = service.transformJobs(rawJobsResponse as Api1ResponseType);

    expect(result).toEqual([
      {
        jobId: 'job-id-1',
        title: 'Job Title',
        company: 'Company Name',
        city: 'New York',
        state: 'NY',
        salaryMin: 10000,
        salaryMax: 20000,
        salaryCurrency: 'usd',
        postedAt: new Date('2022-01-01'),
        skills: ['Skill 1', 'Skill 2'],
        jobType: 'Full-Time',
        rawJobData: rawJobsResponse.jobs[0],
        details: {
          company_industry: 'Industry Name',
        },
      },
    ]);
  });

  it('should extract salary details', () => {
    const salaryInfo = '$89k - $147k';

    const result = service['extractSalaryDetails'](salaryInfo); // call private method for testing

    expect(result).toEqual({
      min: 89000,
      max: 147000,
      currency: 'usd',
    });
  });

  it('should extract location details', () => {
    const location = 'New York, NY';

    const result = service['extractLocation'](location); // call private method for testing

    expect(result).toEqual({
      city: 'New York',
      state: 'NY',
    });
  });
});
