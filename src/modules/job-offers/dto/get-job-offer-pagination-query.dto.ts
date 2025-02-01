import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsNumberString, IsOptional, IsString, Max, Min } from 'class-validator';
import { BaseValidationDto } from '../../../lib/base/base-validation-dto';
import { JobTypeEnum } from '../enums/job-type.enum';

export class GetJobOfferPaginationQueryDto extends BaseValidationDto {
  @Transform(({ value }) => Number(value))
  @IsOptional()
  @IsInt()
  @Min(1)
  @ApiPropertyOptional()
  page?: number;

  @Transform(({ value }) => Number(value))
  @IsOptional()
  @IsInt()
  @Min(5)
  @Max(50)
  @ApiPropertyOptional()
  perPage?: number;

  @IsOptional()
  @IsEnum(JobTypeEnum)
  @ApiPropertyOptional()
  jobType?: JobTypeEnum;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  title?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  state?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  city?: string;

  @IsOptional()
  @IsNumberString()
  @ApiPropertyOptional()
  salaryMin?: number;

  @IsOptional()
  @IsNumberString()
  @ApiPropertyOptional()
  salaryMax?: number;
}
