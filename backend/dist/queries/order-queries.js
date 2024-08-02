"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrderHistoryByIdQuery = exports.getOrderHistoryQuery = void 0;
exports.getOrderHistoryQuery = "SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC";
exports.getOrderHistoryByIdQuery = `
SELECT json_build_object(
  'items', json_agg(
    json_build_object(
      'book_id', order_items.book_id,
      'quantity', order_items.quantity,
      'price', order_items.price,
      'title', book.title
    )
  ),
  'created_at', orders.created_at,
  'order_id', orders.id,
  'status', orders.status,
  'total_price', orders.total_price,
  'shipping_address', orders.shipping_address,
  'payment', orders.payment
) AS order_details
FROM orders
JOIN order_items ON orders.id = order_items.order_id
JOIN book ON order_items.book_id = book.id
WHERE orders.id = $1
GROUP BY orders.id;
`;
