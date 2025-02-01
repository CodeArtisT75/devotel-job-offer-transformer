import { Injectable } from '@nestjs/common';
import { Transaction } from 'sequelize';
import { CreateJobOfferDto } from '../dto/create-job-offer.dto';
import { GetJobOfferPaginationQueryDto } from '../dto/get-job-offer-pagination-query.dto';
import { UpdateJobOfferDto } from '../dto/update-job-offer.dto';
import { JobOffer } from '../entities/job.offer.entity';
import { JobOfferRepository } from '../repositories/job-offer.repository';

@Injectable()
export class JobOffersService {
  constructor(protected jobOfferRepository: JobOfferRepository) {}

  create(createJobOfferDto: CreateJobOfferDto) {
    return this.jobOfferRepository.create({ ...createJobOfferDto });
  }

  async paginateJobOffers(getJobOfferPaginationQueryDto?: GetJobOfferPaginationQueryDto) {
    const filters: Partial<JobOffer> = {};

    const { rows, total, currentPage, perPage } = await this.jobOfferRepository.paginate(
      {
        page: getJobOfferPaginationQueryDto?.page,
        perPage: getJobOfferPaginationQueryDto?.perPage,
      },
      filters,
      {
        order: [['createdAt', 'DESC']],
      },
    );

    return {
      jobOffers: rows,
      total,
      currentPage,
      perPage,
    };
  }

  findOne(id: number) {
    return this.jobOfferRepository.findByPkOrFail(id);
  }

  async update(id: number, updateJobOfferDto: UpdateJobOfferDto) {
    const jobOffer = await this.findOne(id);

    return this.jobOfferRepository.update(jobOffer.id, updateJobOfferDto);
  }

  async remove(id: number) {
    const jobOffer = await this.findOne(id);

    await this.jobOfferRepository.delete(jobOffer.id);

    return jobOffer;
  }

  async createIfJobIdNotExists(
    jobOfferDto: CreateJobOfferDto,
    transaction?: Transaction,
  ): Promise<{
    created: boolean;
    jobOffer: JobOffer | null;
  }> {
    const existingJobOffer = await this.jobOfferRepository.findOne({ jobId: jobOfferDto.jobId });

    if (existingJobOffer) {
      return {
        created: false,
        jobOffer: null,
      };
    }

    return {
      created: true,
      jobOffer: await this.jobOfferRepository.create(jobOfferDto, { transaction }),
    };
  }
}
