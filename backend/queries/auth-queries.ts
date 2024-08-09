export const checkEmailExistsQuery = "SELECT email FROM users WHERE email = $1";
export const registerQuery =
  "INSERT INTO users (name, email, password) VALUES ($1, $2, $3)";
export const loginQuery = "SELECT * FROM users WHERE email = $1";
