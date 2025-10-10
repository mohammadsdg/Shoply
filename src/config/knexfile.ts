import "dotenv/config";
import type { Knex } from "knex";

const config: { [key: string]: Knex.Config} = {
  development: {
    client: 'mysql2',
    // connection: {
    //   host: process.env.DB_HOST || '156.255.1.98',
    //   port: Number(process.env.DB_PORT) || 3306,
    //   database: process.env.DB_NAME || 'shoply_db',
    //   user:     process.env.DB_USER || 'root',
    //   password: process.env.DB_PASSWORD || '1234'
    // },
    connection: {
      host: '156.255.1.98',
      port: 3306,
      database: 'knex',
      user:     'root',
      password: '1234'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
    }
  },

  production: {
    client: 'mysql2',
    connection: {
      host:     '156.255.1.98',
      port:     3306,
      database: 'shoply_db',
      user:     'root',
      password: '1234'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
    }
  },
}

export default config;