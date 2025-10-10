import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('shops', table => {
        table.increments('ID').primary();

        table.integer('user_id').unsigned();

        table.string('name', 50);
        table.string('phone', 20);
        table.string('firstname', 45);
        table.string('lastname', 45);
        table.specificType('status', 'tinyint')
        table.timestamps(true, true);
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('shops');
}

