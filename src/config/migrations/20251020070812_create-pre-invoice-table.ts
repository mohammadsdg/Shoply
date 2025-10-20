import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('pre_invoice', table => {
        table.increments('ID').primary();
        table.integer('stock_item_id').unsigned().notNullable();
        table.double('weight').unsigned().notNullable();
        table.bigint('price').unsigned().notNullable();
        table.string('customer_name').nullable();
        table.enum('status', ['pending', 'approved', 'cancelled'], {
            useNative: true,
            enumName: 'deal_enum'
        }).defaultTo('pending')
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('pre_invoice')
}

