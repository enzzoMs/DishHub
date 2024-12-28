export interface PaginatedItems<T> {
  data: T[];
  pageNumber: number;
  totalItems: number;
}
