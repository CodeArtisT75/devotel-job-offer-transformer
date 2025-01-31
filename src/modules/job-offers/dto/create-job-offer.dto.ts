import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsEnum, IsISO8601, IsNumber, IsObject, IsOptional, IsString, Min } from 'class-validator';
import { BaseValidationDto } from '../../../lib/base/base-validation-dto';
import { JobSalaryCurrencyEnum } from '../enums/job-salary-currency.enum';
import { JobTypeEnum } from '../enums/job-type.enum';

export class CreateJobOfferDto extends BaseValidationDto {
  @IsString()
  @ApiProperty()
  jobId!: string;

  @IsEnum(JobTypeEnum)
  @ApiProperty({ enum: JobTypeEnum })
  jobType!: JobTypeEnum;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  title?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  company?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  state?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  city?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @ApiPropertyOptional()
  salaryMin?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @ApiPropertyOptional()
  salaryMax?: number;

  @IsOptional()
  @IsEnum(JobSalaryCurrencyEnum)
  @ApiPropertyOptional({ enum: JobSalaryCurrencyEnum })
  salaryCurrency?: JobSalaryCurrencyEnum;

  @IsOptional()
  @IsISO8601()
  @ApiPropertyOptional()
  postedAt?: Date;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ApiPropertyOptional()
  skills?: object;

  @IsOptional()
  @IsObject()
  @ApiPropertyOptional()
  details?: object;
}
