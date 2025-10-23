import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    const exists = await knex.schema.hasTable('sections');
    
    if (!exists) {
        return knex.schema.createTable('sections', table => {
            table.increments('ID').primary();
            table.integer('material_id').unsigned().nullable();
            
            table.string('name', 45).notNullable();
            table.string('param_one', 45);
            table.string('param_two', 45);
            table.string('param_three', 45);
            table.specificType('status', 'tinyint').defaultTo(10);
            table.timestamp('created_at').defaultTo(knex.fn.now());
            table.timestamp('updated_at').defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))
        })
    }
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('sections')
}

