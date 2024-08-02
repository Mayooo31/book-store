"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var pg_1 = __importDefault(require("pg"));
var dotenv_1 = __importDefault(require("dotenv"));
var Pool = pg_1.default.Pool;
dotenv_1.default.config();
// const pool = new Pool({
//   user: "postgres",
//   host: "localhost",
//   database: "book_store",
//   password: "mario",
//   port: 5432,
// });
var pool = new Pool({
    connectionString: process.env.DATABASE_API,
    ssl: {
        rejectUnauthorized: false,
    },
});
exports.default = pool;
