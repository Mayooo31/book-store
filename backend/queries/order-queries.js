"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrderHistoryByIdQuery = exports.getOrderHistoryQuery = void 0;
exports.getOrderHistoryQuery = "SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC";
exports.getOrderHistoryByIdQuery = "\nSELECT json_build_object(\n  'items', json_agg(\n    json_build_object(\n      'book_id', order_items.book_id,\n      'quantity', order_items.quantity,\n      'price', order_items.price,\n      'title', book.title\n    )\n  ),\n  'created_at', orders.created_at,\n  'order_id', orders.id,\n  'status', orders.status,\n  'total_price', orders.total_price,\n  'shipping_address', orders.shipping_address,\n  'payment', orders.payment\n) AS order_details\nFROM orders\nJOIN order_items ON orders.id = order_items.order_id\nJOIN book ON order_items.book_id = book.id\nWHERE orders.id = $1\nGROUP BY orders.id;\n";
