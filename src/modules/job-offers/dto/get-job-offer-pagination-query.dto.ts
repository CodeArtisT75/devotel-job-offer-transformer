import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';
import { BaseValidationDto } from '../../../lib/base/base-validation-dto';

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
}
