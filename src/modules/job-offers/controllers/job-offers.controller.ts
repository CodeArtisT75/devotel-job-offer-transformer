import { Body, Controller, Delete, Get, HttpStatus, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { TransformResponse } from '../../../lib/decorators/transform-response.decorator';
import { IPaginationResponse } from '../../../lib/interfaces/pagination-response.interface';
import { CreateJobOfferDto } from '../dto/create-job-offer.dto';
import { GetJobOfferPaginationQueryDto } from '../dto/get-job-offer-pagination-query.dto';
import { UpdateJobOfferDto } from '../dto/update-job-offer.dto';
import { JobOffer } from '../entities/JobOffer.entity';
import { JobOffersService } from '../services/job-offers.service';

@Controller('api/job-offers')
export class JobOffersController {
  constructor(protected readonly jobOffersService: JobOffersService) {}

  @TransformResponse({ model: JobOffer, httpStatus: HttpStatus.CREATED, message: 'crud.create' })
  @Post()
  async create(@Body() createJobOfferDto: CreateJobOfferDto): Promise<JobOffer> {
    return this.jobOffersService.create(createJobOfferDto);
  }

  @TransformResponse({ model: JobOffer, isPagination: true, message: 'crud.read' })
  @Get()
  async paginate(
    @Query() getJobOfferPaginationQueryDto: GetJobOfferPaginationQueryDto,
  ): Promise<IPaginationResponse<JobOffer>> {
    const { jobOffers, total, currentPage, perPage } =
      await this.jobOffersService.paginateJobOffers(getJobOfferPaginationQueryDto);

    return {
      items: jobOffers,
      total,
      currentPage,
      perPage,
    };
  }

  @TransformResponse({ model: JobOffer, message: 'crud.read' })
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<JobOffer> {
    return this.jobOffersService.findOne(id);
  }

  @TransformResponse({ model: JobOffer, message: 'crud.update' })
  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateJobOfferDto: UpdateJobOfferDto): Promise<JobOffer> {
    return this.jobOffersService.update(id, updateJobOfferDto);
  }

  @TransformResponse({ message: 'crud.delete' })
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<null> {
    await this.jobOffersService.remove(id);

    return null;
  }
}
