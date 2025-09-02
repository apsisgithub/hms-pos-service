export interface PaginatedResult<T> {
  records: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
