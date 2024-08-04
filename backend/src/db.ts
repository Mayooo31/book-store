import pg from "pg";
import dotenv from "dotenv";
const { Pool } = pg;
dotenv.config();

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "book_store",
  password: "mario",
  port: 5432,
});

// const pool = new Pool({
//   connectionString: process.env.DATABASE_API,
//   ssl: {
//     rejectUnauthorized: false,
//   },
// });

export default pool;
