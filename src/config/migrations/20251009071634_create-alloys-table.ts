import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('alloys', table => {
        table.increments('ID').primary();
        table.integer('material_id').notNullable().unsigned();
        table.string('name', 20).defaultTo(null);
        table.string('code', 20).defaultTo(null);
        table.string('cutting_speed', 20).defaultTo(null);
        table.specificType('status', 'tinyint');
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('alloys');
    
}

