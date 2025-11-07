export async function up(knex) {
    const exists = await knex.schema.hasTable('materials');
    if (!exists) {
        return knex.schema.createTable('materials', table => {
            table.increments('ID').primary();
            table.string('name', 100).notNullable();
            table.specificType('status', 'tinyint').defaultTo(10);
            table.timestamp('created_at').defaultTo(knex.fn.now());
            table.timestamp('updated_at').defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
        });
    }
}
export async function down(knex) {
    return knex.schema.dropTableIfExists('materials');
}
//# sourceMappingURL=20251009055355_create-materials-table.js.map