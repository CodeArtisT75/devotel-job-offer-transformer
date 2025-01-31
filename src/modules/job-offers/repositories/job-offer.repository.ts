import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  BaseRepository,
  RepositoryCreateOptionsType,
  RepositoryDestroyOptionsType,
  RepositoryFindOptionsType,
  RepositoryPaginationOptionsType,
  RepositoryUpdateOptionsType,
} from '../../../lib/base/base-repository';
import { JobOffer } from '../entities/job.offer.entity';

@Injectable()
export class JobOfferRepository extends BaseRepository<JobOffer> {
  constructor(@InjectModel(JobOffer) protected readonly jobOfferModel: typeof JobOffer) {
    super();
  }

  public paginate(
    paginationOptions: RepositoryPaginationOptionsType,
    filters?: Partial<JobOffer>,
    options?: RepositoryFindOptionsType,
  ) {
    return this.jobOfferModel.paginate({
      page: paginationOptions.page,
      perPage: paginationOptions.perPage,
      where: filters,
      include: options?.include,
      order: options?.order,
      transaction: options?.transaction,
    });
  }

  public findAll(filters?: Partial<JobOffer>, options?: RepositoryFindOptionsType) {
    return this.jobOfferModel.findAll({
      where: filters,
      transaction: options?.transaction,
    });
  }

  public findOne(filters?: Partial<JobOffer>, options?: RepositoryFindOptionsType) {
    return this.jobOfferModel.findOne({
      where: filters,
      transaction: options?.transaction,
    });
  }

  public findOneOrFail(filters?: Partial<JobOffer>, options?: RepositoryFindOptionsType) {
    return this.jobOfferModel.findOneOrFail({
      where: filters,
      transaction: options?.transaction,
    });
  }

  public findByPk(id: number, options?: RepositoryFindOptionsType) {
    return this.jobOfferModel.findByPk(id, {
      transaction: options?.transaction,
    });
  }

  public findByPkOrFail(id: number, options?: RepositoryFindOptionsType) {
    return this.jobOfferModel.findByPkOrFail(id, {
      transaction: options?.transaction,
    });
  }

  public create(data: Partial<JobOffer>, options?: RepositoryCreateOptionsType) {
    return this.jobOfferModel.create(data, {
      transaction: options?.transaction,
    });
  }

  public async update(id: number, data: Partial<JobOffer>, options?: RepositoryUpdateOptionsType) {
    const jobOffer = await this.findByPkOrFail(id, options);

    return await jobOffer.update(data, { transaction: options?.transaction });
  }

  public async delete(id: number, options?: RepositoryDestroyOptionsType) {
    const jobOffer = await this.findByPkOrFail(id, options);

    await jobOffer.destroy({ transaction: options?.transaction });

    return jobOffer;
  }
}
