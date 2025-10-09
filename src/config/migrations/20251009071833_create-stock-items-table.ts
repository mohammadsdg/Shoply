import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    // return knex.schema.createTable('')
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('stock_items')
}

