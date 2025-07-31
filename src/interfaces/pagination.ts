export interface PaginationResponse {
  hasNext: boolean;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalCount: number;
  hasPrevious: boolean;
}

export interface PaginatedResponse<T> {
  currentPage: number;
  hasNext?: boolean;
  hasPrevious?: boolean;
  pageSize?: number;
  totalPages?: number;
  data: T[];
  totalCount?: number;
}
