import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { JobOffersController } from './controllers/job-offers.controller';
import { JobOffer } from './entities/JobOffer.entity';
import { JobOfferRepository } from './repositories/job-offer.repository';
import { JobOffersService } from './services/job-offers.service';

@Module({
  imports: [SequelizeModule.forFeature([JobOffer])],

  controllers: [JobOffersController],

  providers: [JobOffersService, JobOfferRepository],

  exports: [JobOffersService],
})
export class JobOffersModule {}
