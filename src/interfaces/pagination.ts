export interface PaginationResponse {
  hasNext: boolean;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalCount: number;
  hasPrevious: boolean;
}
