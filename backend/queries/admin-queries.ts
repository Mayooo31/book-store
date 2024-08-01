export const getAllOrdersQuery =
  "SELECT * FROM orders ORDER BY created_at DESC LIMIT $1 OFFSET $2";
export const updateOrderStatusQuery =
  "UPDATE orders SET status = $1 WHERE id = $2";
export const addBookQuery =
  "INSERT INTO book (title, author, description, price, year_published, cover_image, pages, rating, is_available) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id";
export const addGenresToBookQuery = "SELECT insert_book_genres($1, $2::INT[])";
export const updateBookQuery =
  "UPDATE book SET title = $2, author = $3, description = $4, price = $5, year_published = $6, cover_image = $7, pages = $8, rating = $9, is_available = $10 WHERE id = $1 RETURNING *";
export const updateGenresToBookQuery =
  "SELECT update_book_genres($1, $2::INT[])";
export const deleteBookByIdQuery = "DELETE FROM book WHERE id = $1";
export const getStatisticsQuery = `SELECT
  -- Sum of total_price from orders in the last month
  (SELECT COALESCE(SUM(total_price), 0)
   FROM orders
   WHERE created_at >= (CURRENT_TIMESTAMP - interval '1 month')
     AND created_at < CURRENT_TIMESTAMP) AS total_sales_last_month,
  
  -- Number of orders in the last month
  (SELECT COUNT(*)
   FROM orders
   WHERE created_at >= (CURRENT_TIMESTAMP - interval '1 month')
     AND created_at < CURRENT_TIMESTAMP) AS number_of_orders_last_month,
  
  -- Number of distinct customers who made orders in the last month
  (SELECT COUNT(DISTINCT user_id)
   FROM orders
   WHERE created_at >= (CURRENT_TIMESTAMP - interval '1 month')
     AND created_at < CURRENT_TIMESTAMP) AS number_of_customers_last_month,

  -- Count of all books
  (SELECT COUNT(*) FROM book) AS total_books_count;
`;
export const getGenresQuery = "SELECT * FROM genre";
