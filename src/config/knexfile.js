import "dotenv/config";
const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD } = process.env;
const config = {
    development: {
        client: 'mysql2',
        connection: {
            host: DB_HOST || 'localhost',
            port: Number(DB_PORT) || 3306,
            database: DB_NAME || 'shoply_db',
            user: DB_USER || 'shoply_user',
            password: DB_PASSWORD || 'Alirezza@%$7'
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
            host: DB_HOST || 'localhost',
            port: Number(DB_PORT) || 3306,
            database: DB_NAME || 'shoply_db',
            user: DB_USER || 'shoply_user',
            password: DB_PASSWORD || 'Alirezza@%$7'
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
};
export default config;
//# sourceMappingURL=knexfile.js.map