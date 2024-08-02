"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrderQuery = exports.removeAllItemsFromCartQuery = exports.removeItemFromCartQuery = exports.viewCartQuery = exports.totalItemsInCartQuery = exports.addOrSetItemToCartQuery = void 0;
exports.addOrSetItemToCartQuery = {
    add: "INSERT INTO cart (user_id, book_id, quantity) VALUES ($1, $2, $3) ON CONFLICT (user_id, book_id) DO UPDATE SET quantity = cart.quantity + $3 RETURNING *",
    set: "INSERT INTO cart (user_id, book_id, quantity) VALUES ($1, $2, $3) ON CONFLICT (user_id, book_id) DO UPDATE SET quantity = $3 RETURNING *",
};
exports.totalItemsInCartQuery = "\n  SELECT SUM(quantity) AS total_items\n  FROM cart\n  WHERE user_id = $1;\n";
exports.viewCartQuery = "\nWITH fees AS (\n        SELECT \n          MAX(CASE WHEN fee_type = 'shipping' THEN amount ELSE 0 END) AS shipping,\n          MAX(CASE WHEN fee_type = 'service_fee' THEN amount ELSE 0 END) AS service_fee\n        FROM fees\n      )\n      SELECT json_build_object(\n        'items', json_agg(\n          json_build_object(\n            'book_id', cart.book_id,\n            'title', book.title,\n            'cover_image', book.cover_image,\n            'price', book.price,\n            'quantity', cart.quantity,\n            'added_at', cart.added_at\n          ) ORDER BY cart.added_at\n        ),\n        'subtotal_price', SUM(book.price::numeric * cart.quantity),\n        'shipping', fees.shipping,\n        'service_fee', fees.service_fee,\n        'total_price', SUM(book.price::numeric * cart.quantity) + fees.shipping + fees.service_fee\n      ) AS cart\n      FROM cart\n      JOIN book ON cart.book_id = book.id,\n      fees\n      WHERE cart.user_id = $1\n      GROUP BY cart.user_id, fees.shipping, fees.service_fee;\n";
exports.removeItemFromCartQuery = "DELETE FROM cart WHERE user_id = $1 AND book_id = $2 RETURNING *";
exports.removeAllItemsFromCartQuery = "DELETE FROM cart WHERE user_id = $1 RETURNING *";
exports.createOrderQuery = "SELECT * FROM checkout_order($1, $2, $3)";
