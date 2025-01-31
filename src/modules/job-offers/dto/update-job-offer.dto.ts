import { PartialType } from '@nestjs/swagger';
import { CreateJobOfferDto } from './create-job-offer.dto';

export class UpdateJobOfferDto extends PartialType(CreateJobOfferDto) {}
