import "dotenv/config";
import type { Knex } from "knex";

const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD } = process.env;

const config: { [key: string]: Knex.Config} = {
  development: {
    client: 'mysql2',
    connection: {
      host: DB_HOST || 'localhost',
      port: Number(DB_PORT) || 3306,
      database: DB_NAME || 'test',
      user:     DB_USER || 'root',
      password: DB_PASSWORD || '1234'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: 'src/config/migrations',
      tableName: 'knex_migrations',
    }
  },

  production: {
    client: 'mysql2',
    connection: {
      host:     DB_HOST || '156.255.1.98',
      port:     Number(DB_PORT) || 3306,
      database: DB_NAME || 'shoply_db',
      user:     DB_USER || 'alireza',
      password: DB_PASSWORD || 'Alirezza2547'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: 'src/config/migrations',
      tableName: 'knex_migrations',
    }
  },
}

export default config;