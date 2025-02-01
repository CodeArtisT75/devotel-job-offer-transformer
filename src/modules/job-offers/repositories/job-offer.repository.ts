import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseRepository } from '../../../lib/base/base-repository';
import { JobOffer } from '../entities/JobOffer.entity';

@Injectable()
export class JobOfferRepository extends BaseRepository<JobOffer> {
  constructor(@InjectModel(JobOffer) protected readonly jobOfferModel: typeof JobOffer) {
    super(jobOfferModel);
  }
}
