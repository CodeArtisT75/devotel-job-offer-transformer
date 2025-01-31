import { Test, TestingModule } from '@nestjs/testing';
import { CreateJobOfferDto } from '../dto/create-job-offer.dto';
import { GetJobOfferPaginationQueryDto } from '../dto/get-job-offer-pagination-query.dto';
import { UpdateJobOfferDto } from '../dto/update-job-offer.dto';
import { JobOffer } from '../entities/job.offer.entity';
import { JobTypeEnum } from '../enums/job-type.enum';
import { JobOfferRepository } from '../repositories/job-offer.repository';
import { JobOffersService } from '../services/job-offers.service';
import { getMockJobOfferRepository } from './utils/mocks';

describe('JobOffersService', () => {
  let service: JobOffersService;
  const mockJobOffer = JobOffer.factory(1)[0] as Partial<JobOffer>;
  const mockJobOfferRepository = getMockJobOfferRepository(mockJobOffer);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JobOffersService,
        {
          provide: JobOfferRepository,
          useValue: mockJobOfferRepository,
        },
      ],
    }).compile();

    service = module.get<JobOffersService>(JobOffersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a job offer', async () => {
    const dto: CreateJobOfferDto = { jobId: 'id', jobType: JobTypeEnum.FULL_TIME, title: 'New Job Offer' };

    const result = await service.create(dto);

    expect(mockJobOfferRepository.create).toHaveBeenCalledWith(dto);
    expect(result).toEqual(mockJobOffer);
  });

  it('should return paginated job offers', async () => {
    const dto: GetJobOfferPaginationQueryDto = { page: 1, perPage: 10 };

    const result = await service.paginateJobOffers(dto);

    expect(mockJobOfferRepository.paginate).toHaveBeenCalledWith(
      { page: dto.page, perPage: dto.perPage },
      {},
      { order: [['createdAt', 'DESC']] },
    );

    expect(result).toEqual({
      jobOffers: [mockJobOffer],
      total: 1,
      currentPage: 1,
      perPage: 10,
    });
  });

  it('should return a job offer by ID', async () => {
    const id = 1;
    const result = await service.findOne(id);

    expect(mockJobOfferRepository.findByPkOrFail).toHaveBeenCalledWith(id);
    expect(result).toEqual(mockJobOffer);
  });

  it('should update a job offer', async () => {
    const id = mockJobOffer.id as number;
    const dto: UpdateJobOfferDto = { title: 'Updated Job Offer' };

    const result = await service.update(id, dto);

    expect(mockJobOfferRepository.update).toHaveBeenCalledWith(id, dto);
    expect(result).toEqual(mockJobOffer);
  });

  it('should delete a job offer', async () => {
    const id = 1;

    const result = await service.remove(id);

    expect(mockJobOfferRepository.delete).toHaveBeenCalled();
    expect(result).toEqual(mockJobOffer);
  });
});
