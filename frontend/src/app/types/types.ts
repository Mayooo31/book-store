export type Book = {
  id: number;
  title: string;
  author: string;
  description: string;
  price: number;
  year_published: number;
  cover_image: string;
  pages: number;
  rating: number;
  is_available: boolean;
  genres: string[];
};

export type GetBooksResults = {
  results: Book[];
  totalBooks: number;
  totalPages: number;
  currentPage: number;
};

export type PaginationInfo = {
  currentPage: number;
  totalBooks: number;
  totalPages: number;
};

export type Cart = {
  items: CartItem[];
  subtotal_price: number;
  shipping: number;
  service_fee: number;
  total_price: number;
};

export type CartItem = {
  book_id: number;
  title: string;
  cover_image: string;
  price: string;
  quantity: number;
};

export type OrderItem = {
  book_id: number;
  quantity: number;
  price: number;
  title: string;
};

export type OrderById = {
  items: OrderItem[];
  created_at: string;
  order_id: number;
  status: string;
  total_price: number;
  shipping_address: string;
  payment: string;
};

export type OrderDetail = {
  id: number;
  user_id: number;
  total_price: string;
  shipping_address: string;
  payment: string;
  created_at: string;
  status: string;
};

export type Statistics = {
  total_sales_last_month: number;
  number_of_orders_last_month: number;
  number_of_customers_last_month: number;
  total_books_count: number;
};

export type Genre = {
  id: number;
  genre: string;
};

export type LoginResults = {
  email: string;
  expiresAt: string;
  message: string;
  name: string;
  role: string;
  token: string;
};

export type GetAllOrdersResults = {
  results: OrderDetail[];
  totalOrders: number;
  totalPages: number;
  currentPage: string;
};
