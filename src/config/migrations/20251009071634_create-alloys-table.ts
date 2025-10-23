import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    const exists = await knex.schema.hasTable('alloys');
    
    if (!exists) {
        return knex.schema.createTable('alloys', table => {
            table.increments('ID').primary();
            table.integer('material_id').notNullable().unsigned();
            table.text('name').defaultTo(null);
            table.text('code').defaultTo(null);
            table.text('cutting_speed').defaultTo(null);
            table.specificType('status', 'tinyint');
            table.timestamp('created_at').defaultTo(knex.fn.now());
            table.timestamp('updated_at').defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))
        })
    }
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('alloys');
    
}

