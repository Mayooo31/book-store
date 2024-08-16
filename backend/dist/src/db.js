"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = __importDefault(require("pg"));
const dotenv_1 = __importDefault(require("dotenv"));
const { Pool } = pg_1.default;
dotenv_1.default.config();
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
exports.default = pool;
