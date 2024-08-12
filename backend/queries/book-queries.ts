export const getBooksQuery =
  "SELECT b.*, array_agg(g.genre) AS genres FROM book b JOIN book_genre bg ON b.id = bg.book_id JOIN genre g ON bg.genre_id = g.id GROUP BY b.id LIMIT $1 OFFSET $2";
export const getBookByIdQuery =
  "SELECT b.*, array_agg(g.genre) AS genres FROM book b JOIN book_genre bg ON b.id = bg.book_id JOIN genre g ON bg.genre_id = g.id WHERE b.id = $1 GROUP BY b.id";
export const searchByQueryParamsQuery =
  "SELECT * FROM book WHERE title ILIKE $1 OR author ILIKE $1 LIMIT $2";
