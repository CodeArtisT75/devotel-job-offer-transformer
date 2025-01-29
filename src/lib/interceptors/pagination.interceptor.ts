import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map } from 'rxjs';
import { IPaginationResponse } from '../interfaces/pagination-response.interface';

@Injectable()
export class PaginationInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      map((data: IPaginationResponse) => {
        const { total, perPage, currentPage, items } = data;
        const lastPage = Math.ceil(total / perPage);

        return {
          items,
          pagination: {
            currentPage: Number(currentPage),
            lastPage: lastPage > 0 ? lastPage : 1, // last page must be 1 if total = 0
            perPage: Number(perPage),
            total: Number(total),
          },
        };
      }),
    );
  }
}
