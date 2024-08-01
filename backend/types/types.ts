export type Book = {
  id?: number;
  title: string;
  author: string;
  description: string;
  price: number;
  yearPublished: number;
  coverImage: string;
  pages: number;
  rating: number;
  isAvailable: boolean;
  genres: string[];
};

export type PaginationQuery = {
  page?: string;
  limit?: string;
};
