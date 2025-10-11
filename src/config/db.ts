
import knex from "knex";
import config from "./knexfile.ts";

const { NODE_ENV } = process.env

const environment = (NODE_ENV || "development")
export const db = knex(config[environment] || "development");

async function testConnection() {
    try {
        await db.raw('SELECT 1');
        console.log('Database connection successfull');
    }
    catch(err) {
        console.error('Database failed t o connect')
        process.exit(1);
    }
}

testConnection();