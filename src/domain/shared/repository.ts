export type GetOptions = {
  pageSize?: number;
  page?: number;
  where?: { [key: string]: string };
  orderBy?: string;
  order?: "asc" | "desc";
};
