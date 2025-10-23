import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    const exists = await knex.schema.hasTable('brands');
    if (!exists) {
        await knex.schema.createTable("brands", (table) => {
            table.increments("ID").primary();
            table.integer("user_id").nullable().unsigned();
            table.string("name", 40).nullable().unique();
            table.text("info", "longtext").nullable();
            table.specificType('status', 'tinyint').defaultTo(10);
            table.timestamp('created_at').defaultTo(knex.fn.now());
            table.timestamp('updated_at').defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))
        });
    }
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists("brands");
}

