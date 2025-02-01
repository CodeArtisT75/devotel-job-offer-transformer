import { Test, TestingModule } from '@nestjs/testing';
import { JobOffersController } from '../controllers/job-offers.controller';
import { CreateJobOfferDto } from '../dto/create-job-offer.dto';
import { GetJobOfferPaginationQueryDto } from '../dto/get-job-offer-pagination-query.dto';
import { UpdateJobOfferDto } from '../dto/update-job-offer.dto';
import { JobOffer } from '../entities/JobOffer.entity';
import { JobTypeEnum } from '../enums/job-type.enum';
import { JobOfferSerializer } from '../serializers/job-offer.serializer';
import { JobOffersService } from '../services/job-offers.service';
import { getMockJobOffersService } from './utils/mocks';

describe('JobOffersController', () => {
  let controller: JobOffersController;
  const mockJobOffer = JobOffer.factory(1, { id: 1 })[0] as Partial<JobOffer>;
  const serializedJobOffer = new JobOfferSerializer(mockJobOffer as JobOffer);
  const mockedJobOfferService = getMockJobOffersService(mockJobOffer);

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [JobOffersController],
      providers: [
        {
          provide: JobOffersService,
          useValue: mockedJobOfferService,
        },
      ],
    }).compile();

    controller = module.get<JobOffersController>(JobOffersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a job offer', async () => {
    const dto: CreateJobOfferDto = { jobId: 'id', jobType: JobTypeEnum.FULL_TIME, title: 'New Job Offer' };

    const result = await controller.create(dto);

    expect(mockedJobOfferService.create).toHaveBeenCalledWith(dto);
    expect(result).toEqual(serializedJobOffer);
  });

  it('should return paginated job offers', async () => {
    const dto: GetJobOfferPaginationQueryDto = { page: 1, perPage: 10 };

    const result = await controller.paginate(dto);

    expect(mockedJobOfferService.paginateJobOffers).toHaveBeenCalledWith(dto);
    expect(result).toEqual({
      items: [serializedJobOffer],
      total: 1,
      currentPage: 1,
      perPage: 10,
    });
  });

  it('should return a job offer by ID', async () => {
    const id = 1;

    const result = await controller.findOne(id);

    expect(mockedJobOfferService.findOne).toHaveBeenCalledWith(id);
    expect(result).toEqual(serializedJobOffer);
  });

  it('should update a job offer', async () => {
    const id = mockJobOffer.id as number;
    const dto: UpdateJobOfferDto = { title: 'Updated Job Offer' };

    const result = await controller.update(id, dto);

    expect(mockedJobOfferService.update).toHaveBeenCalledWith(id, dto);
    expect(result).toEqual(serializedJobOffer);
  });

  it('should delete a job offer', async () => {
    const id = 1;

    const result = await controller.remove(id);

    expect(mockedJobOfferService.remove).toHaveBeenCalledWith(id);
    expect(result).toBeNull();
  });
});
