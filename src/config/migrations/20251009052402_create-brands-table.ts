import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("brands", (table) => {
        table.increments("ID").primary();
        table.integer("user_id").nullable().unsigned();
        table.string("name", 40).nullable().unique();
        table.text("info", "longtext").nullable();
        table.specificType('status', 'tinyint').defaultTo(10);
        table.timestamps(true, true)
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists("brands");
}

