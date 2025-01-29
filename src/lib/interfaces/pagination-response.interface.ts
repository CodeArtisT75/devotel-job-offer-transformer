export interface IPaginationResponse<T = unknown> {
  items: T[];
  currentPage: number;
  perPage: number;
  total: number;
}
