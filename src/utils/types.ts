// ----------- GENERIC API RESPONSE -----------

export type ApiResponse<T> = {
  domain: string;
  current_page: number;
  last_page: number;
  page_size: number;
  total_count: number;
  data: T[];
};

export type ApiError = {
  message: string;
  code?: string;
  details?: any;
};





