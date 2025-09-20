import mysql from 'mysql2/promise';
import type { Pool, PoolOptions } from 'mysql2/promise';
import getEnvVar from '../utils/getEnvVar.ts';

const {DB_PORT} = process.env;
const portNumber: number | undefined = DB_PORT ? parseInt(DB_PORT, 10) : 3306;

const poolOptions: PoolOptions = {
    host: getEnvVar('DB_HOST'),
    port: portNumber,
    user: getEnvVar('DB_USER'),
    password: getEnvVar('DB_PASSWORD'),
    database: getEnvVar('DB_NAME'),
    waitForConnections: true,
    queueLimit: 10,
    connectionLimit: 5
}
export const pool: Pool = mysql.createPool(poolOptions)

