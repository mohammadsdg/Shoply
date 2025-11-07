export async function up(knex) {
    const exists = await knex.schema.hasTable('brands');
    if (!exists) {
        await knex.schema.createTable("brands", (table) => {
            table.increments("ID").primary();
            table.integer("user_id").nullable().unsigned();
            table.string("name", 40).nullable().unique();
            table.text("info", "longtext").nullable();
            table.specificType('status', 'tinyint').defaultTo(10);
            table.timestamp('created_at').defaultTo(knex.fn.now());
            table.timestamp('updated_at').defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
        });
    }
}
export async function down(knex) {
    await knex.schema.dropTableIfExists("brands");
}
//# sourceMappingURL=20251009052402_create-brands-table.js.map