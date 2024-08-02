"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrderQuery = exports.removeAllItemsFromCartQuery = exports.removeItemFromCartQuery = exports.viewCartQuery = exports.totalItemsInCartQuery = exports.addOrSetItemToCartQuery = void 0;
exports.addOrSetItemToCartQuery = {
    add: "INSERT INTO cart (user_id, book_id, quantity) VALUES ($1, $2, $3) ON CONFLICT (user_id, book_id) DO UPDATE SET quantity = cart.quantity + $3 RETURNING *",
    set: "INSERT INTO cart (user_id, book_id, quantity) VALUES ($1, $2, $3) ON CONFLICT (user_id, book_id) DO UPDATE SET quantity = $3 RETURNING *",
};
exports.totalItemsInCartQuery = `
  SELECT SUM(quantity) AS total_items
  FROM cart
  WHERE user_id = $1;
`;
exports.viewCartQuery = `
WITH fees AS (
        SELECT 
          MAX(CASE WHEN fee_type = 'shipping' THEN amount ELSE 0 END) AS shipping,
          MAX(CASE WHEN fee_type = 'service_fee' THEN amount ELSE 0 END) AS service_fee
        FROM fees
      )
      SELECT json_build_object(
        'items', json_agg(
          json_build_object(
            'book_id', cart.book_id,
            'title', book.title,
            'cover_image', book.cover_image,
            'price', book.price,
            'quantity', cart.quantity,
            'added_at', cart.added_at
          ) ORDER BY cart.added_at
        ),
        'subtotal_price', SUM(book.price::numeric * cart.quantity),
        'shipping', fees.shipping,
        'service_fee', fees.service_fee,
        'total_price', SUM(book.price::numeric * cart.quantity) + fees.shipping + fees.service_fee
      ) AS cart
      FROM cart
      JOIN book ON cart.book_id = book.id,
      fees
      WHERE cart.user_id = $1
      GROUP BY cart.user_id, fees.shipping, fees.service_fee;
`;
exports.removeItemFromCartQuery = "DELETE FROM cart WHERE user_id = $1 AND book_id = $2 RETURNING *";
exports.removeAllItemsFromCartQuery = "DELETE FROM cart WHERE user_id = $1 RETURNING *";
exports.createOrderQuery = "SELECT * FROM checkout_order($1, $2, $3)";
