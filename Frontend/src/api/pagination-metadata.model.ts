export const API_PAGINATION_HEADER = "X-Pagination";

export interface PaginationMetadata {
  pageIndex: number;
  pageSize: number;
  totalItems: number;
  previousPageUrl: string | null;
  nextPageUrl: string | null;
}
