export async function up(knex) {
    const exists = await knex.schema.hasTable('dimensions');
    if (!exists) {
        return knex.schema.createTable('dimensions', table => {
            table.increments('ID').primary();
            table
                .integer('user_id')
                .notNullable()
                .defaultTo(1)
                .unsigned();
            table.float('dimensions').notNullable();
            table.text('type');
            table.timestamp('created_at').defaultTo(knex.fn.now());
            table.timestamp('updated_at').defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
        });
    }
}
export async function down(knex) {
    return knex.schema.dropTableIfExists('dimensions');
}
//# sourceMappingURL=20251009071709_create-dimensions-table.js.map