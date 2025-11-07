export async function up(knex) {
    const exists = await knex.schema.hasTable('groupings');
    if (!exists) {
        return knex.schema.createTable('groupings', table => {
            table.increments('ID').primary();
            table.string('name', 50);
            table.integer('section_id').notNullable().unsigned();
            table.integer('material_id').notNullable().unsigned();
            table.specificType('status', 'tinyint').defaultTo(10);
            table.timestamp('created_at').defaultTo(knex.fn.now());
            table.timestamp('updated_at').defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
        });
    }
}
export async function down(knex) {
    return knex.schema.dropTableIfExists('groupings');
}
//# sourceMappingURL=20251009071724_create-groupings-table.js.map