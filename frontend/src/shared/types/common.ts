export type ApiMessage = {
  message?: string;
  Message?: string;
};

export type PagedResult<T> = {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
};
