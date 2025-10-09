
import knex from "knex";
import config from "./knexfile.ts";


import mysql from 'mysql2/promise';
import type { Pool, PoolOptions } from 'mysql2/promise';

const {
    DB_HOST = "localhost",
    DB_USER = "root",
    DB_NAME = "knex",
    DB_PASSWORD = "1234",
    DB_PORT} = 
process.env;
const portNumber: number | undefined = DB_PORT ? parseInt(DB_PORT, 10) : 3306;

const poolOptions: PoolOptions = {
    host: DB_HOST,
    port: Number(portNumber),
    user: DB_USER || 'root',
    password: DB_PASSWORD,
    database: DB_NAME,
    waitForConnections: true,
    queueLimit: 10,
    connectionLimit: 5
}
export const pool: Pool = mysql.createPool(poolOptions)

const environment = (process.env.NODE_ENV || "development")
export const db = knex(config[environment] || "development");

