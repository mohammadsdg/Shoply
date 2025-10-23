import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    const exists = await knex.schema.hasTable('shops');
    if (!exists) {
        return knex.schema.createTable('shops', table => {
            table.increments('ID').primary();
    
            table.integer('user_id').unsigned();
    
            table.string('name', 50);
            table.string('phone', 20);
            table.string('firstname', 50);
            table.string('lastname', 50);
            table.specificType('status', 'tinyint')
            table.timestamp('created_at').defaultTo(knex.fn.now());
            table.timestamp('updated_at').defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))
        })
    }
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('shops');
}

